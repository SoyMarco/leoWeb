/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useRef } from "react";
import { openNotification } from "Utils/openNotification";
import { Modal, Row, Divider, Button } from "antd";
import ReactToPrint from "react-to-print";
import { keyBlock } from "Utils";
import "moment/locale/es-us";
import moment from "moment";
import "./imprimir.css";

const ImprimirApartado = ({
	imprimir,
	dataApartado,
	auth,
	setimprimir,
	dinero,
	cambio,
	initialState,
}) => {
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const [numPrint, setnumPrint] = useState(0);
	const { abonos, cliente, entregado, folio, productos, vence } = dataApartado;

	const ReimprimirApartado = useRef();
	const inputReprint = useRef();

	useEffect(() => {
		let sum = 0;
		for (let i = 0; i < productos?.length; i++) {
			sum += productos[i]?.totalArticulo;
		}
		settotalTotal(sum);

		let sumAbo = 0;
		for (let i = 0; i < abonos?.length; i++) {
			sumAbo += abonos[i]?.abono;
		}
		settotalAbonos(sumAbo);
	}, [imprimir, abonos, productos]);
	useEffect(() => {
		if (totalAbonos || totalTotal) {
			if (imprimir === true) {
				document.getElementById("print-button2").click();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalAbonos, totalTotal]);
	const afterPrint = () => {
		openNotification("success", "Reimpreso con exito");
		if (numPrint === 0) {
			inputReprint.current.select();
			setnumPrint(numPrint + 1);
		} else if (numPrint === 1) {
			let data = { addAbono: dataApartado };
			initialState(data);
			setimprimir(false);
		}
	};
	const pressKeyPrecio = (e) => {
		// Enter
		if (e.keyCode === 13) {
			document.getElementById("print-button2").click();
		}
		// 	F1
		if (e.keyCode === 112) {
			document.getElementById("print-button2").click();
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
		let data = { addAbono: dataApartado };

		initialState(data);
		setimprimir(false);
	};
	return (
		<>
			<ReactToPrint
				trigger={(e) => <button id='print-button2'>Imprimiendo...</button>}
				content={() => ReimprimirApartado.current}
				// onBeforePrint={() => antesDeImprimir()}
				onAfterPrint={() => afterPrint()}
			/>

			<Modal
				visible={imprimir}
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
						onClick={() => document.getElementById("print-button2").click()}
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
						justify='center'
						style={{
							padding: "0px",
							background: "black",
							marginBottom: "5px",
							// justifyContent: "center",
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
							<table key={`${item._id}table`} className='productosApartado'>
								<tbody>
									<tr key={`${item._id}tr`}>
										<td key={`${item._id}nombre`}>{item.nombre}</td>
										<td key={`${item._id}cantidad`}>
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
								</tbody>
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
							<table key={`${item._id}table`} className='productosApartado'>
								<tbody>
									<tr key={`${item._id}tr`}>
										<td style={{ padding: "0px" }} key={`${item._id}fecha`}>
											{pasarAFechaCorta(item.createAt)}
										</td>
										<td key={`${item._id}abono`}>
											<h3 className={"finalTicket"}>${item.abono}</h3>
										</td>
									</tr>
								</tbody>
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
					{dinero && <span>{`Pagó con:`}</span>}
					<br></br>
					{/* <!-- EFECTIVO --> */}
					{dinero?.efectivo > 0 ? (
						<Row className='finalTicket'>
							<h3>Efectivo:</h3>
							<h2>${dinero.efectivo}</h2>
						</Row>
					) : null}{" "}
					{/* <!-- TARJETA --> */}
					{dinero?.tarjeta > 0 ? (
						<Row className='finalTicket'>
							<h3>Tarjeta:</h3>
							<h2>${dinero?.tarjeta}</h2>
						</Row>
					) : null}{" "}
					{/* <!-- A CUENTA --> */}
					{dinero?.aCuenta > 0 ? (
						<Row className='finalTicket'>
							<h3>A cuenta:</h3>
							<h2>${dinero.aCuenta}</h2>
						</Row>
					) : null}
					{/* <!-- CAMBIO --> */}
					{cambio > 0 ? (
						<Row className='finalTicket'>
							<h3>Cambio:</h3>
							<h2>${cambio}</h2>
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
export default ImprimirApartado;
