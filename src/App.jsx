import ShopListState from "context/Shopping/ShopListState";
import { ApolloProvider } from "@apollo/client";
import AuthState from "context/Auth/AuthState";
import "material-design-icons-iconfont";
import NavToken from "Routes/NavToken";
import client from "config/apollo";
import "Utils/App.css";

export default function App() {
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
