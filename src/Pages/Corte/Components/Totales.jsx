import React, { useEffect, useState } from "react";
import { Table, Col } from "antd";

export default function Ventas({ loading, getVentasDia, cajaDia }) {
	const [totales, settotales] = useState([]);

	useEffect(() => {
		let efectivo = 0.0;
		let tarjeta = 0.0;
		let aCuenta = 0.0;
		let total = 0.0;
		let inicioCaja = 0;
		let entSal = 0;
		let finCaja = 0.0;
		let totales = [];
		for (let i = 0; i < getVentasDia.length; i++) {
			if (getVentasDia[i].cancelado === false) {
				total = total + getVentasDia[i].total;
				efectivo = efectivo + getVentasDia[i].efectivo;
				tarjeta = tarjeta + getVentasDia[i].tarjeta;
				aCuenta = aCuenta + getVentasDia[i].aCuenta;
			}
		}
		for (let j = 0; j < cajaDia.length; j++) {
			if (
				cajaDia[j]?.cancelado === false ||
				cajaDia[j].cancelado.length === 0
			) {
				if (cajaDia[j].tipo === "inicio") {
					inicioCaja = inicioCaja + cajaDia[j].monto;
				}
				if (cajaDia[j].tipo === "entradaSalida") {
					entSal = entSal + cajaDia[j].monto;
				}
			}
		}
		finCaja = efectivo + tarjeta + aCuenta;
		finCaja = finCaja - total;
		finCaja = efectivo - finCaja;
		finCaja = finCaja + inicioCaja;
		finCaja = finCaja + entSal;
		totales = [
			{
				key: 1,
				inicioCaja: inicioCaja,
				entSal: entSal,
				efectivo: efectivo,
				tarjeta: tarjeta,
				aCuenta: aCuenta,
				total: total,
				finCaja: finCaja,
			},
		];
		settotales(totales);
	}, [getVentasDia, cajaDia]);

	/*COLUMNAS  TOTALES */
	const colTotales = [
		{
			title: "Id",
			dataIndex: "key",
			key: "key",
			width: "30px",
		},
		{
			title: "Inicio Caja",
			dataIndex: "inicioCaja",
			key: "inicioCaja",
			render: (inicioCaja) => (
				<h3
					style={{
						textAlignLast: "right",
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					${inicioCaja}
				</h3>
			),
		},
		{
			title: "Entradas Salidas",
			dataIndex: "entSal",
			key: "entSal",
			render: (entSal) => (
				<h3
					style={
						entSal > 0
							? {
									textAlignLast: "right",
									fontWeight: "revert",
									fontSize: "large",
									color: "green",
							  }
							: {
									textAlignLast: "right",
									fontWeight: "revert",
									fontSize: "large",
									color: "red",
							  }
					}
				>
					${entSal}
				</h3>
			),
		},
		// {
		// 	title: "Efectivo",
		// 	dataIndex: "efectivo",
		// 	key: "efectivo",
		// 	render: (efectivo) => (
		// 		<h3
		// 			style={{
		// 				textAlignLast: "right",
		// 				fontWeight: "revert",
		// 				fontSize: "large",
		// 			}}
		// 		>
		// 			${efectivo}
		// 		</h3>
		// 	),
		// },
		{
			title: "Venta con Tarjeta",
			dataIndex: "tarjeta",
			key: "tarjeta",
			render: (tarjeta) => (
				<h3
					style={
						tarjeta > 0
							? {
									textAlignLast: "right",
									fontWeight: "revert",
									fontSize: "large",
									color: "green",
							  }
							: {
									textAlignLast: "right",
									fontWeight: "revert",
									fontSize: "large",
							  }
					}
				>
					${tarjeta}
				</h3>
			),
		},
		// {
		// 	title: "A cuenta",
		// 	dataIndex: "aCuenta",
		// 	key: "aCuenta",
		// 	render: (aCuenta) => (
		// 		<h3
		// 			style={{
		// 				textAlignLast: "right",
		// 				fontWeight: "revert",
		// 				fontSize: "large",
		// 			}}
		// 		>
		// 			${aCuenta}
		// 		</h3>
		// 	),
		// },
		{
			title: "VENTA TOTAL",
			dataIndex: "total",
			key: "total",
			render: (total) => (
				<h3
					style={{
						textAlignLast: "right",
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					${total}
				</h3>
			),
		},
		{
			title: "Efectivo en Caja",
			dataIndex: "finCaja",
			key: "finCaja",
			render: (finCaja, record) => (
				<h2
					style={{
						textAlignLast: "right",
						color: "green",
						fontWeight: "revert",
						fontSize: "x-large",
					}}
				>
					${finCaja}
				</h2>
			),
		},
	];
	return (
		<>
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
		</>
	);
}
