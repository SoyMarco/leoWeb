import React, { useEffect, useState, memo } from "react";
import { useQuery } from "@apollo/client";
import { GET_ESTRELLAS_VENDEDOR } from "graphql/estrella";
import { StarFilled } from "@ant-design/icons";
import { Tooltip } from "antd";

const Estrellas = memo(() => {
	let { data: getEV } = useQuery(GET_ESTRELLAS_VENDEDOR);
	const [estrellasVendedor, setestrellasVendedor] = useState(0);
	const [estrellaHoy, setestrellaHoy] = useState(false);
	const [title, settitle] = useState(
		"Para conseguir estrellas llena la barra al 100%"
	);
	useEffect(() => {
		return () => {
			setestrellaHoy(false);
		};
	}, []);
	//Verifica si hoy se consiguieron estrellas
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
				settitle("HOY CONSEGUISTE ESTRELLAS, FELICIDADES!!!");
			} else {
				setestrellaHoy(false);
			}
		}
	}, [getEV]);

	//Desactiva el giro de las estrellas
	useEffect(() => {
		if (estrellaHoy === true) {
			setTimeout(() => {
				setestrellaHoy(false);
			}, 10000);
		}
	}, [estrellaHoy]);

	return (
		<Tooltip placement='bottom' title={title}>
			<h2 style={{ color: "white", float: "left", fontWeight: "bold" }}>
				{estrellasVendedor}
			</h2>
			<StarFilled
				style={{ fontSize: 25, color: "gold", margin: "20px 0 0 10px" }}
				spin={estrellaHoy}
			/>
		</Tooltip>
	);
});
export default Estrellas;
