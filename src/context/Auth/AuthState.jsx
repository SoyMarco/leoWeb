/* eslint-disable react-hooks/exhaustive-deps */
import { useReducer, useEffect, useMemo } from "react";
import { decodeToken, removeToken } from "Utils/token";
import Login from "Pages/Login/Container/Login";
import { openNotification } from "Utils/openNotification";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import { SET_AUTH, SET_FIRST_LOGIN, SET_IS_LOADING } from "./types";
import { Skeleton } from "antd";
const initialState = {
	auth: undefined,
	firstLogin: undefined,
	isLoading: false,
};

const AuthState = (props) => {
	const [state, dispatch] = useReducer(AuthReducer, initialState);

	useEffect(() => {
		timeLogout();
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
				}
			} catch (error) {
				console.log("timeLogout@@@@@", error);
				openNotification("error", "Tu sesión expiro. Vuelve a ingresar");
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
		if (user?.exp !== state?.auth?.exp)
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
		const token = localStorage.token;
		if (token) {
			return (
				<Skeleton
					avatar
					active
					paragraph={{
						rows: 10,
					}}
				/>
			);
		}
		return <Login />;
	};
	const typeRender = useMemo(() => navegateAuth(), [state.auth]);
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
			{typeRender}
		</AuthContext.Provider>
	);
};
export default AuthState;
