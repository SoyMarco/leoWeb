import { notification } from "antd";
import { RiWifiOffLine } from "react-icons/ri";

export const openNotification = (type, title) => {
	notification[type]({
		message: title,
	});
};

export const errorConection = () => {
	notification.open({
		message: "Error de conexión",
		description: "Intentalo más tarde",
		icon: <RiWifiOffLine style={{ color: "red" }} />,
	});
};
