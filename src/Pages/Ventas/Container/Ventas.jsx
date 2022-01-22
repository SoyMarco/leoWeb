import React, { useState, useContext, useEffect } from "react";
import { TablaProductos, TablaVentas } from "../Components";
import ErrorConection from "Utils/ErrorConection";
import { Row } from "antd";
import { GET_CORTE } from "myGraphql/venta";
import { useQuery } from "@apollo/client";
import AuthContext from "context/Auth/AuthContext";
import Imprimir from "../Components/Imprimir/Imprimir";
import "./ventas.css";

export default function Ventas() {
	const { auth, timeLogout } = useContext(AuthContext);

	let {
		data: getCorteData,
		error,
		refetch,
	} = useQuery(GET_CORTE, {
		notifyOnNetworkStatusChange: true,
	});
	if (error) {
		ErrorConection(timeLogout);
	}

	const [imprimir, setimprimir] = useState(false);
	const [stateRecord, setstateRecord] = useState(null);
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
					setstateRecord={setstateRecord}
					stateRecord={stateRecord}
					setmodalProductos={setmodalProductos}
					setimprimir={setimprimir}
				/>
			</Row>
			<TablaProductos
				stateRecord={stateRecord}
				modalProductos={modalProductos}
				setmodalProductos={setmodalProductos}
				setimprimir={setimprimir}
			/>
			{imprimir ? (
				<Imprimir
					imprimir={imprimir}
					setimprimir={setimprimir}
					stateRecord={stateRecord}
					auth={auth}
				/>
			) : null}
		</div>
	);
}
