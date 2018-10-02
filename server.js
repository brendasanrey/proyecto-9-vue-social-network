const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });

const resolvers = require("./resolvers");
const User = require("./models/User");
const Post = require("./models/Post");

// Obtener la ruta absoluta del archivo typeDefs
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");

// Conexión con la base de datos mlab
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("BD conectada");
  })
  .catch(error => {
    console.log(error);
  });

// Verificar el token generado con jwt obtenido del cliente
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (error) {
      throw new AuthenticationError(
        "Tu sesión ha expirado. Ingresa nuevamente"
      );
    }
  }
};

// Crear servidor Apollo/GraphQl usando typedefs, resolvers y context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Obtener el token
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  }
});

//{ port: process.env.PORT || 4000 }
server.listen(4000).then(({ url }) => {
  console.log("Server is running " + url);
});
