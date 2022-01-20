/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import "App.css";
import "material-design-icons-iconfont";
import NavToken from "Routes/NavToken";
import AuthState from "context/Auth/AuthState";
import ShopListState from "context/Shopping/ShopListState";

function App() {
	return (
		<AuthState>
			<ShopListState>
				<NavToken />
			</ShopListState>
		</AuthState>
	);
}

export default App;
