const {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} = require("@apollo/client");
const { createUploadLink } = require("apollo-upload-client");
const { FileUpload } = require("./containers");

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
