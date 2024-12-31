import {
  ColorModeScript,
  ChakraProvider,
} from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import Router from "./Router";
import theme from "./theme";

const container = document.getElementById("root");
if (!container)
  throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

const baseURI =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCALIP ? `http://${process.env.REACT_APP_LOCALIP}:8080` : "http://localhost:8080"
    : "https://zsquared-server.fly.dev";

if (process.env.NODE_ENV === "development") console.log("API HOST:", baseURI);

const link = new HttpLink({
  uri: baseURI + "/graphql",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <ColorModeScript
          initialColorMode={theme.config.initialColorMode}
        />
        <Router />
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
