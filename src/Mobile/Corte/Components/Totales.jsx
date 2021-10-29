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
		let totalesSet = [];
		for (const ventaDia of getVentasDia) {
			if (ventaDia.cancelado === false) {
				total = total + ventaDia.total;
				efectivo = efectivo + ventaDia.efectivo;
				tarjeta = tarjeta + ventaDia.tarjeta;
				aCuenta = aCuenta + ventaDia.aCuenta;
			}
		}
		for (const cajaD of cajaDia) {
			if (cajaD?.cancelado === false || cajaD.cancelado.length === 0) {
				if (cajaD.tipo === "inicio") {
					inicioCaja = inicioCaja + cajaD.monto;
				}
				if (cajaD.tipo === "entradaSalida") {
					entSal = entSal + cajaD.monto;
				}
			}
		}
		finCaja = efectivo + tarjeta + aCuenta;
		finCaja = finCaja - total;
		finCaja = efectivo - finCaja;
		finCaja = finCaja + inicioCaja;
		finCaja = finCaja + entSal;
		totalesSet = [
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
		settotales(totalesSet);
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
					style={{
						textAlignLast: "right",
						fontWeight: "revert",
						fontSize: "large",
						color: entSal > 0 ? "green" : "red",
					}}
				>
					${entSal}
				</h3>
			),
		},

		{
			title: "Venta con Tarjeta",
			dataIndex: "tarjeta",
			key: "tarjeta",
			render: (tarjeta) => (
				<h3
					style={{
						textAlignLast: "right",
						fontWeight: "revert",
						fontSize: "large",
						color: tarjeta > 0 ? "green" : "black",
					}}
				>
					${tarjeta}
				</h3>
			),
		},

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
				/>
			</Col>
		</>
	);
}
