// bcrypt funcion de hashing para contraseñas
const bcrypt = require("bcrypt");

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
      return newUser;
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
      return user;
    }
  }
};
