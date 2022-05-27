import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import { getToken } from "../Utils/token";

// LOCALHOST BACKEND
// const UrlBackend = {
// 	uri: "http://192.168.100.17:4000/",
// };

// HEROKU DEV
// const UrlBackend = {
// 	uri: "https://leo-gql-dev.herokuapp.com/",
// };

// HEROKU MASTER
const UrlBackend = {
	uri: "https://leo-gql.herokuapp.com/",
};

const httpLik = createUploadLink(UrlBackend);
const authLink = setContext((_, { headers }) => {
	const token = getToken();

	return {
		headers: {
			...headers,
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	connectToDevTools: true,
	cache: new InMemoryCache(),
	link: authLink.concat(httpLik),
});

export default client;
