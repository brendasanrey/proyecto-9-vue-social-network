// bcrypt funcion de hashing para contraseñas
const bcrypt = require("bcrypt");
// Paquete para crear tokens de acceso
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    // primer argumento 'root value'
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createdDate: "desc" })
        .populate({
          path: "createdBy",
          model: "User"
        });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({
        _id: postId
      }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post;
    },
    getCurrentUser: async (_, args, { User, currentUser }) => {
      // Verifica si existe un usuario activo
      if (!currentUser) {
        return null;
      }
      // Buscar el usuario y traer las propiedades que le pertenecen (favoritos y publicaciones)
      const user = await User.findOne({
        username: currentUser.username
      }).populate({ path: "favorites", model: "Post" });
      return user;
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSize);
      } else {
        // Si el 'pageSize' > 1 se especifica cuantos documentos saltar
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      // Comprobar que el termido de busqueda no sea vacio
      if (searchTerm) {
        // Buscar todas las publicaciones que coincidan con 'searchTerm'
        const searchResults = await Post.find(
          { $text: { $search: searchTerm } },
          { score: { $meta: "textScore" } }
        )
          // Con sort se ordenan los resultados primero por el 'score' y después por el número de likes
          .sort({ score: { $meta: "textScore" }, likes: "desc" })
          // Limitar el numero de resultados a 5
          .limit(5);
        return searchResults;
      }
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      // Encontrar las publicaciones creadas por el usuario activo (por id)
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    }
  },
  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const post = await Post.findOneAndUpdate(
        // Encontrar la publicacion por su id
        { _id: postId },
        // Agregar el nuevo comentario al inicio del array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        { new: true }
      ).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post.messages[0];
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      // Encuentra el post para añadir +1 al campo 'likes'
      const post = await Post.findOneAndUpdate(
        // Hace busqueda por ID
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      // Encuentra al usuario activo y agrega el post a su array de favoritos
      const user = await User.findOneAndUpdate(
        // Hace busqueda por username
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
      // Retorna los likes que tiene el post y el arreglo de favoritos del usuario
      return { likes: post.likes, favorites: user.favorites };
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      // Encuentra el post para quitar -1 al campo 'likes'
      const post = await Post.findOneAndUpdate(
        // Hace busqueda por ID
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      // Encuentra al usuario activo y elimina el post a su array de favoritos
      const user = await User.findOneAndUpdate(
        // Hace busqueda por username
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
      // Retorna los likes que tiene el post y el arreglo de favoritos del usuario
      return { likes: post.likes, favorites: user.favorites };
    },
    signupUser: async (_, { username, email, password }, { User }) => {
      // Verifica si ya existe un usuario con ese nombre
      const user = await User.findOne({
        username
      });
      if (user) {
        throw new Error("El usuario proporcionado ya existe");
      }
      // Crea un nuevo usuario y le pasa los valores de los argumentos recibidos
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    },
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      // Comparar la contraseña ingresada con la almacenada en la base
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Contraseña incorrecta");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    }
  }
};
