import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import * as Mongoose from "mongoose";
import { UserResolver } from "./UserService/UserResolver";

async function startServer() {
  require("dotenv").config(__dirname + ".env");
  const schema = await buildSchema({
    // @ts-ignore
    resolvers: [UserResolver],
    emitSchemaFile: true,
  });
  const app = Express();
  const MONGO_USER = process.env.MONGODB_USER;
  const MONGO_PASS = process.env.MONGODB_PASS;
  Mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.oikjp.mongodb.net/trade?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
    .then(() => {
      console.log("Mongodb is connected successfully");
      const server = new ApolloServer({
        schema,
        context: () => ({}),
      });
      server.applyMiddleware({ app });
      const PORT = process.env.PORT;
      app.listen(PORT, () => {
        console.log(`server is running on PORT ${PORT}`);
      });
    })
    .catch((err: Error) => {
      console.log(err);
    });
}
startServer();
