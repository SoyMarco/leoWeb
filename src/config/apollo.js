import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import { getToken } from "../Utils/token";

/* LOCAL */
export const UrlBackend = {
	uri: "http://localhost:4000/",
};
export const UrlFrontend = "http://localhost:3000/";

const httpLik = createUploadLink(UrlBackend.uri);

/* HEROKU */
/*  const httpLik = createUploadLink({
   uri: "https://insta-marco.herokuapp.com/",
 });   */

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
