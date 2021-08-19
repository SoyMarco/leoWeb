import { notification } from "antd";
import { RiWifiOffLine } from "react-icons/ri";
import { getToken, decodeToken, removeToken } from "Utils/token";
import useAuth from "hooks/useAuth";

export const ErrorConection = () => {
	const { logout } = useAuth();
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
};
export const openNotification = (type, title) => {
	notification[type]({
		message: title,
	});
};
