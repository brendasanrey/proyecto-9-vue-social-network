const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
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
  .then(() => console.log("bd connected"))
  .catch(err => console.log(err));

// Crear servidor Apollo/GraphQl usando typedefs, resolvers y context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

server.listen(4000).then(({ url }) => {
  console.log("Server is running " + url);
});
