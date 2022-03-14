import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { FileUpload } from "./containers";

const client = new ApolloClient({
  link: createUploadLink({
    uri: "http://localhost:4000/graphql",
  }),
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <FileUpload />
    </ApolloProvider>
  );
};

export default App;
