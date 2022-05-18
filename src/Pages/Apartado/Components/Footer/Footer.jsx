import { useContext } from "react";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { CalendarOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";

export default function Footer() {
	const {
		dataApartado,
		calculateRestaria,
		abono,
		totalAbonos,
		totalProductos,
		totalTotal,
		venceEn,
		colorVence,
		pasarAFecha,
		statusApartado,
		setmodalCalendar,
	} = useContext(ApartadoContext);

	return (
		<Row justify='space-around'>
			<Button
				disabled={!statusApartado}
				shape='round'
				style={{
					marginTop: 25,
					color: "white",
					fontWeight: "bold",
					fontSize: "large",
					background: statusApartado ? colorVence : "gray",
				}}
				onClick={() => setmodalCalendar(true)}
				icon={
					<CalendarOutlined style={{ fontSize: "large", marginRight: 5 }} />
				}
			>
				{`${venceEn}, ${pasarAFecha(dataApartado.vence, "LL")}`}
			</Button>

			<h1
				style={{
					color: calculateRestaria() >= 0 ? "green" : "red",
					fontSize: "x-large",
					fontWeight: "bold",
				}}
			>
				{abono.abono > 0 ? `Restaría $${calculateRestaria()}` : null}
			</h1>

			<h1 className='totalRestaApartado'>
				{totalProductos ? `Resta $${totalTotal - totalAbonos}` : null}
			</h1>
		</Row>
	);
}
