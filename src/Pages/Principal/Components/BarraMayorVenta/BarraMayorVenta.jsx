import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VENTAS_MES, GET_VENTAS_DIA } from "graphql/venta";
import { REGISTER_ESTRELLA } from "graphql/estrella";
import { Row, Progress } from "antd";
import { useApolloClient } from "@apollo/client";
import { ADD_STARS_OK } from "graphql/estrella";
import "./BarraMayorVenta.css";

export default function BarraMayorVenta({ modalCobrar, totalTotal }) {
	let { data: getVentaMes, refetch: refetchMes } = useQuery(GET_VENTAS_MES);
	let { data: getVentasDia, refetch: refetchDia } = useQuery(GET_VENTAS_DIA, {
		notifyOnNetworkStatusChange: true,
	});
	const [mutateREGISTER_ESTRELLA] = useMutation(REGISTER_ESTRELLA);
	const client = useApolloClient();

	useEffect(() => {
		if (modalCobrar === false) {
			refetchDia();
			refetchMes();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalCobrar]);
	const [ventaMayor, setventaMayor] = useState(0);
	const [totalVentasDia, settotalVentasDia] = useState(0);
	const [porcentReal, setporcentReal] = useState(0);
	useEffect(() => {
		if (getVentaMes) {
			setventaMayor(getVentaMes?.getVentasMes?.ventaMayor);
		}
		if (getVentasDia) {
			let arrayVentas = getVentasDia?.getVentasDia;
			let totalVentas = 0;
			for (let i = 0; i < arrayVentas.length; i++) {
				if (arrayVentas[i].cancelado === false) {
					totalVentas = arrayVentas[i].total + totalVentas;
				}
			}
			settotalVentasDia(totalVentas);
		}
	}, [getVentaMes, getVentasDia]);
	const calculatePorcent = () => {
		let porcent = 0;
		if (totalVentasDia && ventaMayor) {
			porcent = ((totalVentasDia + totalTotal) * 100) / ventaMayor ?? 0;
		}
		return porcent;
	};

	// GREGRAR ESTRELLAS
	useEffect(() => {
		if (totalVentasDia && ventaMayor) {
			let porcent = 0;
			porcent = (totalVentasDia * 100) / ventaMayor ?? 0;
			if (porcent >= 100 && porcent < 300 && porcentReal < 100) {
				setporcentReal(porcent);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalVentasDia, ventaMayor]);
	useEffect(() => {
		if (porcentReal >= 100 && porcentReal < 300) {
			addEstrella();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [porcentReal]);
	const addEstrella = async () => {
		try {
			const { data: dataEstrella } = await mutateREGISTER_ESTRELLA({
				variables: {
					input: {
						porcentaje: porcentReal,
					},
				},
			});
			if (dataEstrella?.registerEstrella === true) {
				client.writeQuery({
					query: ADD_STARS_OK,
					data: { addStarsOk: true },
				});
			}
		} catch (error) {
			console.log("error", error);
		}
	};
	return (
		<Row justify='center' style={{ marginTop: 25 }}>
			<Progress
				strokeColor={
					calculatePorcent() < 50
						? {
								from: "red",
								to: "orange",
						  }
						: calculatePorcent() < 80
						? {
								from: "orange",
								to: "limegreen",
						  }
						: {
								from: "limegreen",
								to: "dodgerblue",
						  }
				}
				className={calculatePorcent() >= 100 ? "barraMayorVenta" : null}
				percent={parseInt(calculatePorcent())}
				status='active'
			/>
		</Row>
	);
}
