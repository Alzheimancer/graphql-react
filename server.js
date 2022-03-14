import express from "express";
import cors from "cors";
import path from "path";
import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload";
import { finished } from "stream/promises";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";

const generateRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

console.log(generateRandomString(5));

const typeDefs = gql`
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type File {
    # filename: String!
    # mimetype: String!
    # encoding: String!
    url: String!
  }

  type Query {
    # This is only here to satisfy the requirement that at least one
    # field be present within the 'Query' type.  This example does not
    # demonstrate how to fetch uploads back.
    hello: String!
  }

  type Mutation {
    # Multiple uploads are supported. See graphql-upload docs for details.
    fileUpload(file: [Upload]!): File!
  }
`;

const resolvers = {
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Query: {
    hello: () => "Hello World!",
  },
  Upload: GraphQLUpload,

  Mutation: {
    fileUpload: async (parent, { file }) => {
      // console.log(file);
      const { createReadStream, filename, mimetype, encoding } = await file[0];
      console.log(filename);

      const { ext } = path.parse(filename);

      const randomName = generateRandomString(12) + ext;
      const stream = createReadStream();
      console.log(typeof stream);

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const pathName = path.join(__dirname, `/public/images/${randomName}`);

      // This is purely for demonstration purposes and will overwrite the
      // local-file-output.txt in the current working directory on EACH upload.
      const out = createWriteStream(pathName);
      stream.pipe(out);
      await finished(out);

      return { url: `http://localhost:4000/images/${randomName}` };
    },
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });
  app.use(express.static("public"));
  app.use(cors());

  await new Promise((r) => app.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
