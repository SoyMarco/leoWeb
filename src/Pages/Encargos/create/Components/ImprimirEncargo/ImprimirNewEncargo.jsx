/* eslint-disable jsx-a11y/alt-text */
import { useContext, useEffect, useState, useRef } from "react";
import { openNotification } from "Utils/openNotification";
import EncargoContext from "context/NewEncargo/context";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { Row, Button, Card } from "antd";
import "moment/locale/es-us";
import moment from "moment";
import "./imprimir.css";

const ImprimirNewEncargo = () => {
	const {
		listaProductos,
		abono,
		cliente,
		imprimirEncargo: imprimir,
		dataEncargoBack,
	} = useContext(EncargoContext);
	const { auth } = useContext(AuthContext);

	const [numPrint, setnumPrint] = useState(0);
	const imprimirNewEncargo = useRef();
	const inputReprint = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		if (imprimir === true) {
			document.getElementById("print-button").click();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imprimir]);

	const afterPrint = () => {
		openNotification("success", "Encargo guardado con exito");
		if (numPrint === 0) {
			inputReprint.current.select();
			setnumPrint(numPrint + 1);
		} else if (numPrint === 1) {
			navigate("/");
		}
	};
	const pressKeyPrecio = (e) => {
		// Enter // F1
		if (e.keyCode === 13 || e.keyCode === 112) {
			document.getElementById("print-button").click();
		}
		// ESC
		if (e.keyCode === 27) {
			navigate("/");
		}
	};
	const pasarAFechaLL = (item) => {
		return moment.unix(item / 1000).format("LL");
	};
	const pasarAFechaLTS = (item) => {
		return moment.unix(item / 1000).format("LTS");
	};
	const pasarAFechaCorta = (item) => {
		return moment.unix(item / 1000).format("ll");
	};
	return (
		<>
			<ReactToPrint
				trigger={() => (
					<button id='print-button' style={{ display: "none" }}>
						Imprimiendo...
					</button>
				)}
				content={() => imprimirNewEncargo.current}
				// onBeforePrint={() => antesDeImprimir()}
				onAfterPrint={() => afterPrint()}
			/>
			{imprimir && (
				<Card
					style={{
						position: "fixed",
						marginLeft: "-28%",
						marginTop: "20px",
						boxShadow: "23px 23px 34px #7a7a7a, -23px -23px 34px #ffffff",
						padding: "10px",
					}}
				>
					<input
						id='inputPrincipalPrintESC'
						ref={inputReprint}
						onKeyUp={pressKeyPrecio}
						value=''
						style={{
							width: "100%",
							marginBottom: 20,
							marginTop: 10,
							fontSize: "x-large",
						}}
						placeholder='Reimprimir (Enter)'
						key='input1PrintNewApartado'
					></input>
					<Row justify='space-between' key='rowbtnsPrintNewApartado'>
						<Button
							type='primary'
							size='large'
							danger
							onClick={() => navigate("/")}
							key='botonESCPrintNewApartado'
							style={{ marginRight: "10px" }}
						>
							No reimprimir (ESC)
						</Button>

						<Button
							size='large'
							type='primary'
							onClick={() => document.getElementById("print-button").click()}
							key='botonPrintEnterPrintNewApartado'
						>
							Reimprimir (Enter)
						</Button>
					</Row>
				</Card>
			)}
			<Card
				style={{
					width: 210,
					boxShadow: "23px 23px 34px #7a7a7a, -23px -23px 34px #ffffff",
					padding: 0,
				}}
				key='ModalPrintNewApartado'
			>
				<div
					id='tickets'
					className='ticket'
					name='tickets'
					ref={imprimirNewEncargo}
					style={{
						width: 200,
					}}
				>
					<span
						style={{
							paddingLeft: "0px",
							textAlignLast: "center",
							// width: "190px",
						}}
					>
						ROPA Y ACCESORIOS LEO
					</span>
					<h3 className='tituloTicketEncargo'>ENCARGO</h3>
					{/* 	<!-- NOMBRE CLIENTE--> */}
					<h2
						style={{
							background: "black",
							color: "white",
							textAlign: "center",

							fontWeight: "bold",
						}}
					>
						{cliente}
					</h2>
					<h2
						style={{
							background: "black",
							color: "white",
							textAlign: "center",

							fontWeight: "bold",
						}}
					>
						{dataEncargoBack?.folio}
					</h2>
					{/* <!-- TABLA DE PRODUCTOS --> */}
					<h3 className='subtituloTicketEncargo'>
						<u> Encargos </u>
					</h3>
					{listaProductos?.map((item) => {
						return (
							<table key='item.id' className='productosEncargo'>
								<tbody>
									<tr>
										<td>{item.cantidad}</td>
										<td>
											<h3 className={"finalTicket"}>
												{item?.nombre?.toUpperCase()}
											</h3>
										</td>
									</tr>
								</tbody>
							</table>
						);
					})}
					{/* /* <!-- TABLA DE ABONOS --> */}
					<h3 className='subtituloTicketEncargo'>
						<u>Abonos</u>
					</h3>
					<table key='item._id' className='productosEncargo'>
						<tbody>
							<tr>
								<td style={{ padding: "0px" }}>
									{pasarAFechaCorta(Date.now())}
								</td>
								<td>
									<h3 className={"finalTicket"}>${abono}</h3>
								</td>
							</tr>
						</tbody>
					</table>
					<h3 className='sumaTabla'>Abonos: ${abono}</h3>{" "}
					{/* <!-- VENDEDOR --> */}
					{/* <span>Reimpresión</span> */}
					<br></br>
					<span>{`Vendedor: ${auth.name.toUpperCase()}`}</span>
					<br></br>
					<span>
						{pasarAFechaLTS(Date.now())} <br />
					</span>
					<span>
						{pasarAFechaLL(Date.now())} <br />
					</span>
				</div>
			</Card>
		</>
	);
};
export default ImprimirNewEncargo;
