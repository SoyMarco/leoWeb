import { useContext } from "react";
import Encabezado from "../..//Components/Encabezado/Encabezado";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { TablaProductos, TablaAbonos } from "./Tablas";
import { CalendarOutlined } from "@ant-design/icons";
import { Row, Card, Button, Result } from "antd";
import moment from "moment";

export default function CardApartado({ refetch, loading }) {
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

	const pasarAFechaLL = (item) => {
		return moment.unix(item / 1000).format("LL");
	};

	const renderTablaProductosAbonos = () => {
		if (statusApartado) {
			return (
				<Row>
					<TablaProductos refetch={refetch} loading={loading} />
					<TablaAbonos refetch={refetch} loading={loading} />
				</Row>
			);
		}
		const isCanceled = dataApartado?.cancelado[0];
		const title = `Este apartado se canceló el día ${pasarAFecha(
			isCanceled?.fecha
		)}, por ${isCanceled?.vendedor?.toUpperCase()}`;

		return <Result status='error' title={title} />;
	};
	return (
		<Card
			disabled={true}
			actions={[
				<Button
					disabled={!statusApartado}
					shape='round'
					style={{
						marginTop: 5,
						marginRight: 15,
						color: "white",
						border: 0,
						fontWeight: "bold",
						fontSize: "large",
						background: statusApartado ? colorVence : "gray",
					}}
					onClick={() => setmodalCalendar(true)}
					icon={
						<CalendarOutlined style={{ fontSize: "large", marginRight: 5 }} />
					}
				>
					{`${venceEn}, ${pasarAFechaLL(dataApartado.vence)}`}
				</Button>,
				<h1
					style={{
						color: calculateRestaria() >= 0 ? "green" : "red",
						fontSize: "x-large",
						fontWeight: "bold",
					}}
				>
					{abono.abono > 0 ? `Restaría $${calculateRestaria()}` : null}
				</h1>,

				<h1 className='totalRestaApartado'>
					{totalProductos ? `Resta $${totalTotal - totalAbonos}` : null}
				</h1>,
			]}
		>
			<Encabezado refetch={refetch} />
			{renderTablaProductosAbonos()}
		</Card>
	);
}
