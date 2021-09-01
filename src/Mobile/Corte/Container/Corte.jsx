import React, { useEffect, useState } from "react";
import "./corte.css";
import { Row } from "antd";
import { useQuery } from "@apollo/client";
import { GET_VENTAS_DIA_ADMIN } from "../../../graphql/venta";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
import "./corte.css";

const Corte = () => {
	let { data, error, refetch } = useQuery(GET_VENTAS_DIA_ADMIN);
	const [getVentasDiaAdmin, setgetVentasDiaAdmin] = useState([]);
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
			let { getVentasDiaAdmin } = data;
			let vendedoresSeparados = [
				{ "ISABEL LEÓN": [] },
				{ PAO: [] },
				{ MARCO: [] },
				{ PAO: [] },
				{ "ISABEL LEÓN": [] },
				{ "ISABEL SALAZAR": [] },
				{ LUPITA: [] },
				{ GABY: [] },
				{ JESSICA: [] },
			];

			for (let i = 0; i < getVentasDiaAdmin.length; i++) {
				const vendedor = getVentasDiaAdmin[i].vendedor;
				for (let j = 0; j < vendedoresSeparados.length; j++) {
					const vendedorEnArray = vendedoresSeparados[j];
					if (Object.keys(vendedorEnArray)[0] === vendedor) {
						vendedoresSeparados[j][vendedor].push(getVentasDiaAdmin[i]);
						// console.log("if", vendedorEnArray);
					} else {
						// vendedoresSeparados[j][vendedor].push(getVentasDiaAdmin[i]);
						// console.log("else", vendedor);
					}
				}
			}
			console.log("vendedoresSeparados", vendedoresSeparados);

			setgetVentasDiaAdmin(vendedoresSeparados);
		}
	}, [data]);

	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "x-large", fontWeight: "bold", color: "blue" }}>
					Corte
				</h1>
			</Row>
			{getVentasDiaAdmin.map((item) => {
				return <h1>{Object.keys(item)[0]}</h1>;
			})}
		</>
	);
};

export default Corte;
