/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useContext } from "react";
import { Button, Card, Input, Row } from "antd";
import { keyBlock } from "Utils";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { REGISTER_CAJA } from "myGraphql/caja";
import { useNavigate } from "react-router-dom";
import "./caja.css";
import AuthContext from "context/Auth/AuthContext";

export default function Caja() {
	const { timeLogout, setFirstLogin } = useContext(AuthContext);
	const [mutateREGISTER_CAJA, { loading }] = useMutation(REGISTER_CAJA);
	const [caja, setcaja] = useState(0);

	const inputCaja = useRef();
	let navigate = useNavigate();

	useEffect(() => {
		inputCaja.current.select();
		setFirstLogin(undefined);
	}, []);

	const sendLogin = async () => {
		if (loading) return;
		try {
			const { data } = await mutateREGISTER_CAJA({
				variables: {
					input: {
						tipo: "inicio",
						monto: parseFloat(caja),
					},
				},
			});
			if (data) {
				openNotification("success", `Registro guardado con exito`);
				navigate("/");
			}
		} catch (error) {
			ErrorConection(timeLogout);
		}
	};

	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			sendLogin();
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
			<Card id='cardLogin'>
				<div
					style={{
						background: "#000058",
						textAlignLast: "center",
						padding: "15px",
						borderRadius: "25px 5px 0 0",
					}}
				>
					<Row justify='center'>
						{/* <RiShieldUserFill
								style={{ color: "white", fontSize: "xx-large" }}
							/> */}

						<h1 style={{ color: "white", fontSize: "x-large" }}>
							<span className='material-icons' style={{ marginRight: "20px" }}>
								point_of_sale
							</span>
							Inicio de caja
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
					<Input
						ref={inputCaja}
						id='inputLogin'
						type='number'
						prefix={<span className='material-icons'>payments</span>}
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
					/>

					<br />
					<Button
						type='primary'
						shape='round'
						style={{
							width: "80%",
							height: "40px",
							margin: "20px",
							fontSize: "large",
						}}
						onClick={() => sendLogin()}
					>
						Registrar
					</Button>
				</div>
			</Card>
		</Row>
	);
}
