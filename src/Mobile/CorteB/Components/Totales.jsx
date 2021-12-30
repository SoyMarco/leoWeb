import React from "react";
import { Col, Row, Card } from "antd";

export default function TotalesCorte({ loading, getTotales, refetch }) {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<Card bordered={false}>
			<Row style={{ margin: "15px 50px 0 50px" }}>
				<Col xs={12}>
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
				<Col xs={12} style={{ textAlignLast: "end" }}>
					<h3>{formatter.format(getTotales?.inicioCaja)}</h3>
					<h3>{formatter.format(getTotales?.ventasEfectivo)}</h3>
					<h3>{formatter.format(getTotales?.tarjeta)}</h3>
					<h3>{formatter.format(getTotales?.aCuenta)}</h3>
					<h3 style={{ fontWeight: "bold" }}>
						{formatter.format(getTotales?.total)}
					</h3>
					<h3 style={{ fontWeight: "bold" }}>
						{formatter.format(getTotales?.totalEfectivo)}
					</h3>
					<br />
					<h3>{formatter.format(getTotales?.entradas)}</h3>
					<h3>{formatter.format(getTotales?.salidas)}</h3>
					<h3 style={{ borderTop: "solid", fontWeight: "bold" }}>
						{formatter.format(getTotales?.efectivoFinalCaja)}
					</h3>
					<br />
				</Col>
			</Row>
		</Card>
	);
}
