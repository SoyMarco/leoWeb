import React, { useEffect, useState, useRef } from "react";
import ImprimirEncargo from "../Components/ImprimirEncargo/ImprimirEncargo";
import ModalCalendar from "../Components/ModalCalendar/ModalCalendar";
import { CalendarOutlined } from "@ant-design/icons";
import CobrarEncargo from "../Components/Cobrar/CobrarEncargo";
import { TablaProductos, TablaAbonos } from "../Components";
import { openNotification } from "Utils/openNotification";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import ErrorConection from "Utils/ErrorConection";
import ErrorPage from "Pages/Error/Error";
import useAuth from "hooks/useAuth";
import moment from "moment";
import {
	GET_ENCARGO_FOLIO,
	CANCEL_ENTREGA,
	EDIT_GUARDAR_ENCARGO,
} from "graphql/encargo";
import { Row, Card, Skeleton, Button, Switch, Tooltip, Result } from "antd";
import "./Encargo.css";
// import { NetworkStatus } from "@apollo/client";

export default function Encargo() {
	const params = useParams();
	let urlFolio = parseInt(params.folio);
	let { data, loading, error, refetch } = useQuery(GET_ENCARGO_FOLIO, {
		variables: { folio: urlFolio },
		notifyOnNetworkStatusChange: true,
	});
	const [mutateEDIT_GUARDAR_ENCARGO] = useMutation(EDIT_GUARDAR_ENCARGO);
	const [titleWeb, settitleWeb] = useState("Encargo");
	const [mutateCANCEL_ENTREGA] = useMutation(CANCEL_ENTREGA);
	const { logout, auth } = useAuth();
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [modalCalendar, setmodalCalendar] = useState(false);
	const [modalReimprimir, setmodalReimprimir] = useState(false);
	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	const [btnLoading, setbtnLoading] = useState();
	const [dataEncargo, setdataEncargo] = useState(null);
	const [statusEncargo, setstatusEncargo] = useState(false);
	const [productos, setproductos] = useState([]);
	const [abonos, setabonos] = useState([]);
	const [abono, setabono] = useState({ abono: null });
	const [totalProductos, settotalProductos] = useState(0);
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	// const [venceEn, setvenceEn] = useState(null);
	const inputAbono = useRef();
	const [colorVence, setcolorVence] = useState(
		"linear-gradient(#2196F3,#0000E6)"
	);
	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		ErrorConection(logout);
	}
	const cerrarCobrar = () => {
		setmodalCobrar(false);
		inputAbono.current.select();
	};
	useEffect(() => {
		if (data?.getEncargoFolio[0]) {
			setdataEncargo(data?.getEncargoFolio[0]);
			let { productos, abonos, cliente, guardado } = data?.getEncargoFolio[0];

			let listaAbonos = abonos.map((item) => {
				return { ...item, key: item._id };
			});
			setabonos(listaAbonos);

			// let listaProductos = productos.map((item) => {
			// 	return { ...item, key: item._id };
			// });
			setproductos(productos);

			settitleWeb(cliente);
			// let cancel = cancelado[0]?.status ?? true;
			setstatusEncargo(guardado.status);
		}
	}, [data]);
	useEffect(() => {
		if (dataEncargo?.vence) {
			fechaVenceEn();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataEncargo?.vence]);

	useEffect(() => {
		// selectLastRow();
		let sum = 0;
		let sumProd = 0;
		for (let i = 0; i < productos.length; i++) {
			sum += productos[i].totalArticulo;
			sumProd += productos[i].cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);

		let sumAbo = 0;
		for (let i = 0; i < abonos.length; i++) {
			sumAbo += abonos[i].abono;
		}
		settotalAbonos(sumAbo);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productos]);

	const initialState = () => {
		refetch();
		setmodalCobrar();
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
		let fecha = moment.unix(item / 1000).format("LLLL");
		return fecha;
	};
	const pasarAFechaLL = (item) => {
		let fecha = moment.unix(item / 1000).format("LL");
		return fecha;
	};
	const cancelEntrega = async () => {
		setbtnLoading(true);
		let status = dataEncargo?.entregado[0]?.status ?? false;
		try {
			if (dataEncargo.id) {
				let { data } = await mutateCANCEL_ENTREGA({
					// Parameters
					variables: {
						input: {
							id: dataEncargo.id,
							status: status,
						},
					},
				});
				if (data) {
					openNotification(
						"success",
						`Encargo ${status ? "ENTREGADO" : "REACTIVADO"}`
					);
					refetch();
					setbtnLoading(false);
				}
			}
		} catch (error) {
			setbtnLoading(false);
			ErrorConection(logout);
		}
	};
	const fechaVenceEn = () => {
		var fecha = moment.unix(dataEncargo.vence / 1000).fromNow();
		if (dataEncargo.vence > Date.now()) {
			// setvenceEn(`Vence ${fecha}`);
			//Color azul
			setcolorVence("linear-gradient(#2196F3,#0000E6)");
		} else {
			// setvenceEn(`Venció ${fecha}`);
			//Color rojo
			setcolorVence("linear-gradient(#F53636,#D32F2F,#8B0000)");
		}
		// this.vence = fecha;
		return fecha;
	};
	const guardarEncargo = async () => {
		setbtnLoading(true);
		try {
			if (dataEncargo?.id) {
				const { data } = await mutateEDIT_GUARDAR_ENCARGO({
					// Parameters
					variables: {
						input: {
							id: dataEncargo.id,
							status: !dataEncargo.guardado.status,
						},
					},
				});
				if (data) {
					console.log(data);
					refetch();
					openNotification("success", `Se modificó con exito`);
					setbtnLoading(false);
				}
			}
		} catch (error) {
			console.log("error", error);
			setbtnLoading(false);
			ErrorConection(logout);
		}
	};
	return (
		<>
			<title>{titleWeb}</title>

			{/* ENCARGO ENTREGADO */}
			{dataEncargo?.entregado[0]?.status && (
				<Result
					status='warning'
					title={`Este encargo se entregó el día ${pasarAFecha(
						dataEncargo?.entregado[0]?.fecha
					)}, por ${dataEncargo?.entregado[0]?.vendedor?.toUpperCase()}`}
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

			{/* INFO ENCARGO */}
			{dataEncargo?.id ? (
				<Card
					disabled={true}
					actions={[
						<Button
							disabled={!statusEncargo}
							shape='round'
							style={
								statusEncargo
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
							// onClick={() => setmodalCalendar(true)}
							icon={
								<CalendarOutlined
									style={{ fontSize: "large", marginRight: 5 }}
								/>
							}
						>
							{pasarAFechaLL(dataEncargo.createAt)}
						</Button>,
					]}
				>
					{/* Header Card */}
					<Row
						justify='space-around'
						style={{
							background:
								"background: linear-gradient(#000066, #000058, #000036);",

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
						>{`Folio: ${dataEncargo.folio}`}</h1>

						<Row>
							<h1
								style={{
									color: "white",
									fontSize: "x-large",
									fontWeight: "bold",
								}}
							>
								Encargo guardado:
							</h1>
							<Tooltip
								placement='top'
								title={
									statusEncargo ? "Encargo GUARDADO" : "Encargo SIN guardar"
								}
							>
								<Switch
									loading={loader}
									checked={statusEncargo}
									onClick={() => guardarEncargo()}
									style={
										statusEncargo
											? {
													background: "limegreen",
													boxShadow:
														"5px 5px 29px #b3b3b3, -5px -5px 29px #ffffff",
													marginTop: 10,
													marginRight: 5,
											  }
											: {
													marginTop: 10,
													marginRight: 5,
													background: "red", // boxShadow: "5px 5px 19px #b3b3b3, -5px -5px 19px #ffffff",
											  }
									}
									// onChange={logoutApp}
									defaultChecked
								></Switch>
							</Tooltip>
						</Row>
					</Row>
					<h1
						style={{ fontSize: "x-large", fontWeight: "bold" }}
					>{`Cliente: ${dataEncargo?.cliente}`}</h1>

					{/* Tablas PRODUCTOS ABONOS*/}
					{statusEncargo ? (
						<Result
							status='success'
							title={`Encargo gurdado por ${dataEncargo?.guardado?.vendedor?.toUpperCase()}, el día ${pasarAFecha(
								dataEncargo?.guardado?.fecha
							)}`}
						/>
					) : null}
					<Row>
						<TablaProductos
							productos={productos}
							loading={loading}
							loader={loader}
							setloader={setloader}
							refetch={refetch}
							setstateRecord={setstateRecord}
							stateRecord={stateRecord}
							dataEncargo={dataEncargo}
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
						/>
					</Row>
				</Card>
			) : loading ? (
				<Skeleton active />
			) : (
				<ErrorPage />
			)}

			{/* MODAL ENCARGO */}
			{modalCobrar ? (
				<CobrarEncargo
					modalCobrar={modalCobrar}
					setmodalCobrar={setmodalCobrar}
					cerrarCobrar={cerrarCobrar}
					totalTotal={abono.abono}
					listaCompras={dataEncargo}
					initialState={initialState}
					calculateRestaria={calculateRestaria}
					dataEncargo={dataEncargo}
					inputAbono={inputAbono}
				></CobrarEncargo>
			) : null}

			{/* MODAL CALENDARIO */}
			{modalCalendar && (
				<ModalCalendar
					setmodalCalendar={setmodalCalendar}
					modalCalendar={modalCalendar}
					refetch={refetch}
					dataEncargo={dataEncargo}
				/>
			)}

			{/* MODAL REIMPRIMIR */}
			{modalReimprimir ? (
				<ImprimirEncargo
					imprimir={modalReimprimir}
					setimprimir={setmodalReimprimir}
					totalTotal={abono.abono}
					listaCompras={dataEncargo}
					initialState={initialState}
					calculateRestaria={calculateRestaria}
					dataEncargo={dataEncargo}
					auth={auth}
				/>
			) : null}
		</>
	);
}
