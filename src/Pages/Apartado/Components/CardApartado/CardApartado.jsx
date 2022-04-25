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
		} else {
			return (
				<Result
					status='error'
					title={`Este apartado se canceló el día ${pasarAFecha(
						dataApartado?.cancelado[0]?.fecha
					)}, por ${dataApartado?.cancelado[0]?.vendedor?.toUpperCase()}`}
				/>
			);
		}
	};
	return (
		<Card
			disabled={true}
			actions={[
				<Button
					disabled={!statusApartado}
					shape='round'
					style={
						statusApartado
							? {
									background: colorVence,
									marginTop: 5,
									marginRight: 15,
									color: "white",
									border: 0,
									fontSize: "large",
									fontWeight: "bold",
							  }
							: {
									background: "gray",
									marginTop: 5,
									marginRight: 15,
									color: "white",
									border: 0,
									fontWeight: "bold",
							  }
					}
					onClick={() => setmodalCalendar(true)}
					icon={
						<CalendarOutlined style={{ fontSize: "large", marginRight: 5 }} />
					}
				>
					{`${venceEn}, ${pasarAFechaLL(dataApartado.vence)}`}
				</Button>,
				<h1
					style={
						calculateRestaria() >= 0
							? {
									color: "green",
									fontSize: "x-large",
									fontWeight: "bold",
							  }
							: {
									color: "red",
									fontSize: "x-large",
									fontWeight: "bold",
							  }
					}
				>
					{abono.abono > 0 ? `Restaría $${calculateRestaria()}` : null}
				</h1>,

				<h1 className='totalRestaApartado'>
					{totalProductos ? `Resta $${totalTotal - totalAbonos}` : null}
				</h1>,
			]}
		>
			<Encabezado refetch={refetch} />
			{
				/* Tablas PRODUCTOS ABONOS*/
				renderTablaProductosAbonos()
			}
		</Card>
	);
}
