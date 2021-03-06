import React, { useReducer, useEffect } from "react";
import { decodeToken, removeToken } from "Utils/token";
import Login from "Pages/Login/Container/Login";
import { openNotification } from "Utils/openNotification";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import { SET_AUTH, SET_FIRST_LOGIN, SET_IS_LOADING } from "./types";

const AuthState = (props) => {
	const initialState = {
		auth: undefined,
		firstLogin: undefined,
		isLoading: false,
	};

	const [state, dispatch] = useReducer(AuthReducer, initialState);
	useEffect(() => {
		timeLogout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const timeLogout = () => {
		const token = localStorage.token;
		if (token) {
			try {
				const dataToken = decodeToken(token);
				const timeNow = Math.round(Date.now() / 1000);
				if (dataToken.exp > timeNow && dataToken.name) {
					setAuth(dataToken);
				} else {
					logout();
					openNotification("error", "Tu sesión expiro. Vuelve a ingresar");
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
	const setFirstLogin = (size) => {
		dispatch({
			type: SET_FIRST_LOGIN,
			payload: size,
		});
	};
	const setIsLoading = (isLoading) => {
		dispatch({
			type: SET_IS_LOADING,
			payload: isLoading,
		});
	};

	const navegateAuth = () => {
		if (state.auth) {
			return props.children;
		}
		return <Login />;
	};

	return (
		<AuthContext.Provider
			value={{
				auth: state.auth,
				firstLogin: state.firstLogin,
				setAuth,
				logout,
				timeLogout,
				setFirstLogin,
				isLoading: state.isLoading,
				setIsLoading,
			}}
		>
			{navegateAuth()}
		</AuthContext.Provider>
	);
};
export default AuthState;
