import React, { useEffect, useRef, useState, useContext } from "react";
import { Button, Card, Input, Row } from "antd";
import { keyBlock } from "Utils";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { REGISTER_CAJA } from "myGraphql/caja";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { FaMoneyBillAlt } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import AuthContext from "context/Auth/AuthContext";
import "./entradasSalidas.css";

export default function EntradasSalidas() {
	const { timeLogout } = useContext(AuthContext);
	const [mutateREGISTER_CAJA] = useMutation(REGISTER_CAJA);
	let navigate = useNavigate();

	const [btnLoading, setbtnLoading] = useState(false);
	const [caja, setcaja] = useState(null);
	const [motivo, setmotivo] = useState("");
	const [entradaSalida, setentradaSalida] = useState(null);
	const inputCaja = useRef();
	const inputMotivo = useRef();

	useEffect(() => {
		if (entradaSalida) inputCaja.current.select();
	}, [entradaSalida]);

	const sendEntradaSalida = async () => {
		if (btnLoading === false) {
			setbtnLoading(true);
			let monto = 0;
			if (entradaSalida === "Entrada") {
				monto = parseFloat(caja);
			} else if (entradaSalida === "Salida") {
				monto = parseFloat(-caja);
			}
			if (monto !== 0) {
				try {
					const { data } = await mutateREGISTER_CAJA({
						variables: {
							input: {
								tipo: "entradaSalida",
								monto: monto,
							},
						},
					});
					if (data) {
						navigate("/");
						openNotification("success", `${entradaSalida} guardado con exito`);
					}
				} catch (error) {
					ErrorConection(timeLogout);
				}
			}
		}
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			if (caja < 1 || isNaN(caja)) {
				inputCaja.current.select();
			} else if (motivo.length < 1) {
				inputMotivo.current.select();
			} else {
				// sendEntradaSalida
				console.log("listo");
			}
		}
		if (e.keyCode === 27) {
			navigate("/");
		}
	};
	return (
		<Row
			justify='center'
			style={{
				alignSelf: "center",
				padding: "50px",
				borderRadius: "25px 5px 0 0",
				height: "75vh",
			}}
		>
			<Card id='cardLogin' style={{ width: "700px", height: "350px" }}>
				<div
					style={
						!entradaSalida
							? {
									background: "linear-gradient(#2196F3,#000058)",
									textAlignLast: "center",
									padding: "15px",
									borderRadius: "25px 5px 0 0",
							  }
							: entradaSalida === "Entrada"
							? {
									background: "linear-gradient(#32A632,#005800)",
									textAlignLast: "center",
									padding: "15px",
									borderRadius: "25px 5px 0 0",
							  }
							: {
									background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
									textAlignLast: "center",
									padding: "15px",
									borderRadius: "25px 5px 0 0",
							  }
					}
				>
					<Row justify='center'>
						<h1 style={{ color: "white", fontSize: "x-large" }}>
							<span className='material-icons' style={{ marginRight: "20px" }}>
								point_of_sale
							</span>
							{entradaSalida === null ? "Entrada / Salida" : entradaSalida}
						</h1>
					</Row>
				</div>
				{/* Ingresar Precio */}
				<div
					style={{
						textAlign: "center",
						padding: "7px",
						borderRadius: "25px 5px 0 0",
						marginTop: "24px",
					}}
				>
					{entradaSalida && (
						<>
							<Input
								ref={inputCaja}
								id='inputLogin'
								type='number'
								prefix={<FaMoneyBillAlt />}
								loading={btnLoading}
								style={{
									color: "#000058",
									// fontSize: 30,
									fontSize: "x-large",
									fontWeight: "bold",
									borderRadius: "50px",
									maxWidth: "80%",
									padding: "5",
									border: "0 0 0 0",
									margin: "10px",
								}}
								onKeyUp={pressKeyEnter}
								onKeyDown={keyBlock}
								onChange={(e) => setcaja(parseFloat(e.target.value))}
								value={caja}
								placeholder='Cantidad'
							/>
							<Input
								ref={inputMotivo}
								id='motivoLogin'
								prefix={<BsFillChatRightTextFill />}
								loading={btnLoading}
								style={{
									color: "#000058",
									// fontSize: 30,
									// fontSize: "large",
									fontWeight: "bold",
									borderRadius: "50px",
									maxWidth: "80%",
									padding: "5",
									border: "0 0 0 0",
									margin: "10px",
								}}
								onKeyUp={pressKeyEnter}
								onChange={(e) => setmotivo(e.target.value.toUpperCase())}
								value={motivo}
								placeholder='Motivo'
							/>
						</>
					)}
					<br />
					{entradaSalida ? (
						<Row justify='space-around'>
							<Button
								shape='round'
								style={{
									width: "40%",
									height: "40px",
									margin: "20px 0",
									fontSize: "large",
									color: "white",
									background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
								}}
								loading={btnLoading}
								onClick={() => setentradaSalida(null)}
							>
								Cancelar
							</Button>
							<Button
								type='primary'
								shape='round'
								style={{
									width: "40%",
									height: "40px",
									margin: "20px 0",
									fontSize: "large",
									background: "linear-gradient(#32A632,#005800)",
								}}
								loading={btnLoading}
								onClick={() => sendEntradaSalida()}
							>
								Registrar
							</Button>
						</Row>
					) : (
						<>
							<Button
								type='primary'
								shape='round'
								style={{
									width: "80%",
									height: "40px",
									margin: "20px",
									fontSize: "large",
									background: "linear-gradient(#32A632,#005800)",
								}}
								onClick={() => setentradaSalida("Entrada")}
							>
								Entrada
							</Button>
							<br />
							<Button
								type='primary'
								shape='round'
								style={{
									width: "80%",
									height: "40px",
									margin: "20px",
									fontSize: "large",
									background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
								}}
								onClick={() => setentradaSalida("Salida")}
							>
								Salida
							</Button>
						</>
					)}
				</div>
			</Card>
		</Row>
	);
}
