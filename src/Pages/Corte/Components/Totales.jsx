import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Card, InputNumber } from "antd";
import { REGISTER_CAJA } from "graphql/caja";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
import { keyBlock } from "Utils";
import { ImMobile } from "react-icons/im";
import { useHistory } from "react-router-dom";

export default function TotalesCorte({
	loading,
	loadingCaja,
	getVentasDia,
	cajaDia,
	refetchCaja,
}) {
	const [mutateREGISTER_CAJA] = useMutation(REGISTER_CAJA);
	const [totales, settotales] = useState([]);
	const [recargas, setrecargas] = useState(null);
	const inputRecargas = useRef();
	const { logout } = useAuth();
	const history = useHistory();

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
		let recargasMonto = 0;
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
					inicioCaja = cajaDia[j].monto;
				}
				if (cajaDia[j].tipo === "entradaSalida") {
					if (cajaDia[j].monto > 0) {
						entradas = entradas + cajaDia[j].monto;
					} else if (cajaDia[j].monto < 0) {
						salidas = salidas + cajaDia[j].monto;
					}
				}
				if (cajaDia[j].tipo === "recargas") {
					recargasMonto = cajaDia[j].monto;
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
				recargas: recargasMonto,
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

	const pressKeyRecargas = (e) => {
		if (e.keyCode === 13) {
			sendRecargas();
		}
		if (e.keyCode === 27) {
			history.push("/");
		}
	};

	const handleRecargas = (e) => {
		setrecargas(Math.round(e * 100) / 100);
	};
	const sendRecargas = async () => {
		if (loadingCaja === false) {
			let monto = recargas;
			if (monto > 0) {
				try {
					const { data } = await mutateREGISTER_CAJA({
						variables: {
							input: {
								tipo: "recargas",
								monto: monto,
							},
						},
					});
					if (data) {
						openNotification("success", `Monto de recargas Guardado`);
						setrecargas(null);
						refetchCaja();
					}
				} catch (error) {
					ErrorConection(logout);
				}
			}
		}
	};
	return (
		<>
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
					<Col xs={12} style={{ textAlignLast: "end" }}>
						<Row justify='end'>
							<Col xs={17} style={{ textAlignLast: "center" }}>
								<h3>Recargas</h3>
								<InputNumber
									ref={inputRecargas}
									type='number'
									style={{
										width: "50%",
										height: "30px",
										margin: "20px 0",
										borderRadius: "50px",
										fontSize: "large",
										textAlignLast: "center",
										fontWeight: "bold",
									}}
									onKeyUp={pressKeyRecargas}
									onKeyDown={keyBlock}
									value={recargas}
									onChange={handleRecargas}
									autoFocus
								></InputNumber>
							</Col>
							<Col xs={7} style={{ textAlignLast: "start" }}>
								<Row>
									{totales[0]?.recargas > 0 ? (
										<ImMobile style={{ margin: 10, fontSize: "x-large" }} />
									) : null}
									<h2
										style={
											totales[0]?.recargas > 0
												? { fontWeight: "bold", marginTop: 5 }
												: null
										}
									>
										{formatter.format(totales[0]?.recargas ?? 0)}
									</h2>
								</Row>
							</Col>
						</Row>

						{/* <Row justify='end'>
							<Col xs={17} style={{ textAlignLast: "center" }}>
								<h3>Dinero en efectivo que hay en caja</h3>
								<InputNumber
									ref={inputPrecio}
									type='number'
									style={{
										width: "50%",
										height: "35px",
										margin: "20px 0",
										borderRadius: "50px",
										fontSize: "x-large",
										textAlignLast: "center",
										fontWeight: "bold",
									}}
									onKeyUp={pressKeyPrecio}
									value={precio}
									onChange={handlePrecio}
								></InputNumber>
							</Col>
							<Col xs={7} style={{ textAlignLast: "end" }}>
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

								<h3 style={{ borderTop: "solid", fontWeight: "bold" }}>
									0000000000
								</h3>
							</Col>
						</Row>
					 */}
					</Col>
				</Row>
			</Card>
		</>
	);
}
