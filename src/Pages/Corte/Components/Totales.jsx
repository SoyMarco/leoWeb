import React, { useState, useRef, useContext } from "react";
import { Col, Row, Card, InputNumber } from "antd";
import { REGISTER_CAJA } from "myGraphql/caja";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { keyBlock } from "Utils";
import { ImMobile } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import AuthContext from "context/Auth/AuthContext";

export default function TotalesCorte({ loading, getTotales, refetch }) {
	const { timeLogout } = useContext(AuthContext);
	const [mutateREGISTER_CAJA] = useMutation(REGISTER_CAJA);
	const [recargas, setrecargas] = useState(null);
	const inputRecargas = useRef();
	const navigate = useNavigate();

	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});

	const pressKeyRecargas = (e) => {
		if (e.keyCode === 13) {
			sendRecargas();
		}
		if (e.keyCode === 27) {
			navigate("/");
		}
	};

	const handleRecargas = (e) => {
		setrecargas(Math.round(e * 100) / 100);
	};
	const sendRecargas = async () => {
		if (loading === false) {
			const monto = recargas;
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
						refetch();
					}
				} catch (error) {
					ErrorConection(timeLogout);
				}
			}
		}
	};
	return (
		<>
			<Card>
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
									// autoFocus
								></InputNumber>
							</Col>
							<Col xs={7} style={{ textAlignLast: "start" }}>
								<Row>
									{getTotales?.recargas > 0 ? (
										<ImMobile style={{ margin: 10, fontSize: "x-large" }} />
									) : null}
									<h2
										style={
											getTotales?.recargas > 0
												? { fontWeight: "bold", marginTop: 5 }
												: null
										}
									>
										{formatter.format(getTotales?.recargas ?? 0)}
									</h2>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</Card>
		</>
	);
}
