import React, { useReducer, useEffect } from "react";
import { decodeToken, removeToken } from "Utils/token";
import Login from "Pages/Login/Container/Login";
import { openNotification } from "Utils/openNotification";

import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import { SET_AUTH } from "./types";

export default function AuthState(props) {
	const initialState = {
		auth: undefined,
	};
	const [state, dispatch] = useReducer(AuthReducer, initialState);
	useEffect(() => {
		timeLogout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const timeLogout = () => {
		let token = localStorage.token;
		if (token) {
			try {
				let dataToken = decodeToken(token);
				let timeNow = Math.round(Date.now() / 1000);
				if (dataToken.exp > timeNow && dataToken.name) {
					setAuth(dataToken);
				} else {
					openNotification("error", "Tu sesión expiro. Vuelve a ingresar");
					logout();
				}
			} catch (error) {
				console.log("timeLogout@", error);
			}
		} else {
			logout();
		}
	};

	const logout = () => {
		removeToken();
		setAuth(null);
	};
	const setAuth = (user) => {
		dispatch({
			type: SET_AUTH,
			payload: user,
		});
	};
	return (
		<AuthContext.Provider
			value={{
				auth: state.auth,
				setAuth,
				logout,
				timeLogout,
			}}
		>
			{state.auth ? props.children : <Login />}
		</AuthContext.Provider>
	);
}
