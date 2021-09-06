import React, { useEffect, useState } from "react";
import { Col, Row, Card } from "antd";

export default function Ventas({ loading, getVentasDia, cajaDia }) {
	const [totales, settotales] = useState([]);
	useEffect(() => {
		console.log("totales", totales);
	}, [totales]);
	useEffect(() => {
		let efectivo = 0.0;
		let ventasEfectivo = 0.0;
		let totalEfectivo = 0.0;
		let efectivoFinalCaja = 0.0;
		let tarjeta = 0.0;
		let aCuenta = 0.0;
		let total = 0.0;
		let inicioCaja = 0;
		let entSal = 0;
		let finCaja = 0.0;
		let entradas = 0.0;
		let salidas = 0.0;
		let totales = [];
		for (let i = 0; i < getVentasDia.length; i++) {
			if (getVentasDia[i].cancelado === false) {
				total = total + getVentasDia[i].total;
				efectivo = efectivo + getVentasDia[i].efectivo;
				tarjeta = tarjeta + getVentasDia[i].tarjeta;
				aCuenta = aCuenta + getVentasDia[i].aCuenta;
			}
		}
		ventasEfectivo = total - (tarjeta + aCuenta);
		totalEfectivo = ventasEfectivo + inicioCaja;
		for (let j = 0; j < cajaDia.length; j++) {
			if (
				cajaDia[j]?.cancelado === false ||
				cajaDia[j].cancelado.length === 0
			) {
				if (cajaDia[j].tipo === "inicio") {
					inicioCaja = inicioCaja + cajaDia[j].monto;
				}
				if (cajaDia[j].tipo === "entradaSalida") {
					if (cajaDia[j].monto > 0) {
						entradas = entradas + cajaDia[j].monto;
					} else if (cajaDia[j].monto < 0) {
						salidas = salidas + cajaDia[j].monto;
					}
				}
			}
		}
		efectivoFinalCaja = totalEfectivo + entradas + salidas;
		finCaja = efectivo + tarjeta + aCuenta;
		finCaja = finCaja - total;
		finCaja = efectivo - finCaja;
		finCaja = finCaja + inicioCaja;
		finCaja = finCaja + entSal;
		totales = [
			{
				key: 1,
				inicioCaja: inicioCaja,
				ventasEfectivo: ventasEfectivo,
				totalEfectivo: totalEfectivo,
				efectivoFinalCaja: efectivoFinalCaja,
				entSal: entSal,
				entradas: entradas,
				salidas: salidas,
				efectivo: efectivo,
				tarjeta: tarjeta,
				aCuenta: aCuenta,
				total: total,
				finCaja: finCaja,
			},
			// <h3>Efectivo Caja</h3> inicioCaja
			// <h3>Venta Efectivo </h3> ventasEfectivo

			// <h3>Entradas</h3> entradas
			// <h3>Salidas</h3> salidas

			// <h3>Venta tarjeta</h3>
			// <h3>Total Venta</h3>
			// <h3>Total Efectivo</h3>
			// <br />

			// <h3>Efectivo</h3>
		];
		settotales(totales);
	}, [getVentasDia, cajaDia]);
	var formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
	/*COLUMNAS  TOTALES */
	// const colTotales = [
	// 	{
	// 		title: "Id",
	// 		dataIndex: "key",
	// 		key: "key",
	// 		width: "30px",
	// 	},
	// 	{
	// 		title: "Inicio Caja",
	// 		dataIndex: "inicioCaja",
	// 		key: "inicioCaja",
	// 		render: (inicioCaja) => (
	// 			<h3
	// 				style={{
	// 					textAlignLast: "right",
	// 					fontWeight: "revert",
	// 					fontSize: "large",
	// 				}}
	// 			>
	// 				${inicioCaja}
	// 			</h3>
	// 		),
	// 	},
	// 	{
	// 		title: "Entradas Salidas",
	// 		dataIndex: "entSal",
	// 		key: "entSal",
	// 		render: (entSal) => (
	// 			<h3
	// 				style={
	// 					entSal > 0
	// 						? {
	// 								textAlignLast: "right",
	// 								fontWeight: "revert",
	// 								fontSize: "large",
	// 								color: "green",
	// 						  }
	// 						: {
	// 								textAlignLast: "right",
	// 								fontWeight: "revert",
	// 								fontSize: "large",
	// 								color: "red",
	// 						  }
	// 				}
	// 			>
	// 				${entSal}
	// 			</h3>
	// 		),
	// 	},
	// 	// {
	// 	// 	title: "Efectivo",
	// 	// 	dataIndex: "efectivo",
	// 	// 	key: "efectivo",
	// 	// 	render: (efectivo) => (
	// 	// 		<h3
	// 	// 			style={{
	// 	// 				textAlignLast: "right",
	// 	// 				fontWeight: "revert",
	// 	// 				fontSize: "large",
	// 	// 			}}
	// 	// 		>
	// 	// 			${efectivo}
	// 	// 		</h3>
	// 	// 	),
	// 	// },
	// 	{
	// 		title: "Venta con Tarjeta",
	// 		dataIndex: "tarjeta",
	// 		key: "tarjeta",
	// 		render: (tarjeta) => (
	// 			<h3
	// 				style={
	// 					tarjeta > 0
	// 						? {
	// 								textAlignLast: "right",
	// 								fontWeight: "revert",
	// 								fontSize: "large",
	// 								color: "green",
	// 						  }
	// 						: {
	// 								textAlignLast: "right",
	// 								fontWeight: "revert",
	// 								fontSize: "large",
	// 						  }
	// 				}
	// 			>
	// 				${tarjeta}
	// 			</h3>
	// 		),
	// 	},
	// 	// {
	// 	// 	title: "A cuenta",
	// 	// 	dataIndex: "aCuenta",
	// 	// 	key: "aCuenta",
	// 	// 	render: (aCuenta) => (
	// 	// 		<h3
	// 	// 			style={{
	// 	// 				textAlignLast: "right",
	// 	// 				fontWeight: "revert",
	// 	// 				fontSize: "large",
	// 	// 			}}
	// 	// 		>
	// 	// 			${aCuenta}
	// 	// 		</h3>
	// 	// 	),
	// 	// },
	// 	{
	// 		title: "VENTA TOTAL",
	// 		dataIndex: "total",
	// 		key: "total",
	// 		render: (total) => (
	// 			<h3
	// 				style={{
	// 					textAlignLast: "right",
	// 					fontWeight: "revert",
	// 					fontSize: "large",
	// 				}}
	// 			>
	// 				${total}
	// 			</h3>
	// 		),
	// 	},
	// 	{
	// 		title: "Efectivo en Caja",
	// 		dataIndex: "finCaja",
	// 		key: "finCaja",
	// 		render: (finCaja, record) => (
	// 			<h2
	// 				style={{
	// 					textAlignLast: "right",
	// 					color: "green",
	// 					fontWeight: "revert",
	// 					fontSize: "x-large",
	// 				}}
	// 			>
	// 				${finCaja}
	// 			</h2>
	// 		),
	// 	},
	// ];
	return (
		<>
			{/* <Row>
				<Col xs={24} sm={24} md={16}>
					<Table
						columns={colTotales}
						dataSource={totales}
						loading={loading}
						pagination={false}
						size='middle'
						style={{
							height: "100px",
							borderRadius: "10px",
							boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
							margin: "10px",
						}}
						// size="small"
					/>
				</Col>
			</Row> */}
			<Card title='CORTE' bordered={false}>
				<Row style={{ margin: "15px 50px 0 50px" }}>
					<Col xs={3}>
						<h3>Incio Caja</h3>
						<h3>Venta efectivo </h3>
						<h3>Venta tarjeta</h3>
						<h3>Venta a cuenta</h3>
						<h3 style={{ fontWeight: "bold" }}>Total venta</h3>
						<h3 style={{ fontWeight: "bold" }}>Total efectivo</h3>
						<br />
						<h3>Entradas (+)</h3>
						<h3>Salidas (-)</h3>
						<h3 style={{ borderTop: "solid", fontWeight: "bold" }}>
							Efectivo final
						</h3>
						<br />
					</Col>
					<Col xs={3} style={{ textAlignLast: "end" }}>
						<h3>{formatter.format(totales[0]?.inicioCaja)}</h3>
						<h3>{formatter.format(totales[0]?.ventasEfectivo)}</h3>
						<h3>{formatter.format(totales[0]?.tarjeta)}</h3>
						<h3>{formatter.format(totales[0]?.aCuenta)}</h3>
						<h3 style={{ fontWeight: "bold" }}>
							{formatter.format(totales[0]?.total)}
						</h3>
						<h3 style={{ fontWeight: "bold" }}>
							{formatter.format(totales[0]?.totalEfectivo)}
						</h3>
						<br />
						<h3>{formatter.format(totales[0]?.entradas)}</h3>
						<h3>{formatter.format(totales[0]?.salidas)}</h3>
						<h3 style={{ borderTop: "solid", fontWeight: "bold" }}>
							{formatter.format(totales[0]?.efectivoFinalCaja)}{" "}
						</h3>
						<br />
					</Col>
					{/* <Col xs={8} style={{ textAlignLast: "end" }}>
						<h3>Recargas</h3>
						<h3>0000000000</h3>
						<br />
						<br />
						<h3>Dinero en efectivo que hay en caja</h3>
						<h4>$1000</h4>
						<h4>$500</h4>
						<h4>$200</h4>
						<h4>$100</h4>
						<h4>$50</h4>
						<h4>$20</h4>
						<h4>$10</h4>
						<h4>$5</h4>
						<h4>$2</h4>
						<h4>$1</h4>
						<h4>$0.50</h4>

						<h3>0000000000</h3>
					</Col> */}
				</Row>
			</Card>
		</>
	);
}
