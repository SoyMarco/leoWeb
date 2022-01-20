/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import "moment/locale/es-us";
import { Modal, Row, Divider, Button } from "antd";
import "./imprimir.css";
import { keyBlock } from "Utils";
import ReactToPrint from "react-to-print";
import { openNotification } from "Utils/openNotification";

const ImprimirApartadoCorte = ({
	imprimirApartado,
	setimprimirApartado,
	auth,
	dataApartado,
	dinero,
}) => {
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);

	const { abonos, cliente, entregado, folio, productos, vence } = dataApartado;

	const ReimprimirApartado = useRef();
	const inputReprint = useRef();

	useEffect(() => {
		let sum = productos.reduce((a, b) => a + b.totalArticulo, 0);
		settotalTotal(sum);

		let sumAbo = abonos.reduce((a, b) => a + b.abono, 0);

		settotalAbonos(sumAbo);
	}, [imprimirApartado, abonos, productos]);

	useEffect(() => {
		if (totalAbonos || totalTotal) {
			if (imprimirApartado) {
				document.getElementById("printApartado-button-corte").click();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalAbonos, totalTotal]);

	const afterPrint = () => {
		openNotification("success", "Reimpreso con exito");
		initialStateImprimir();
	};
	const pressKeyPrecio = (e) => {
		// Enter
		if (e.keyCode === 13) {
			document.getElementById("printApartado-button-corte").click();
		}
		// 	F1
		if (e.keyCode === 112) {
			document.getElementById("printApartado-button-corte").click();
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
	const pasarAFechaVence = (item) => {
		return moment.unix(item / 1000).format("LL");
	};

	const fechaVenceEn = () => {
		let fecha = moment.unix(dataApartado.vence / 1000).fromNow();
		if (dataApartado.vence > Date.now()) {
			fecha = `Vence ${fecha}`;
		} else {
			fecha = `Venció ${fecha}`;
		}
		return fecha;
	};
	const initialStateImprimir = () => {
		setimprimirApartado(0);
	};
	return (
		<>
			<ReactToPrint
				trigger={(e) => (
					<button id='printApartado-button-corte'>Imprimiendo...</button>
				)}
				content={() => ReimprimirApartado.current}
				onAfterPrint={() => afterPrint()}
			/>
			<Modal
				visible={imprimirApartado}
				width='229px'
				onCancel={() => initialStateImprimir()}
			>
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
						onClick={() => initialStateImprimir()}
					>
						ESC
					</Button>

					<Button
						type='primary'
						shape='round'
						onClick={() =>
							document.getElementById("printApartado-button-corte").click()
						}
					>
						Print(Enter)
					</Button>
				</Row>
				<Divider />
				<div
					id='tickets'
					className='ticket'
					name='tickets'
					ref={ReimprimirApartado}
				>
					{/*  LOGO LEO  */}
					{/* <img src='data:image/png;base64,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' /> */}
					{/* <!-- FECHA --> */}
					<Row justify='space-around' style={{ width: "200px" }}>
						<span style={{ paddingLeft: "0px", textAlignLast: "center" }}>
							ROPA Y ACCESORIOS LEO
						</span>
					</Row>
					<h3 className='tituloTicketApartado'>APARTADO</h3>
					{entregado?.status === true ? (
						<h3 className='tituloTicketApartado'>APARTADO</h3>
					) : null}
					{/* 	<!-- NOMBRE CLIENTE--> */}
					<Row
						style={{
							padding: "0px",
							background: "black",
							marginBottom: "5px",
							justifyContent: "center",
							width: "190px",
						}}
					>
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
					</Row>
					{/* <!-- FOLIO APARTADO --> */}
					<Row
						justify='space-around'
						style={{
							padding: "0px",
							background: "black",
							width: "190px",
						}}
					>
						<h2
							className='sutituloTicket'
							style={{
								background: "black",
								color: "white",
								padding: "0px",
								fontWeight: "bold",
							}}
						>
							Folio: {folio}
						</h2>
					</Row>
					{/* <!-- VENCE --> */}
					<Row justify='space-around' style={{ width: "200px" }}>
						<span
							style={{ fontWeight: "bold" }}
						>{`${fechaVenceEn()}, el ${pasarAFechaVence(vence)}`}</span>
					</Row>
					{/* <!-- TABLA DE PRODUCTOS --> */}
					<h3 className='subtituloTicketApartado'>
						<u> Productos</u>
					</h3>
					{productos?.map((item) => {
						return (
							<table key='item.id' className='productosApartado'>
								<tr>
									<td>
										{item.apartado > 0
											? `APARTADO ${item.apartado}`
											: item.nombre}
									</td>
									<td>
										<h3 className={item.cantidad > 1 ? null : "finalTicket"}>
											${item.precio}
										</h3>
									</td>
								</tr>
								{item.cantidad > 1 ? (
									<tr>
										<td>X{item.cantidad}</td>
										<td>
											<h3 className='finalTicket'>${item.totalArticulo}</h3>
										</td>
									</tr>
								) : null}
							</table>
						);
					})}
					<h3 className='sumaTabla'>Productos: ${totalTotal}</h3>
					{/* <!-- FIN TABLA DE PRODUCTOS --> */}
					{/* <!-- TABLA DE ABONOS --> */}
					<h3 className='subtituloTicketApartado'>
						<u>ABONOS</u>
					</h3>
					{abonos?.map((item) => {
						return (
							<table key='item._id' className='productosApartado'>
								<tr>
									<td style={{ padding: "0px" }}>
										{pasarAFechaCorta(item.createAt)}
									</td>
									<td>
										<h3 className={"finalTicket"}>${item.abono}</h3>
									</td>
								</tr>
							</table>
						);
					})}
					<h3 className='sumaTabla'>Abonos: ${totalAbonos}</h3>
					{/* <!-- FIN TABLA DE ABONOS --> */}
					{/* <!-- RESTA --> */}
					{totalTotal > 0 ? (
						<Row className='finalTicket'>
							<h3>Resta:</h3>
							<h1>${totalTotal - totalAbonos}</h1>
						</Row>
					) : null}

					{/* <!-- VENDEDOR --> */}
					<span>Reimpresión</span>
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
			</Modal>
		</>
	);
};
export default ImprimirApartadoCorte;
