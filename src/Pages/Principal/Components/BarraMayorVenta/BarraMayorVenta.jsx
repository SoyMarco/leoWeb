/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VENTAS_MES, GET_VENTAS_DIA } from "graphql/venta";
import { REGISTER_ESTRELLA, GET_ESTRELLAS_VENDEDOR } from "graphql/estrella";
import { Row, Progress } from "antd";
import "./BarraMayorVenta.css";

const BarraMayorVenta = memo(
	({ inicialStateTrue, setinicialStateTrue, totalTotal }) => {
		let { refetch: refetchEV } = useQuery(GET_ESTRELLAS_VENDEDOR);
		let { data: getVentaMes, refetch: refetchMes } = useQuery(GET_VENTAS_MES);
		let { data: getVentasDia, refetch: refetchDia } = useQuery(GET_VENTAS_DIA, {
			notifyOnNetworkStatusChange: true,
		});
		const [mutateREGISTER_ESTRELLA] = useMutation(REGISTER_ESTRELLA);
		const [ventaMayor, setventaMayor] = useState(0);
		const [totalVentasDia, settotalVentasDia] = useState(0);
		const [porcentReal, setporcentReal] = useState(0);
		const [calculatePorcent, setcalculatePorcent] = useState(0);
		console.log(
			ventaMayor,
			totalVentasDia,
			porcentReal,
			calculatePorcent,
			totalTotal
		);
		useEffect(() => {
			if (inicialStateTrue === true) {
				refetchDia();
				refetchMes();
				setinicialStateTrue(false);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [inicialStateTrue]);

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

		useEffect(() => {
			//Calcular porcentaje de barra con venta actual
			let porcentParcial = 0;
			if (totalVentasDia && ventaMayor) {
				porcentParcial = parseInt(
					((totalVentasDia + totalTotal) * 100) / ventaMayor ?? 0
				);
			}
			setcalculatePorcent(porcentParcial);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [totalTotal, totalVentasDia, ventaMayor]);

		useEffect(() => {
			// GREGRAR ESTRELLAS
			let porcentR = 0;
			if (totalVentasDia && ventaMayor) {
				porcentR = parseInt((totalVentasDia * 100) / ventaMayor ?? 0);
				if (porcentR >= 100 && porcentR < 300 && porcentReal < 100) {
					setporcentReal(porcentR);
				} else {
					setporcentReal(0);
				}
			}
		}, [totalVentasDia]);

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
					refetchEV();
				}
			} catch (error) {
				console.log("error", error);
			}
		};

		return (
			<Row justify='center' style={{ marginTop: 25 }}>
				<Progress
					strokeColor={
						calculatePorcent > 0 && calculatePorcent < 50
							? {
									from: "red",
									to: "orange",
							  }
							: calculatePorcent >= 50 && calculatePorcent < 80
							? {
									from: "orange",
									to: "limegreen",
							  }
							: {
									from: "limegreen",
									to: "dodgerblue",
							  }
					}
					className={calculatePorcent >= 100 ? "barraMayorVenta" : "sinEstilo"}
					percent={calculatePorcent}
					status='active'
				/>
			</Row>
		);
	}
);
export default BarraMayorVenta;
