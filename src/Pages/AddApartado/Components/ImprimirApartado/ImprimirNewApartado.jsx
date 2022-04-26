/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState, useRef, useContext } from "react";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";
import { openNotification } from "Utils/openNotification";
import AuthContext from "context/Auth/AuthContext";
import aceptar from "assets/sonido/Aceptar.wav";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { Row, Button, Card } from "antd";
import "moment/locale/es-us";
import moment from "moment";
import "./imprimir.css";

const ImprimirNewApartado = () => {
	const { dinero, dataApartado, imprimir, cambio } =
		useContext(NewAparadoContext);
	const { abonos, cliente, entregado, folio, productos, vence } = dataApartado;

	const { auth, timeLogout } = useContext(AuthContext);

	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const [numPrint, setnumPrint] = useState(0);

	const imprimirNewApartado = useRef();
	const inputReprint = useRef();
	const navigate = useNavigate();
	const audio = new Audio(aceptar);

	useEffect(() => {
		timeLogout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let sum = 0;
		for (let i = 0; i < productos?.length; i++) {
			sum += productos[i]?.totalArticulo;
		}
		settotalTotal(sum);
		let sumAbo = 0;
		for (let i = 0; i < abonos?.length; i++) {
			sumAbo = sumAbo + abonos[i]?.abono;
		}
		settotalAbonos(sumAbo);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imprimir, abonos, productos]);

	useEffect(() => {
		if (totalAbonos || totalTotal) {
			if (imprimir === true && folio) {
				document.getElementById("print-button").click();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalAbonos, totalTotal, dataApartado, imprimir]);

	const afterPrint = () => {
		openNotification("success", "Apartado guardado con exito");
		if (numPrint === 0) {
			inputReprint.current.select();
			setnumPrint(numPrint + 1);
			audio.play();
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

	return (
		<>
			<ReactToPrint
				trigger={() => (
					<button id='print-button' style={{ display: "none" }}>
						Imprimiendo...
					</button>
				)}
				content={() => imprimirNewApartado.current}
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
					ref={imprimirNewApartado}
					key='divIdTicketsPrintNewApartado'
				>
					{/* <!-- FECHA --> */}
					<Row
						justify='space-around'
						style={{ width: "190px" }}
						key='rowRyAPrintNewApartado'
					>
						<span
							style={{
								paddingLeft: "0px",
								textAlignLast: "center",
							}}
						>
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
							justifyContent: "center",
							maxWidth: 195,
						}}
						key='rowNameClientPrintNewApartado'
					>
						<h2
							style={{
								background: "black",
								color: "white",
								textAlign: "center",
								maxWidth: 195,
								fontWeight: "bold",
								margin: 0,
							}}
						>
							{cliente}
						</h2>
					</Row>
					{
						/* <!-- FOLIO APARTADO --> */
						imprimir && (
							<Row
								style={{
									padding: "0px",
									background: "black",
									maxWidth: "195px",
									justifyContent: "center",
									marginTop: 5,
								}}
								key='rowfolioApartadoPrintNewApartado'
							>
								<h2
									className='sutituloTicket'
									style={{
										background: "black",
										color: "white",
										textAlign: "center",
										padding: "0px",
										maxWidth: "195px",
										fontWeight: "bold",
										margin: 0,
									}}
								>
									Folio: {folio}
								</h2>
							</Row>
						)
					}
					{/* <!-- VENCE --> */}
					<Row
						justify='space-around'
						style={{
							width: "190px",
						}}
						key='rowvencePrintNewApartado'
					>
						<span
							style={{ fontWeight: "bold" }}
						>{`${fechaVenceEn()}, el ${pasarAFechaVence(vence)}`}</span>
					</Row>
					{/* <!-- TABLA DE PRODUCTOS --> */}
					<h3 className='subtituloTicketApartado'>
						<u>PRODUCTOS</u>
					</h3>
					{productos?.map((item) => {
						return (
							<table
								key={`tableProcut${item.idArray}`}
								className='productosApartado'
							>
								<tbody>
									<tr>
										<td>{item.nombre}</td>
										<td className={item.cantidad > 1 ? null : "finalTicket"}>
											${item.precio}
										</td>
									</tr>
								</tbody>
								{item.cantidad > 1 ? (
									<tbody>
										<tr>
											<td>X{item.cantidad}</td>
											<td className='finalTicket'>${item.totalArticulo}</td>
										</tr>
									</tbody>
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
								<tbody>
									<tr>
										<td style={{ padding: "0px" }}>
											{pasarAFechaCorta(item.createAt)}
										</td>
										<td className={"finalTicket"}>${item.abono}</td>
									</tr>
								</tbody>
							</table>
						);
					})}
					<h3 className='sumaTabla'>Abonos: ${totalAbonos}</h3>
					{/* <!-- FIN TABLA DE ABONOS --> */}
					{/* <!-- RESTA --> */}
					{totalTotal > 0 ? (
						<Row className='finalTicket' key='rowrestaPrintNewApartado'>
							<h3>Resta:</h3>
							<h1>${totalTotal - totalAbonos}</h1>
						</Row>
					) : null}
					{dinero && <span>{`Pagó con:`}</span>}
					<br></br>
					{/* <!-- EFECTIVO --> */}
					{dinero?.efectivo > 0 ? (
						<Row className='finalTicket' key='rowefectivoPrintNewApartado'>
							<h3>Efectivo:</h3>
							<h2>${dinero.efectivo}</h2>
						</Row>
					) : null}{" "}
					{/* <!-- TARJETA --> */}
					{dinero?.tarjeta > 0 ? (
						<Row className='finalTicket' key='rowtarjetaPrintNewApartado'>
							<h3>Tarjeta:</h3>
							<h2>${dinero?.tarjeta}</h2>
						</Row>
					) : null}{" "}
					{/* <!-- A CUENTA --> */}
					{dinero?.aCuenta > 0 ? (
						<Row className='finalTicket' key='rowacuentaPrintNewApartado'>
							<h3>A cuenta:</h3>
							<h2>${dinero.aCuenta}</h2>
						</Row>
					) : null}
					{/* <!-- CAMBIO --> */}
					{cambio > 0 ? (
						<Row className='finalTicket' key='rowcambioPrintNewApartado'>
							<h3>Cambio:</h3>
							<h2>${cambio}</h2>
						</Row>
					) : null}
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
export default ImprimirNewApartado;
