import "App.css";
import NavToken from "Routes/NavToken";
import ShopListState from "context/Shopping/ShopListState";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import AuthState from "context/Auth/AuthState";

function App() {
	return (
		<ApolloProvider client={client}>
			<AuthState>
				<ShopListState>
					<NavToken />
				</ShopListState>
			</AuthState>
		</ApolloProvider>
	);
}

export default App;
