/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import "moment/locale/es-us";
import { Modal, Row } from "antd";
import "./imprimir.css";
import ReactToPrint from "react-to-print";
import { openNotification } from "Utils/openNotification";

const ImprimirApartado = ({ imprimir, stateRecord, auth, setimprimir }) => {
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const {
		abonos,
		cliente,
		// createAt,
		entregado,
		folio,
		productos,
		vence,
	} = stateRecord;
	const imprimirApartados = useRef();
	useEffect(() => {
		let sum = 0;

		for (let i of productos) {
			sum += productos[i].totalArticulo;
		}
		settotalTotal(sum);

		let sumAbo = 0;
		for (let i of abonos) {
			sumAbo += i.abono;
		}
		settotalAbonos(sumAbo);

		if (imprimir === true) {
			setTimeout(() => {
				document.getElementById("print-button").click();
			}, 100);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imprimir]);
	const afterPrint = () => {
		openNotification("success", "Reimpreso");
		setimprimir(false);
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
		return moment.unix(item / 1000).format("LLL");
	};

	const fechaVenceEn = () => {
		let fecha = moment.unix(stateRecord.vence / 1000).fromNow();
		if (stateRecord.vence > Date.now()) {
			fecha = `Vence ${fecha}`;
		} else {
			fecha = `Venció ${fecha}`;
		}
		return fecha;
	};
	return (
		<>
			<ReactToPrint
				trigger={(e) => <button id='print-button'>Imprimiendo...</button>}
				content={() => imprimirApartados.current}
				// onBeforePrint={() => antesDeImprimir()}
				onAfterPrint={() => afterPrint()}
			/>
			<Modal
				visible={imprimir}
				width='229px'
				onCancel={() => setimprimir(false)}
			>
				<div
					id='tickets'
					className='ticket'
					name='tickets'
					ref={imprimirApartados}
				>
					{/*  LOGO LEO  */}

					{/* <!-- FECHA --> */}
					<Row justify='space-around' style={{ width: "200px" }}>
						<span style={{ paddingLeft: "0px", textAlignLast: "center" }}>
							ROPA Y ACCESORIOS LEO
						</span>
					</Row>

					<h3 className='tituloTicketApartado'>APARTADO</h3>
					{entregado.status === true ? (
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
					{productos.map((item) => {
						return (
							<table key='item.id' className='productosApartado'>
								<tr>
									<td>{item.nombre}</td>
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
					{abonos.map((item) => {
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

					{/* <!-- EFECTIVO --> */}
					{totalTotal > 0 ? (
						<Row className='finalTicket'>
							<h3>Resta:</h3>
							<h1>${totalTotal - totalAbonos}</h1>
						</Row>
					) : null}

					{/* <!-- VENDEDOR --> */}
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
