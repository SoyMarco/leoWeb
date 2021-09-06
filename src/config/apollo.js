import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import { getToken } from "../Utils/token";

/* LOCAL */
const baseUrlFront = window.location;
/* LOCAL BACKEND*/
// export const UrlBackend = {
// 	uri: "http://192.168.100.17:4000/",
// };
export const UrlFrontend = `${baseUrlFront.origin}/`;

/* HEROKU */
export const UrlBackend = {
	uri: "https://leo-gql.herokuapp.com/",
};
/* HEROKU DEV*/
// export const UrlBackend = {
// 	uri: "https://leo-gql-dev.herokuapp.com/",
// };

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
