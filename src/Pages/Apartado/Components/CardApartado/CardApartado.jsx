import { useContext } from "react";
import Encabezado from "../../Components/Encabezado/Encabezado";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { TablaProductos, TablaAbonos } from "./Tablas";
import { Row, Card, Result } from "antd";
import Footer from "../Footer/Footer";

export default function CardApartado({ refetch, loading }) {
	const { dataApartado, pasarAFecha, statusApartado } =
		useContext(ApartadoContext);

	const renderTablas = () => {
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
		<Card disabled={true}>
			<Encabezado refetch={refetch} />
			{renderTablas()}
			<Footer />
		</Card>
	);
}
