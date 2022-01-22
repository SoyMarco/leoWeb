import React, { useEffect, useState, useContext } from "react";
import { TablaTotales } from "../Components";
import ErrorConection from "Utils/ErrorConection";
import { GET_CORTE } from "myGraphql/venta";
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

	const [getTotales, setgetTotales] = useState({});

	if (error) {
		ErrorConection(timeLogout);
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
		let { totales } = getData;
		setgetTotales(totales);
	};
	return (
		<>
			<Row justify='center'>
				<h1
					style={{ fontSize: "x-large", fontWeight: "bold", color: "darkblue" }}
				>
					Corte
				</h1>
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
