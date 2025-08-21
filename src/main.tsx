import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import App from "./App";

// Create an HTTP link to your GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:1337/graphql",
});

// Middleware to add Authorization header with token for each request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token"); // Ensure token is set on login
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create Apollo Client with authLink middleware concatenated with httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Render React app wrapped with ApolloProvider for Apollo Client context
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
