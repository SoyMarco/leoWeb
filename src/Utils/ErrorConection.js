import React, { useContext } from "react";
import { notification } from "antd";
import { RiWifiOffLine } from "react-icons/ri";
import { decodeToken } from "Utils/token";
import AuthContext from "context/Auth/AuthContext";

export default function ErrorConection() {
	const { logout } = useContext(AuthContext);
	notification.open({
		message: "Error de conexión",
		description: "Intentalo más tarde",
		icon: <RiWifiOffLine style={{ color: "red" }} />,
	});
	let token = localStorage.token;
	if (token) {
		let dataToken = decodeToken(token);
		let timeNow = Math.round(Date.now() / 1000);
		if (dataToken.exp < timeNow) {
			logout();
		}
	} else {
		logout();
	}
}
