import React from "react";
import { notification } from "antd";
import { RiWifiOffLine } from "react-icons/ri";
import { decodeToken } from "Utils/token";
import useAuth from "hooks/useAuth";

export default function ErrorConection() {
	const { logout } = useAuth();
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
