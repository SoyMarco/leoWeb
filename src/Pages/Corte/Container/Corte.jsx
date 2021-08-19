import React, { useEffect, useState } from "react";
import { TablaProductos, TablaTotales, TablaVentas } from "../Components";
import { SmileOutlined } from "@ant-design/icons";
import { RiWifiOffLine } from "react-icons/ri";
import "./corte.css";
import { Row, Divider, notification } from "antd";
import { useQuery, gql, useMutation } from "@apollo/client";
import { GET_VENTAS_DIA } from "../../../graphql/venta";
import { ErrorConection } from "Utils/openNotification";

import "./corte.css";

const Corte = () => {
	let { data, loading, error, refetch } = useQuery(GET_VENTAS_DIA);
	const [getVentasDia, setgetVentasDia] = useState([]);
	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	useEffect(() => {
		refetch();
	}, []);

	if (error) {
		ErrorConection();
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
