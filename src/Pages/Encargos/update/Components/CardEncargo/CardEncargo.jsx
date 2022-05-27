import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { TablaProductos, TablaAbonos } from "../Tablas";
import Encabezado from "../Encabezado/Encabezado";
import { Row, Card, Result } from "antd";
import Footer from "../Footer/Footer";
import "./encargo.css";

export default function CardEncargo() {
	const { dataEncargo, pasarAFecha } = useContext(ReadEncargoContext);

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
				<TablaProductos />
				<TablaAbonos />
			</Row>
		);
	};
	return (
		<Card>
			<Encabezado />
			<h1 className='nameClientEncargo'>{`ENCARGÓ:  ${dataEncargo?.cliente}`}</h1>
			{renderTablas()}
			<Footer />
		</Card>
	);
}
