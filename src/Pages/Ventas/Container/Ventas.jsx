import React, { useState, useContext, useEffect } from "react";
import { TablaProductos, TablaVentas } from "../Components";
import ErrorConection from "Utils/ErrorConection";
import { Row } from "antd";
import { GET_CORTE } from "graphql/venta";
import { useQuery } from "@apollo/client";
import AuthContext from "context/Auth/AuthContext";

import "./ventas.css";

export default function Ventas() {
	const { timeLogout } = useContext(AuthContext);

	let {
		data: getCorteData,
		error,
		loading,
		refetch,
	} = useQuery(GET_CORTE, {
		notifyOnNetworkStatusChange: true,
	});
	if (error) {
		ErrorConection(timeLogout);
	}
	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	const [getVentas, setgetVentas] = useState([]);
	const [modalProductos, setmodalProductos] = useState(false);

	useEffect(() => {
		refetch();
		timeLogout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (getCorteData) {
			refetchCorte(getCorteData.getCorte);
		}
	}, [getCorteData]);

	const refetchCorte = (getData) => {
		let { ventas } = getData;
		setgetVentas(ventas);
	};
	return (
		<div>
			<Row justify='center'>
				<h1
					style={{ fontSize: "x-large", fontWeight: "bold", color: "darkblue" }}
				>
					Ventas
				</h1>
			</Row>
			<Row>
				<TablaVentas
					getVentas={getVentas}
					loading={loading}
					loader={loader}
					setloader={setloader}
					setstateRecord={setstateRecord}
					stateRecord={stateRecord}
					refetchCorte={refetchCorte}
					setmodalProductos={setmodalProductos}
				/>
			</Row>
			{/* <TablaProductos
				stateRecord={stateRecord}
				loading={loading}
				modalProductos={modalProductos}
				setmodalProductos={setmodalProductos}
			/> */}
		</div>
	);
}
