/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useMemo } from "react";
import Encabezado from "../../Components/Encabezado/Encabezado";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { TablaProductos, TablaAbonos } from "./Tablas";
import { Row, Card, Result } from "antd";
import Footer from "../Footer/Footer";

export default function CardApartado() {
	const { dataApartado, pasarAFecha, statusApartado } =
		useContext(ApartadoContext);

	const renderTablas = () => {
		if (statusApartado) {
			return (
				<Row>
					<TablaProductos />
					<TablaAbonos />
				</Row>
			);
		}
		const isCanceled = dataApartado?.cancelado[0];
		const title = `Este apartado se canceló el día ${pasarAFecha(
			isCanceled?.fecha
		)}, por ${isCanceled?.vendedor?.toUpperCase()}`;

		return <Result status='error' title={title} />;
	};
	const contentTables = useMemo(() => renderTablas(), [statusApartado]);

	return (
		<Card disabled={true}>
			<Encabezado />
			<h1 className='nameClient'>{`Cliente:  ${dataApartado?.cliente}`}</h1>
			{contentTables}
			<Footer />
		</Card>
	);
}
