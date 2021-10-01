import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ESTRELLAS_VENDEDOR } from "graphql/estrella";
import { StarFilled } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useApolloClient } from "@apollo/client";
import { ADD_STARS_OK } from "graphql/estrella";

export default function Estrellas() {
	let { data: getEV, refetch: refetchEV } = useQuery(GET_ESTRELLAS_VENDEDOR);
	const [estrellasVendedor, setestrellasVendedor] = useState(0);
	const [estrellaHoy, setestrellaHoy] = useState(false);
	const client = useApolloClient();
	let addStarsOk = client.readQuery({
		query: ADD_STARS_OK,
	});
	if (addStarsOk?.addStarsOk === true) {
		refetchEV();
		client.writeQuery({
			query: ADD_STARS_OK,
			data: { addStarsOk: false },
		});
	}

	useEffect(() => {
		let fechaEstrella = 0;
		let horaInicio = new Date();
		if (getEV) {
			setestrellasVendedor(getEV.getEstrellasVendedor.estrellas);
			horaInicio.setHours(horaInicio.getHours() - 8);
			let horaInicioUnix = horaInicio.getTime();
			fechaEstrella = parseInt(getEV?.getEstrellasVendedor?.createAt);
			if (horaInicioUnix < fechaEstrella && fechaEstrella !== 0) {
				setestrellaHoy(true);
			} else {
				setestrellaHoy(false);
			}
		}
	}, [getEV]);
	useEffect(() => {
		if (estrellaHoy === true) {
			setTimeout(() => {
				setestrellaHoy(false);
			}, 10000);
		}
	}, [estrellaHoy]);
	return (
		<Tooltip
			placement='bottom'
			title='Para conseguir estrellas llena la barra al 100%'
		>
			{/* <Row> */}
			<h2 style={{ color: "white", float: "left", fontWeight: "bold" }}>
				{estrellasVendedor}
			</h2>
			<StarFilled
				style={{ fontSize: 25, color: "gold", margin: "20px 0 0 10px" }}
				spin={estrellaHoy}
			/>
			{/* </Row> */}
		</Tooltip>
	);
}
