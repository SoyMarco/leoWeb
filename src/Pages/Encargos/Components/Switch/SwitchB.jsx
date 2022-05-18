import { Switch, Tooltip } from "antd";

export default function SwitchB({ loader, checked, onClick }) {
	return (
		<Tooltip
			placement='top'
			title={checked ? "Encargo GUARDADO" : "Encargo SIN guardar"}
		>
			<Switch
				loading={loader}
				checked={checked}
				onClick={onClick}
				style={{
					background: checked ? "limegreen" : "red",
					boxShadow: "5px 5px 29px #b3b3b3, -5px -5px 29px #ffffff",
				}}
				defaultChecked
			></Switch>
		</Tooltip>
	);
}
