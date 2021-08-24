// import React, { useEffect } from "react";
import { notification } from "antd";
import { RiWifiOffLine } from "react-icons/ri";
import { getToken, decodeToken } from "Utils/token";

export default function ErrorConection(logout) {
	notification.open({
		message: "Error de conexión",
		description: "Intentalo más tarde",
		icon: <RiWifiOffLine style={{ color: "red" }} />,
	});
	let token = getToken();
	if (token) {
		let dataToken = decodeToken(token);
		let timeNow = Math.round(Date.now() / 1000);
		if (dataToken.exp < timeNow) {
			logout();
		}
	}
}
