import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ENCARGOS, EDIT_GUARDAR_ENCARGO } from "myGraphql/encargo";
import { Skeleton, Card, Row, Col, Switch } from "antd";
import { AiFillFolderOpen } from "react-icons/ai";
import moment from "moment";
import "./ReadEncargos.css";
import { useNavigate } from "react-router-dom";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import AuthContext from "context/Auth/AuthContext";

export default function ReadEncargo() {
	const { timeLogout } = useContext(AuthContext);
	let {
		data: dataEncargos,
		loading: loadingEncargos,
		refetch: refetchEncargos,
	} = useQuery(GET_ENCARGOS, {
		notifyOnNetworkStatusChange: true,
	});
	const [mutateEDIT_GUARDAR_ENCARGO] = useMutation(EDIT_GUARDAR_ENCARGO);
	let navigate = useNavigate();
	let widthPantalla = window.screen.width;

	const { Meta } = Card;
	const [btnLoading, setbtnLoading] = useState(false);

	const [encargos, setencargos] = useState([]);
	useEffect(() => {
		refetchEncargos();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (dataEncargos?.getEncargos) {
			let { getEncargos } = dataEncargos;
			setencargos(getEncargos);
		}
	}, [dataEncargos]);
	const pasarAFechaLLLL = (item) => {
		let fecha = moment.unix(item / 1000).format("LLLL");
		return fecha;
	};
	const guardarEncargo = async (e, item) => {
		setbtnLoading(true);
		try {
			if (item?.id) {
				const { data } = await mutateEDIT_GUARDAR_ENCARGO({
					// Parameters
					variables: {
						input: {
							id: item.id,
							status: e,
						},
					},
				});
				if (data) {
					setencargos(data.editGuararEncargo);
					openNotification("success", `Se modificó con exito`);
					setbtnLoading(false);
				}
			}
		} catch (error) {
			console.log("error", error);
			setbtnLoading(false);
			ErrorConection(timeLogout);
		}
	};
	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#001e36" }}>
					ENCARGOS
				</h1>
			</Row>
			<Skeleton loading={loadingEncargos} avatar active>
				<Row gutter={[20, 0]}>
					{encargos?.map((item) => {
						return (
							<Col lg={8} xs={24} className='colAntCard'>
								<Card
									style={{
										width: "100%",
										height: "95%",
										marginTop: 16,
										borderRadius: 10,
										boxShadow: "17px 17px 35px #7a7a7a,-7px -7px 30px #ffffff",
									}}
									actions={[
										widthPantalla < 700 ? null : (
											<div className='divAbrir'>
												<div
													onClick={() =>
														navigate(
															widthPantalla < 700
																? `/mobile/encargo/${item.folio}`
																: `/encargo/${item.folio}`
														)
													}
												>
													<p style={{ marginBottom: 0 }}>Abrir</p>
													<AiFillFolderOpen
														key='abrir'
														style={{ fontSize: "20px" }}
													/>
												</div>
											</div>
										),
										<div className='divAbrir'>
											<div>
												<p style={{ marginBottom: 0 }}>Guardado</p>
												<Switch
													checked={item?.guardado?.status === true}
													disabled={loadingEncargos || btnLoading}
													loading={loadingEncargos || btnLoading}
													onClick={(e) => guardarEncargo(e, item)}
													style={
														item?.guardado?.status === true
															? { background: "limeGreen", fontSize: "20px" }
															: { background: "gray", fontSize: "20px" }
													}
												/>
											</div>
										</div>,
									]}
								>
									<Meta
										className='titleCard'
										title={
											<Row justify='space-between'>
												<h3>{item.cliente}</h3>
												<h4>Folio: {item.folio}</h4>
											</Row>
										}
									/>
									<h4 style={{ marginLeft: "15px" }}>
										{pasarAFechaLLLL(item.createAt)}
									</h4>
									{/* <h4 className='h4Encargos'>Encargos:</h4> */}
									<table className='tablaEncargos'>
										<tr>
											<th>Encargo</th>
											<th>Color</th>
											<th>Genero</th>
										</tr>
										{item?.productos?.map((producto) => {
											return (
												<>
													<tr>
														<td>{producto.nombre}</td>
														<td>{producto.color}</td>
														<td>{producto.genero}</td>
													</tr>
												</>
											);
										})}
									</table>
									<table className='tablaEncargos2'>
										<tr>
											<th>Talla</th>
											<th>Modelo</th>
											<th>Vendedor</th>
										</tr>
										{item?.productos?.map((producto) => {
											return (
												<>
													<tr>
														<td>{producto.talla}</td>
														<td>{producto.modelo}</td>
														<td>{producto.vendedor}</td>
													</tr>
												</>
											);
										})}
									</table>
								</Card>
							</Col>
						);
					})}
				</Row>
			</Skeleton>
		</>
	);
}
