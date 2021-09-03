import React, { useEffect, useState } from "react";
import { TablaProductos, TablaTotales, TablaVentas } from "../Components";
import "./corte.css";
import { Row, Divider, Col } from "antd";
import { useQuery } from "@apollo/client";
import { GET_VENTAS_DIA } from "../../../graphql/venta";
import { GET_CAJA_DIA } from "../../../graphql/caja";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
import "./corte.css";

const Corte = () => {
	let { data, loading, error, refetch } = useQuery(GET_VENTAS_DIA);
	let { data: data2, refetch: refetchCaja } = useQuery(GET_CAJA_DIA);
	const [getVentasDia, setgetVentasDia] = useState([]);
	const [cajaDia, setcajaDia] = useState([]);
	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	const { logout } = useAuth();
	useEffect(() => {
		refetch();
		refetchCaja();
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
	useEffect(() => {
		if (data2) {
			let { getCajaDia } = data2;
			let listaCaja = getCajaDia.map((item) => {
				return { ...item, key: item._id };
			});
			setcajaDia(listaCaja);
		}
	}, [data2]);

	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "x-large", fontWeight: "bold", color: "blue" }}>
					Corte
				</h1>
			</Row>
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

			<Divider orientation='left' style={{ marginBottom: 0 }}>
				Total del día
			</Divider>

			<TablaTotales
				getVentasDia={getVentasDia}
				cajaDia={cajaDia}
				loading={loading}
			/>
		</>
	);
};

export default Corte;
