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
        throw new Error("User already exists");
      }
      // Crea un nuevo usuario y le pasa los valores de los argumentos recibidos
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return newUser;
    }
  }
};
