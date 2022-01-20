import React, { useEffect, useState, useRef, useContext } from "react";
import ImprimirApartado from "Pages/Apartado/Components/ImprimirApartado/ImprimirApartado";
import ModalCalendar from "Pages/Apartado/Components/ModalCalendar/ModalCalendar";
import {
	DollarCircleFilled,
	CalendarOutlined,
	DeleteFilled,
	PrinterFilled,
} from "@ant-design/icons";
import CobrarApartado from "../Components/Cobrar/CobrarApartado";
import { TablaProductos, TablaAbonos } from "../Components";
import { openNotification } from "Utils/openNotification";
import { useParams, useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import ErrorConection from "Utils/ErrorConection";
import ErrorPage from "Pages/Error/Error";
import AuthContext from "context/Auth/AuthContext";
import { keyBlock } from "Utils";
import moment from "moment";
import {
	GET_PRODUCTOS_FOLIO,
	CANCELAR_APARTADO,
	CANCEL_ENTREGA,
} from "graphql/apartado";
import {
	Row,
	Card,
	Input,
	Skeleton,
	Button,
	Popconfirm,
	Switch,
	Tooltip,
	Result,
} from "antd";
import "./apartados.css";

export default function Apartado(props) {
	const { auth, timeLogout } = useContext(AuthContext);

	const history = useHistory();
	const params = useParams();
	let urlFolio = parseInt(params.folio);
	let {
		data: getApartadoFolio,
		loading,
		error,
		refetch,
	} = useQuery(GET_PRODUCTOS_FOLIO, {
		variables: { folio: urlFolio },
		notifyOnNetworkStatusChange: true,
	});
	const [titleWeb, settitleWeb] = useState("Apartado");
	const [mutateCANCELAR_APARTADO] = useMutation(CANCELAR_APARTADO);
	const [mutateCANCEL_ENTREGA] = useMutation(CANCEL_ENTREGA);
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [modalCalendar, setmodalCalendar] = useState(false);
	const [modalReimprimir, setmodalReimprimir] = useState(false);
	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	const [btnLoading, setbtnLoading] = useState();
	const [dataApartado, setdataApartado] = useState(null);
	const [statusApartado, setstatusApartado] = useState(false);
	const [productos, setproductos] = useState([]);
	const [abonos, setabonos] = useState([]);
	const [abono, setabono] = useState({ abono: null });
	const [totalProductos, settotalProductos] = useState(0);
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const [venceEn, setvenceEn] = useState(null);
	const inputAbono = useRef();
	const [colorVence, setcolorVence] = useState(
		"linear-gradient(#2196F3,#0000E6)"
	);
	useEffect(() => {
		refetch();
		timeLogout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		ErrorConection(timeLogout);
	}
	const cerrarCobrar = () => {
		setmodalCobrar(false);
		inputAbono.current.select();
	};

	useEffect(() => {
		setdataApartado(getApartadoFolio?.getProductosFolio);
	}, [getApartadoFolio]);

	useEffect(() => {
		if (dataApartado) {
			let {
				productos: productosGet,
				abonos: abonosGet,
				cliente,
				cancelado,
			} = dataApartado;

			let listaAbonos = [];
			for (const item of abonosGet) {
				if (item.cancel !== true) {
					listaAbonos.push(item);
				}
			}
			setabonos(listaAbonos);

			let listaProductos = productosGet.map((item) => {
				return { ...item, key: item._id };
			});
			setproductos(listaProductos);

			settitleWeb(cliente);
			let cancel = cancelado[0]?.status ?? true;
			setstatusApartado(cancel);
		}
	}, [dataApartado]);

	useEffect(() => {
		if (dataApartado?.vence) {
			fechaVenceEn();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataApartado?.vence]);

	useEffect(() => {
		if (dataApartado?.id) {
			inputAbono.current.select();
		}
	}, [dataApartado?.id]);

	useEffect(() => {
		let sum = 0;
		let sumProd = 0;
		for (const iterator of productos) {
			sum += iterator.totalArticulo;
			sumProd += iterator.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);

		let sumAbo = 0;

		for (const abn of abonos) {
			if (abn?.cancel?.status !== true) {
				sumAbo += abn.abono;
			}
		}
		settotalAbonos(sumAbo);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productos]);

	const pressEnter = () => {
		if (abono.abono > 0 && calculateRestaria() >= 0) {
			setmodalCobrar(true);
		}
	};
	const cancelarApartado = async () => {
		if (loader === false) {
			setloader(true);

			try {
				if (dataApartado.id) {
					let { data: dataCancelApartado } = await mutateCANCELAR_APARTADO({
						// Parameters
						variables: {
							input: {
								id: dataApartado.id,
								status: !statusApartado,
							},
						},
					});
					if (dataCancelApartado) {
						openNotification(
							"success",
							`Apartado ${statusApartado ? "CANCELADO" : "REACTIVADO"}`
						);
						refetch();
						setloader(false);
					}
				}
			} catch (err) {
				setloader(false);
				ErrorConection(timeLogout);
			}
		}
	};
	const pressKeyAbono = (e) => {
		if (e.keyCode === 13) {
			pressEnter();
		}
		// ESC
		if (e.keyCode === 27) {
			if (abono.abono > 0) {
				setabono({ abono: null });
			} else {
				history.push("/");
			}
		}

		// Reimprimir
		if (e.keyCode === 112) {
			setmodalReimprimir(true);
		}
		if (e.keyCode === 123) {
			pressEnter();
		}
		// F6 abrir ventana
		if (e.keyCode === 117) {
			document.getElementById("linkNewWindow").click();
		}
		// Cuenta
		if (e.keyCode === 67) {
			history.push("/");
		}
	};
	const initialState = (data) => {
		setdataApartado(data.addAbono);
		setmodalCobrar(false);
		setabono({ abono: null });
		inputAbono.current.select();
	};
	const calculateRestaria = () => {
		let addAbono = 0;
		if (parseInt(abono.abono) > 0) {
			addAbono = parseInt(abono.abono);
		}
		let restaría = 0;
		restaría = parseInt(totalTotal - (totalAbonos + addAbono)) ?? 0;

		return restaría;
	};
	const pasarAFecha = (item) => {
		return moment.unix(item / 1000).format("LLLL");
	};
	const pasarAFechaLL = (item) => {
		return moment.unix(item / 1000).format("LL");
	};
	const cancelEntrega = async () => {
		setbtnLoading(true);
		let status = dataApartado?.entregado[0]?.status ?? false;
		try {
			if (dataApartado.id) {
				let { data: dataCancelEntrega } = await mutateCANCEL_ENTREGA({
					// Parameters
					variables: {
						input: {
							id: dataApartado.id,
							status: status,
						},
					},
				});
				if (dataCancelEntrega) {
					openNotification(
						"success",
						`Apartado ${status ? "ENTREGADO" : "REACTIVADO"}`
					);
					refetch();
					setbtnLoading(false);
				}
			}
		} catch (err) {
			setbtnLoading(false);
			ErrorConection(timeLogout);
		}
	};
	const fechaVenceEn = () => {
		let fecha = moment.unix(dataApartado.vence / 1000).fromNow();
		if (dataApartado.vence > Date.now()) {
			setvenceEn(`Vence ${fecha}`);
			//Color azul
			setcolorVence("linear-gradient(#2196F3,#0000E6)");
		} else {
			setvenceEn(`Venció ${fecha}`);
			//Color rojo
			setcolorVence("linear-gradient(#F53636,#D32F2F,#8B0000)");
		}
		return fecha;
	};
	const titlePopconfirm = () => {
		let title = "¿Deseas  RECUPERAR este apartado?";
		if (statusApartado) {
			title = "¿Deseas  DESACTIlet este apartado?";
		}
		return title;
	};
	const titleTooltip = () => {
		let title = "APARTADO INACTIVO";
		if (statusApartado) {
			title = "APARTADO ACTIVO";
		}
		return title;
	};
	const renderTablaProductosAbonos = () => {
		if (statusApartado) {
			return (
				<Row>
					<TablaProductos
						productos={productos}
						loading={loading}
						loader={loader}
						setloader={setloader}
						refetch={refetch}
						initialState={initialState}
						setstateRecord={setstateRecord}
						stateRecord={stateRecord}
						dataApartado={dataApartado}
						totalProductos={totalProductos}
						totalTotal={totalTotal}
						inputAbono={inputAbono}
					/>
					<TablaAbonos
						abonos={abonos}
						abono={abono}
						loading={loading}
						loader={loader}
						setloader={setloader}
						totalAbonos={totalAbonos}
						inputAbono={inputAbono}
						totalTotal={totalTotal}
						refetch={refetch}
						getApartadoFolio={getApartadoFolio}
					/>
				</Row>
			);
		} else {
			return (
				<Result
					status='error'
					title={`Este apartado se canceló el día ${pasarAFecha(
						dataApartado?.cancelado[0]?.fecha
					)}, por ${dataApartado?.cancelado[0]?.vendedor?.toUpperCase()}`}
				/>
			);
		}
	};
	const renderLoading = () => {
		if (loading) {
			return <Skeleton active />;
		}
		return <ErrorPage />;
	};
	return (
		<>
			<title>{titleWeb}</title>

			{/* APARTADO ENTREGADO */}
			{dataApartado?.entregado[0]?.status && (
				<Result
					status='warning'
					title={`Este apartado se entregó el día ${pasarAFecha(
						dataApartado?.entregado[0]?.fecha
					)}, por ${dataApartado?.entregado[0]?.vendedor?.toUpperCase()}`}
					extra={
						<Button
							type='primary'
							key='console'
							loading={btnLoading}
							onClick={() => cancelEntrega()}
						>
							Quitar entrega
						</Button>
					}
				/>
			)}

			{
				/* INFO APARTADO */
				dataApartado?.id ? (
					<Card
						disabled={true}
						actions={[
							<Button
								disabled={!statusApartado}
								shape='round'
								style={
									statusApartado
										? {
												background: colorVence,
												marginTop: 5,
												marginRight: 15,
												color: "white",
												border: 0,
												fontSize: "large",
												fontWeight: "bold",
										  }
										: {
												background: "gray",
												marginTop: 5,
												marginRight: 15,
												color: "white",
												border: 0,
												// fontSize: "large",
												fontWeight: "bold",
										  }
								}
								onClick={() => setmodalCalendar(true)}
								icon={
									<CalendarOutlined
										style={{ fontSize: "large", marginRight: 5 }}
									/>
								}
							>
								{`${venceEn}, ${pasarAFechaLL(dataApartado.vence)}`}
							</Button>,
							<h1
								style={
									calculateRestaria() >= 0
										? {
												color: "green",
												fontSize: "x-large",
												fontWeight: "bold",
										  }
										: {
												color: "red",
												fontSize: "x-large",
												fontWeight: "bold",
										  }
								}
								onClick={() => pressEnter}
							>
								{abono.abono > 0 ? `Restaría $${calculateRestaria()}` : null}
							</h1>,
							<>
								<h1 className='totalRestaApartado' onClick={() => pressEnter}>
									{totalProductos ? `Resta $${totalTotal - totalAbonos}` : null}
								</h1>
							</>,
						]}
					>
						{/* Header Card */}
						<Row
							justify='space-around'
							style={{
								background: "linear-gradient(#000066, #000058, #000036)",
								padding: "7px",
								borderRadius: "25px 5px 0 0",
							}}
						>
							{/* Ingresar Abono */}
							<h1
								style={{
									color: "white",
									fontSize: "x-large",
									fontWeight: "bold",
								}}
							>{`Folio: ${dataApartado.folio}`}</h1>
							<Tooltip
								placement='top'
								title={`
							(F1)Imprimir
							  (F12)ENTREGAR`}
							>
								<Input
									// id='inputAbono'
									ref={inputAbono}
									placeholder='Abono'
									disabled={!statusApartado}
									// prefix={<AiFillDollarCircle style={{ marginLeft: "20px" }} />}
									style={{
										color: "green",
										// fontSize: 30,
										fontSize: "x-large",
										fontWeight: "bold",
										borderRadius: "50px",
										maxWidth: "60%",
										padding: "0 0 0 0px",
										border: "0 0 0 0",
									}}
									prefix={<DollarCircleFilled style={{ marginLeft: "10px" }} />}
									onKeyUp={pressKeyAbono}
									onKeyDown={keyBlock}
									value={abono.abono}
									onChange={(e) => setabono({ abono: e.target.value })}
								/>
							</Tooltip>
							<Row>
								<Button
									disabled={!statusApartado || loader}
									loading={loader}
									shape='round'
									style={{
										background: statusApartado
											? "linear-gradient(#2196F3,#0000E6)"
											: "gray",
										marginTop: 5,
										marginRight: 15,
										color: "white",
										border: 0,
										fontWeight: "bold",
									}}
									onClick={() => setmodalReimprimir(true)}
									icon={
										<PrinterFilled
											style={{ fontSize: "large", marginRight: 5 }}
										/>
									}
								>
									Reimprimir
								</Button>

								<Tooltip placement='top' title={() => titleTooltip()}>
									<Popconfirm
										title={() => titlePopconfirm()}
										onConfirm={() => cancelarApartado()}
										icon={
											<DeleteFilled
												style={{ color: "red", fontSize: "large" }}
											/>
										}
										loading={loader}
										disabled={loader}
									>
										<Switch
											loading={loader}
											checked={statusApartado}
											style={{
												marginTop: 10,
												marginRight: 5,
												background: statusApartado ? "limegreen" : "red",
												boxShadow: statusApartado
													? "5px 5px 29px #b3b3b3, -5px -5px 29px #ffffff"
													: null,
											}}
											defaultChecked
										></Switch>
									</Popconfirm>
								</Tooltip>
							</Row>
						</Row>
						<h1 className='nameClient'>{`Cliente:  ${dataApartado?.cliente}`}</h1>

						{
							/* Tablas PRODUCTOS ABONOS*/
							renderTablaProductosAbonos()
						}
					</Card>
				) : (
					renderLoading()
				)
			}

			{}
			{
				/* MODAL APARTADO */
				modalCobrar ? (
					<CobrarApartado
						modalCobrar={modalCobrar}
						setmodalCobrar={setmodalCobrar}
						cerrarCobrar={cerrarCobrar}
						totalTotal={abono.abono}
						listaCompras={dataApartado}
						initialState={initialState}
						calculateRestaria={calculateRestaria}
						dataApartado={dataApartado}
						inputAbono={inputAbono}
					></CobrarApartado>
				) : null
			}

			{
				/* MODAL CALENDARIO */
				modalCalendar && (
					<ModalCalendar
						setmodalCalendar={setmodalCalendar}
						modalCalendar={modalCalendar}
						refetch={refetch}
						dataApartado={dataApartado}
					/>
				)
			}

			{}
			{
				/* MODAL REIMPRIMIR */
				modalReimprimir ? (
					<ImprimirApartado
						imprimir={modalReimprimir}
						setimprimir={setmodalReimprimir}
						totalTotal={abono.abono}
						listaCompras={dataApartado}
						initialState={initialState}
						calculateRestaria={calculateRestaria}
						dataApartado={dataApartado}
						auth={auth}
					/>
				) : null
			}
		</>
	);
}
