import React, { useState, useEffect, memo } from "react";
import { REGISTER_ESTRELLA, GET_ESTRELLAS_VENDEDOR } from "graphql/estrella";
import { GET_VENTAS_MES, GET_TOTAL_VENTAS_DIA } from "graphql/venta";
import { useQuery, useMutation } from "@apollo/client";
import { Row, Progress } from "antd";
import "./BarraMayorVenta.css";

const BarraMayorVenta = memo(() => {
	let { refetch: refetchEV } = useQuery(GET_ESTRELLAS_VENDEDOR);
	let { data: getVentaMes, refetch: refetchMes } = useQuery(GET_VENTAS_MES);
	let { data: getTotalVentasDia, refetch: refetchTotalVentasDia } =
		useQuery(GET_TOTAL_VENTAS_DIA);
	const [mutateREGISTER_ESTRELLA] = useMutation(REGISTER_ESTRELLA);
	const [ventaMayor, setventaMayor] = useState(0);
	const [totalVentasDia, settotalVentasDia] = useState(0);
	const [porcentReal, setporcentReal] = useState(0);
	const [calculatePorcent, setcalculatePorcent] = useState(0);

	useEffect(() => {
		refetchTotalVentasDia();
		refetchMes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (getVentaMes?.getVentasMes?.ventaMayor > 0) {
			setventaMayor(getVentaMes.getVentasMes.ventaMayor);
		}
		if (getTotalVentasDia?.getTotalVentasDia > 0) {
			settotalVentasDia(getTotalVentasDia.getTotalVentasDia);
		}
	}, [getVentaMes, getTotalVentasDia]);

	useEffect(() => {
		//Calcular porcentaje de barra con venta actual
		let porcentParcial = 0;
		if (totalVentasDia > 0 && ventaMayor > 0) {
			porcentParcial = parseInt((totalVentasDia * 100) / ventaMayor);
		}
		setcalculatePorcent(porcentParcial);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalVentasDia, ventaMayor]);

	useEffect(() => {
		// GREGRAR ESTRELLAS
		let porcentR = 0;
		if (totalVentasDia > 0 && ventaMayor > 0) {
			porcentR = parseInt((totalVentasDia * 100) / ventaMayor);
			if (porcentR >= 100 && porcentR < 200 && porcentReal < 100) {
				setporcentReal(porcentR);
			} else {
				setporcentReal(0);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalVentasDia, ventaMayor]);

	useEffect(() => {
		if (porcentReal >= 100 && porcentReal < 200) {
			addEstrella();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [porcentReal]);

	const addEstrella = async () => {
		let input = {
			porcentaje: porcentReal,
		};
		try {
			const { data: dataEstrella } = await mutateREGISTER_ESTRELLA({
				variables: {
					input,
				},
			});
			if (dataEstrella?.registerEstrella === true) {
				refetchEV();
			}
		} catch (error) {
			console.log("error", error);
		}
	};
	const colorBar = () => {
		if (calculatePorcent > 0 && calculatePorcent < 50) {
			return {
				from: "red",
				to: "orange",
			};
		}
		if (calculatePorcent >= 50 && calculatePorcent < 80) {
			return {
				from: "orange",
				to: "limegreen",
			};
		} else {
			return {
				from: "limegreen",
				to: "dodgerblue",
			};
		}
	};
	const classBarr = () => {
		if (calculatePorcent >= 100) {
			return "barraMayorVenta";
		}
		return "sinEstilo";
	};
	return (
		<Row justify='center' style={{ marginTop: 25 }}>
			{calculatePorcent > 0 ? (
				<Progress
					strokeColor={colorBar()}
					className={classBarr()}
					percent={calculatePorcent}
					status='active'
				/>
			) : null}
		</Row>
	);
});
export default BarraMayorVenta;
