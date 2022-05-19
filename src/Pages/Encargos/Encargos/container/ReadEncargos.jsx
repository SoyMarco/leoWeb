import { useState, useEffect, useContext } from "react";
import { GET_ENCARGOS, EDIT_GUARDAR_ENCARGO } from "myGraphql/encargo";
import SwitchB from "Pages/Encargos/Components/Switch/SwitchB";
import TablaEncargos from "../components/Tabla/TablaEncargos";
import { openNotification } from "Utils/openNotification";
import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "context/Auth/AuthContext";
import ErrorConection from "Utils/ErrorConection";
import { Skeleton, Card, Row, Col } from "antd";
import { GiBoxUnpacking } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./ReadEncargos.css";

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
		return moment.unix(item / 1000).format("LLLL");
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
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "darkBlue" }}>
					ENCARGOS
				</h1>
			</Row>
			<Skeleton loading={loadingEncargos} avatar active>
				<Row gutter={[10, 10]}>
					{encargos?.map((item) => (
						<Col lg={12} xs={24} className='colAntCard'>
							<Card
								style={{
									width: "100%",
									height: "100%",
									marginTop: 10,
									borderRadius: 10,
									boxShadow: "17px 17px 35px #7a7a7a,-7px -7px 30px #ffffff",
								}}
							>
								<Meta
									className='titleCard'
									title={
										<Row justify='space-between'>
											<h3 style={{ color: "darkBlue" }}>{item.cliente}</h3>
											<h4>Folio: {item.folio}</h4>
										</Row>
									}
								/>
								<h4 style={{ marginLeft: "15px" }}>
									{`${pasarAFechaLLLL(item.createAt)} por ${item.vendedor}`}
								</h4>
								<TablaEncargos item={item} />
								<Row className='divAbrir'>
									<Col
										onClick={() =>
											navigate(
												widthPantalla < 700
													? `/mobile/encargo/${item.folio}`
													: `/encargo/${item.folio}`
											)
										}
										flex='50%'
									>
										<p style={{ marginBottom: 0 }}>Abrir</p>
										<GiBoxUnpacking key='abrir' style={{ fontSize: "25px" }} />
									</Col>

									<Col flex='50%'>
										<p style={{ marginBottom: 0 }}>Guardado</p>
										<SwitchB
											loader={loadingEncargos || btnLoading}
											checked={item?.guardado?.status}
											onClick={(e) => guardarEncargo(e, item)}
										/>
									</Col>
								</Row>
							</Card>
						</Col>
					))}
				</Row>
			</Skeleton>
		</>
	);
}
