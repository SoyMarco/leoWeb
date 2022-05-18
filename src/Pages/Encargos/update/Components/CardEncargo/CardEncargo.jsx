import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { TablaProductos, TablaAbonos } from "../../Components";
import { CalendarOutlined } from "@ant-design/icons";
import Encabezado from "../Encabezado/Encabezado";
import { Row, Card, Button, Result } from "antd";

export default function CardEncargo() {
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

	const renderTablas = () => {
		const isCanceled = dataEncargo?.cancelado[0];
		if (isCanceled) {
			const title = `Este apartado se canceló el día ${pasarAFecha(
				isCanceled?.fecha,
				"LL"
			)}, por ${isCanceled?.vendedor?.toUpperCase()}`;

			return <Result status='error' title={title} />;
		}

		return (
			<Row>
				<Row>
					<TablaProductos />
					<TablaAbonos />
				</Row>
			</Row>
		);
	};
	return (
		<Card
			actions={[
				<Button
					disabled={!statusEncargo}
					shape='round'
					style={{
						background: statusEncargo ? colorVence : "gray",
						marginTop: 5,
						marginRight: 15,
						color: "white",
						border: 0,
						fontSize: "large",
						fontWeight: "bold",
					}}
					// onClick={() => setmodalCalendar(true)}
					icon={
						<CalendarOutlined style={{ fontSize: "large", marginRight: 5 }} />
					}
				>
					{pasarAFecha(dataEncargo?.createAt, "LL")}
				</Button>,

				<h1
					style={{
						color: calculateRestaria() >= 0 ? "green" : "red",
						fontSize: "x-large",
						fontWeight: "bold",
					}}
				>
					{abono?.abono > 0 ? `Restaría $${calculateRestaria()}` : null}
				</h1>,

				<h1 className='totalRestaEncargo'>
					{totalProductos ? `Resta $${totalTotal - totalAbonos}` : null}
				</h1>,
			]}
		>
			<Encabezado />
			<h1 className='nameClient'>{`Cliente:  ${dataEncargo?.cliente}`}</h1>
			{renderTablas()}
		</Card>
	);
}
