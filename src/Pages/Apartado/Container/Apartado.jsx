import React, { useEffect, useState, useRef } from "react";
import { TablaProductos, TablaAbonos } from "../Components";
import ErrorPage from "Pages/Error/Error";
import {
	Row,
	Card,
	Input,
	Skeleton,
	Button,
	Popconfirm,
	Switch,
	Tooltip,
	Progress,
} from "antd";
import { DollarCircleFilled } from "@ant-design/icons";
import { useQuery, gql, useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { GET_PRODUCTOS_FOLIO, CANCELAR_APARTADO } from "graphql/apartado";
import useAuth from "hooks/useAuth";
import { DeleteFilled, PrinterFilled } from "@ant-design/icons";
import { keyBlock } from "Utils";
import { UrlFrontend } from "config/apollo";
import CobrarApartado from "../Components/Cobrar/CobrarApartado";

export default function Apartado(props) {
	const history = useHistory();
	const params = useParams();
	const Location = useLocation();
	let urlFolio = parseInt(params.folio);
	const [titleWeb, settitleWeb] = useState("Apartado");
	const [mutateCANCELAR_APARTADO] = useMutation(CANCELAR_APARTADO);
	let { data, loading, error, refetch } = useQuery(GET_PRODUCTOS_FOLIO, {
		variables: { folio: urlFolio },
	});
	const { logout, auth } = useAuth();
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	const [filter, setfilter] = useState([]);
	const [btnLoading, setbtnLoading] = useState();
	const [dataApartado, setdataApartado] = useState(null);
	const [statusApartado, setstatusApartado] = useState(false);
	const [productos, setproductos] = useState([]);
	const [abonos, setabonos] = useState([]);
	const [abono, setabono] = useState({ abono: null });
	const [totalProductos, settotalProductos] = useState(0);
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const inputAbono = useRef();
	useEffect(() => {
		if (data?.getProductosFolio[0]) {
			setdataApartado(data?.getProductosFolio[0]);
			let { productos, abonos, cliente, cancelado } =
				data?.getProductosFolio[0];

			let listaAbonos = abonos.map((item) => {
				return { ...item, key: item._id };
			});
			setabonos(listaAbonos);

			let listaProductos = productos.map((item) => {
				return { ...item, key: item.idArray };
			});
			setproductos(listaProductos);

			settitleWeb(cliente);
			let cancel = cancelado[0]?.status ?? false;
			setstatusApartado(cancel);
			console.log("inputAbono", inputAbono);
		}
	}, [data]);

	useEffect(() => {
		if (dataApartado?.id) {
			inputAbono.current.select();
		}
	}, [dataApartado?.id]);
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
	}, [productos]);

	if (error) {
		ErrorConection(logout);
	}
	const pressEnter = () => {
		if (abono.abono > 0 && calculateRestaria() >= 0) {
			setmodalCobrar(true);
		}
	};
	const cancelarApartado = async () => {
		setbtnLoading(true);

		try {
			if (dataApartado.id) {
				let { data } = await mutateCANCELAR_APARTADO({
					// Parameters
					variables: {
						input: {
							id: dataApartado.id,
							status: !statusApartado,
						},
					},
				});
				if (data) {
					openNotification(
						"success",
						`Apartado ${statusApartado ? "CANCELADO" : "REACTIVADO"}`
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
	const reimprimirApartado = () => {};

	const pressKeyAbono = (e) => {
		if (e.keyCode === 13) {
			pressEnter();
		}
		if (e.keyCode === 123) {
			pressEnter();
		}
		// F6 abrir ventana
		if (e.keyCode === 117) {
			window.open(UrlFrontend);
		}
		// Cuenta
		if (e.keyCode === 67) {
			history.push("/");
		}
	};
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
	return (
		<>
			<title>{titleWeb}</title>

			{dataApartado?.id ? (
				<Card
					disabled={true}
					actions={[
						<h1
							style={{
								color: "darkblue",
								fontSize: "xx-large",
								fontWeight: "bold",
								marginTop: "-5px",
							}}
						>
							{totalProductos ? `Fecha` : null}
						</h1>,
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
							onClick={pressEnter}
						>
							{abono.abono > 0 ? `Restaría $${calculateRestaria()}` : null}
						</h1>,
						<>
							{/* <Progress
								strokeColor={{
									from: "#108ee9",
									to: "#87d068",
								}}
								percent={99.9}
								status='active'
								style={{ marginTop: "-60px" }}
							/> */}
							<h1
								style={{
									color: "green",
									fontSize: "xxx-large",
									fontWeight: "bold",
									marginTop: "-20px",
								}}
								onClick={pressEnter}
							>
								{totalProductos ? `Resta $${totalTotal - totalAbonos}` : null}
							</h1>
						</>,
					]}
				>
					{/* Header Card */}
					<Row
						justify='space-around'
						style={{
							background: "linear-gradient(#0000a6, #000066)",

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
							(F3)AÑADIR A CUENTA
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
							<Popconfirm
								disabled={!statusApartado}
								title='¿Deseas Reimprimir?'
								onConfirm={() => reimprimirApartado()}
								icon={
									<PrinterFilled
										style={{ color: "blue", fontSize: "large", marginRight: 5 }}
									/>
								}
							>
								<Button
									shape='round'
									style={
										statusApartado
											? {
													background: "linear-gradient(#2196F3,#0000E6)",
													marginTop: 5,
													marginRight: 15,
													color: "white",
													border: 0,
													// fontSize: "large",
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
									// onClick={() => setmodalAddProduct(true)}
									icon={
										<PrinterFilled
											style={{ fontSize: "large", marginRight: 5 }}
										/>
									}
								>
									Reimprimir
								</Button>
							</Popconfirm>
							<Tooltip
								placement='top'
								title={statusApartado ? "APARTADO ACTIVO" : "APARTADO INACTIVO"}
							>
								<Popconfirm
									title={`¿Deseas ${
										statusApartado ? "ELIMINAR" : "RECUPERAR"
									} este apartado?`}
									onConfirm={() => cancelarApartado()}
									icon={
										<DeleteFilled style={{ color: "red", fontSize: "large" }} />
									}
									loading={btnLoading}
								>
									<Switch
										checked={statusApartado}
										style={
											statusApartado
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
								</Popconfirm>
							</Tooltip>
						</Row>
					</Row>
					<h1
						style={{ fontSize: "x-large", fontWeight: "bold" }}
					>{`Cliente: ${dataApartado?.cliente}`}</h1>

					{/* Tablas PRODUCTOS ABONOS*/}
					{statusApartado ? (
						<Row>
							<TablaProductos
								productos={productos}
								loading={loading}
								loader={loader}
								setloader={setloader}
								refetch={refetch}
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
							/>
						</Row>
					) : (
						<ErrorPage />
					)}
				</Card>
			) : loading ? (
				<Skeleton active />
			) : (
				<ErrorPage />
			)}

			{modalCobrar ? (
				<CobrarApartado
					modalCobrar={modalCobrar}
					setmodalCobrar={setmodalCobrar}
					totalTotal={abono.abono}
					listaCompras={dataApartado}
					initialState={initialState}
				></CobrarApartado>
			) : null}
		</>
	);
}
