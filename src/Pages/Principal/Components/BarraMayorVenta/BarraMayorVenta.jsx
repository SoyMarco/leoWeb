import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_VENTAS_MES } from "graphql/venta";
import { GET_VENTAS_DIA } from "graphql/venta";
import { Row, Progress } from "antd";
export default function BarraMayorVenta({ modalCobrar }) {
	let { data: getVentaMes, refetch: refetchMes } = useQuery(GET_VENTAS_MES);
	let { data: getVentasDia, refetch: refetchDia } = useQuery(GET_VENTAS_DIA, {
		notifyOnNetworkStatusChange: true,
	});
	useEffect(() => {
		if (modalCobrar === false) {
			refetchDia();
			refetchMes();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalCobrar]);
	const [ventaMayor, setventaMayor] = useState(0);
	const [totalVentasDia, settotalVentasDia] = useState(0);
	useEffect(() => {
		if (getVentaMes) {
			console.log(getVentaMes?.getVentasMes?.ventaMayor);
			setventaMayor(getVentaMes?.getVentasMes?.ventaMayor);
		}
		if (getVentasDia) {
			console.log("getVentasDia", getVentasDia?.getVentasDia);
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
		porcent = (totalVentasDia * 100) / ventaMayor ?? 0;

		return porcent;
	};
	return (
		<Row justify='center'>
			<Progress
				strokeColor={
					calculatePorcent() < 40
						? {
								from: "red",
								to: "limegreen",
						  }
						: calculatePorcent() < 80
						? {
								from: "orange",
								to: "limegreen",
						  }
						: {
								from: "dodgerblue",
								to: "limegreen",
						  }
				}
				percent={parseInt(calculatePorcent())}
				status='active'
				// style={{ width: "90%" }}
			/>
		</Row>
	);
}
