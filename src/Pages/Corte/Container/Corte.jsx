import React, { useEffect, useState, useContext } from "react";
import { TablaProductos, TablaTotales, TablaVentas } from "../Components";
import ErrorConection from "Utils/ErrorConection";
import { GET_CORTE } from "graphql/venta";
import { useQuery } from "@apollo/client";
import { Row } from "antd";
import "./corte.css";
import AuthContext from "context/Auth/AuthContext";

const Corte = () => {
	const { timeLogout } = useContext(AuthContext);

	let {
		data: getCorteData,
		error,
		loading,
		refetch,
	} = useQuery(GET_CORTE, {
		notifyOnNetworkStatusChange: true,
	});

	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	const [getTotales, setgetTotales] = useState({});
	const [getVentas, setgetVentas] = useState([]);

	if (error) {
		ErrorConection();
	}

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
		let { totales, ventas } = getData;
		setgetTotales(totales);
		setgetVentas(ventas);
	};
	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "x-large", fontWeight: "bold", color: "blue" }}>
					Corte
				</h1>
			</Row>
			<Row style={{ border: 0, margin: 0, padding: 0 }}>
				<TablaVentas
					getVentas={getVentas}
					loading={loading}
					loader={loader}
					setloader={setloader}
					setstateRecord={setstateRecord}
					stateRecord={stateRecord}
					refetchCorte={refetchCorte}
				/>
				<TablaProductos stateRecord={stateRecord} loading={loading} />
			</Row>

			{/* <Divider orientation='left' style={{ marginBottom: 0 }}>
				Total del día
			</Divider> */}
			{getTotales ? (
				<TablaTotales getTotales={getTotales} loading={loading} />
			) : null}
		</>
	);
};

export default Corte;
