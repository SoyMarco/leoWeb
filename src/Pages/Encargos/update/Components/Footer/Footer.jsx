import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { CalendarOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";

export default function Footer() {
	const {
		resta,
		restaria,
		statusEncargo,
		dataEncargo,
		pasarAFecha,
		colorVence,
	} = useContext(ReadEncargoContext);

	return (
		<Row justify='space-around'>
			<Button
				disabled={!statusEncargo}
				shape='round'
				style={{
					background: statusEncargo ? colorVence : "gray",
					marginTop: 15,
					color: "white",
					fontSize: "large",
					fontWeight: "bold",
				}}
				// onClick={() => setmodalCalendar(true)}
				icon={
					<CalendarOutlined style={{ fontSize: "large", marginRight: 5 }} />
				}
			>
				{pasarAFecha(dataEncargo?.createAt, "LL")}
			</Button>
			<h1
				style={{
					color: restaria >= 0 ? "green" : "red",
					fontSize: "x-large",
					fontWeight: "bold",
				}}
			>
				{restaria !== 0 && `Restaría $${restaria}`}
			</h1>
			<h1 className='totalRestaApartado'>{resta !== 0 && `Resta $${resta}`}</h1>
		</Row>
	);
}
