import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { CalendarOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";

export default function Footer() {
	const {
		abono,
		calculateRestaria,
		totalProductos,
		totalTotal,
		totalAbonos,
		statusEncargo,
		dataEncargo,
		pasarAFecha,
		colorVence,
	} = useContext(ReadEncargoContext);
	console.log("@@@@@", totalTotal, totalAbonos);
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
					color: calculateRestaria() >= 0 ? "green" : "red",
					fontSize: "x-large",
					fontWeight: "bold",
				}}
			>
				{abono?.abono > 0 ? `Restaría $${calculateRestaria()}` : null}
			</h1>
			<h1 className='totalRestaApartado'>
				{totalProductos ? `Resta $${totalTotal - totalAbonos}` : null}
			</h1>
		</Row>
	);
}
