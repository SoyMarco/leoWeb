/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import "App.css";
import "material-design-icons-iconfont";
import AuthContext from "context/AuthContext";
import NavToken from "Routes/NavToken";
import { decodeToken, removeToken } from "Utils/token";
import Login from "Pages/Login/Container/Login";
import { openNotification } from "Utils/openNotification";

function App({ token }) {
	const [auth, setAuth] = useState(undefined);
	const timeLogout = () => {
		if (token) {
			try {
				let dataToken = decodeToken(token);
				let timeNow = Math.round(Date.now() / 1000);
				if (dataToken.exp > timeNow) {
					setAuth(dataToken);
				} else {
					openNotification("error", "Tu sesión expiro. Vuelve a ingresar");
					logout();
				}
			} catch (error) {
				setAuth(null);
			}
		} else {
			setAuth(null);
		}
	};

	useEffect(() => {
		timeLogout();
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
				{auth ? <NavToken setAuth /> : <Login />}
			</AuthContext.Provider>
		</>
	);
}

export default App;
