import {
	ApolloClient,
	HttpLink,
	ApolloLink,
	InMemoryCache,
	from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { removeToken } from "Utils/token";

// LOCALHOST BACKEND
const UrlBackend = {
	uri: "http://192.168.100.17:4000/",
};

// HEROKU MASTER
//  const UrlBackend = {
// 	uri: "https://leo-gql.herokuapp.com/",
// };

// HEROKU DEV
// const UrlBackend = {
// 	uri: "https://leo-gql-dev.herokuapp.com/",
// };

const httpLink = new HttpLink(UrlBackend);

const authMiddleware = new ApolloLink((operation, forward) => {
	const token = localStorage.token;
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	}));

	return forward(operation);
});
const logoutLink = onError(({ networkError }) => {
	console.log(networkError.statusCode);
	if (networkError.statusCode === 500) {
		removeToken();
	}
});

const client = new ApolloClient({
	connectToDevTools: true,
	cache: new InMemoryCache(),
	link: from([authMiddleware, logoutLink, httpLink]),
});

export default client;
