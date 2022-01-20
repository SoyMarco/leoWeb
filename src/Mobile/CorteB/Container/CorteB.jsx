import React, { useEffect, useState, useContext } from "react";
import { TablaTotales } from "../Components";
import ErrorConection from "Utils/ErrorConection";
import { GET_CORTE } from "graphql/venta";
import { useQuery } from "@apollo/client";
import { Row } from "antd";
import "./corte.css";
import AuthContext from "context/Auth/AuthContext";
const CorteB = () => {
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
				<h1 style={{ fontSize: "x-large", fontWeight: "bold", color: "blue" }}>
					Corte
				</h1>
			</Row>
			{getTotales ? (
				<TablaTotales getTotales={getTotales} loading={loading} />
			) : null}
		</>
	);
};

export default CorteB;
