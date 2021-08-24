import React, { useEffect, useState } from "react";
import { TablaProductos, TablaTotales, TablaVentas } from "../Components";
import "./corte.css";
import { Row, Divider } from "antd";
import { useQuery } from "@apollo/client";
import { GET_VENTAS_DIA } from "../../../graphql/venta";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
import "./corte.css";

const Corte = () => {
	let { data, loading, error, refetch } = useQuery(GET_VENTAS_DIA);
	const [getVentasDia, setgetVentasDia] = useState([]);
	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	const { logout } = useAuth();
	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		ErrorConection(logout);
	}
	useEffect(() => {
		if (data) {
			let { getVentasDia } = data;
			let listaVentas = getVentasDia.map((item) => {
				return { ...item, key: item.folio };
			});
			setgetVentasDia(listaVentas);
		}
	}, [data]);

	return (
		<>
			<Row>
				<TablaVentas
					getVentasDia={getVentasDia}
					loading={loading}
					loader={loader}
					setloader={setloader}
					refetch={refetch}
					setstateRecord={setstateRecord}
					stateRecord={stateRecord}
				/>
				<TablaProductos stateRecord={stateRecord} loading={loading} />
			</Row>

			<Divider orientation='left'>Total del día</Divider>

			<Row>
				<TablaTotales getVentasDia={getVentasDia} loading={loading} />
			</Row>
		</>
	);
};

export default Corte;
