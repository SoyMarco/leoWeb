/* eslint-disable jsx-a11y/alt-text */
import { useContext, useEffect, useState, useRef } from "react";
import moment from "moment";
import "moment/locale/es-us";
import { Modal, Row, Divider, Button, Card } from "antd";
import "./imprimir.css";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { keyBlock } from "Utils";
import { openNotification } from "Utils/openNotification";
import EncargoContext from "context/NewEncargo/context";
import AuthContext from "context/Auth/AuthContext";

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
		// Enter
		if (e.keyCode === 13) {
			document.getElementById("print-button").click();
		}
		// 	F1
		if (e.keyCode === 112) {
			document.getElementById("print-button").click();
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
			<Card
				style={{
					width: 200,
					boxShadow: "23px 23px 34px #7a7a7a, -23px -23px 34px #ffffff",
				}}
				onCancel={() => navigate("/")}
				key='ModalPrintNewApartado'
			>
				<div
					id='tickets'
					className='ticket'
					name='tickets'
					ref={imprimirNewEncargo}
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
// eslint-disable-next-line no-lone-blocks
{
	/* 
// algo añadido
<input
				id='inputPrincipalPrintESC'
				ref={inputReprint}
				onKeyUp={pressKeyPrecio}
				onKeyDown={keyBlock}
				style={{ width: "180px", marginBottom: 10 }}
			></input>
			<Row justify='space-around'>
				<Button
					type='primary'
					danger
					shape='round'
					onClick={() => navigate("/")}
				>
					ESC
				</Button>

				<Button
					type='primary'
					shape='round'
					onClick={() => document.getElementById("print-button").click()}
				>
					Print(Enter)
				</Button>
			</Row>
			<Divider /> */
}
export default ImprimirNewEncargo;
