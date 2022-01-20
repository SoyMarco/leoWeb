import { notification } from "antd";
import { RiWifiOffLine } from "react-icons/ri";

export default function ErrorConection(timeLogout) {
	notification.open({
		message: "Error de conexión",
		description: "Intentalo más tarde",
		icon: <RiWifiOffLine style={{ color: "red" }} />,
	});
	timeLogout();
}
