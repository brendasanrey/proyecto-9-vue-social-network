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
