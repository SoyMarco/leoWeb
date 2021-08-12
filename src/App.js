import React, { useState, useMemo, useEffect } from "react";
import "./App.css";
import "material-design-icons-iconfont";
import AuthContext from "./context/AuthContext";
import NavToken from "./Routes/NavToken";
import { getToken, decodeToken, removeToken } from "./Utils/token";
import Login from "./Login/Container/Login";
function App() {
	const [auth, setAuth] = useState(undefined);

	useEffect(() => {
		const token = getToken();
		if (!token) {
			setAuth(null);
		} else {
			setAuth(decodeToken(token));
		}
	}, []);

	const logout = () => {
		removeToken();
		setAuth(null);
	};

	const setUser = (user) => {
		setAuth(user);
	};

	const authData = useMemo(
		() => ({
			auth,
			logout,
			setUser,
		}),
		[auth]
	);

	if (auth === undefined) return null;

	return (
		<>
			<AuthContext.Provider value={authData}>
				{auth ? <NavToken /> : <Login />}
			</AuthContext.Provider>
		</>
	);
}

export default App;
