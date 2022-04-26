import {
	ApolloClient,
	HttpLink,
	ApolloLink,
	InMemoryCache,
	concat,
} from "@apollo/client";

// LOCALHOST BACKEND
//  const UrlBackend = {
// 	uri: "http://192.168.100.17:4000/",
// };

// HEROKU MASTER
//  const UrlBackend = {
// 	uri: "https://leo-gql.herokuapp.com/",
// };

// HEROKU DEV
const UrlBackend = {
	uri: "https://leo-gql-dev.herokuapp.com/",
};

const httpLink = new HttpLink(UrlBackend);
const authMiddleware = new ApolloLink((operation, forward) => {
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: localStorage.getItem("token") || null,
		},
	}));
	return forward(operation);
});

const client = new ApolloClient({
	connectToDevTools: true,
	cache: new InMemoryCache(),
	link: concat(authMiddleware, httpLink),
});

export default client;
