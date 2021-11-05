import React from "react";
import { render } from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";

const token = localStorage.token;

render(
	<ApolloProvider client={client}>
		<App token={token} />
	</ApolloProvider>,
	document.getElementById("root")
);

reportWebVitals();
