import { notification } from "antd";

export const openNotification = (type, title) => {
	notification[type]({
		message: title,
	});
};
