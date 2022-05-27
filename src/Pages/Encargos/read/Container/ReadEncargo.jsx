import { useState, useEffect } from "react";
import { GET_ENCARGO_FOLIO } from "myGraphql/encargo";
import { Card, Row, Col, Switch } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import moment from "moment";

export default function ReadEncargo() {
	const params = useParams();
	const urlFolio = parseInt(params.folio);
	const { data: dataEncargo } = useQuery(GET_ENCARGO_FOLIO, {
		variables: { folio: urlFolio },
		notifyOnNetworkStatusChange: true,
	});

	const [EncargoFolio, setEncargoFolio] = useState({});
	const { Meta } = Card;

	useEffect(() => {
		if (dataEncargo) {
			setEncargoFolio(dataEncargo?.getEncargoFolio[0]);
		}
	}, [dataEncargo]);

	const pasarAFechaLLLL = (item) => {
		return moment.unix(item / 1000).format("LLLL");
	};

	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#001e36" }}>
					ENCARGO
				</h1>
			</Row>
			<Col lg={24} xs={24} className='colAntCard'>
				<Card
					style={{
						width: "100%",
						height: "95%",
						marginTop: 16,
						borderRadius: 10,
						boxShadow: "17px 17px 35px #7a7a7a,-7px -7px 30px #ffffff",
					}}
					actions={[
						<div className='divAbrir'>
							<div>
								<p style={{ marginBottom: 0 }}>Guardadoo</p>
								<Switch
									checked={EncargoFolio?.guardado?.status === true}
									style={
										EncargoFolio?.guardado?.status === true
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
								<h3>{EncargoFolio.cliente}</h3>
								<h4>Folio: {EncargoFolio.folio}</h4>
							</Row>
						}
					/>
					<h4 style={{ marginLeft: "15px" }}>
						{pasarAFechaLLLL(EncargoFolio.createAt)}
					</h4>
					<Row>
						<Col lg={11} xs={24}>
							{/* Tabla Encargos */}
							<table className='tablaEncargos'>
								<tr>
									<th>Encargo</th>
									<th>Color</th>
									<th>Genero</th>
								</tr>
								{EncargoFolio?.productos?.map((producto) => {
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
						</Col>
						<Col lg={11} xs={24}>
							{/* Tabla Abonos */}
							<table className='tablaEncargos'>
								<tr>
									<th>Abono</th>
									<th>Fecha</th>
									<th>Vendedor</th>
								</tr>
								{EncargoFolio?.abonos?.map((abono) => {
									return (
										<>
											<tr>
												<td>{abono.abono}</td>
												<td>{abono.createAt}</td>
												<td>{abono.vendedor}</td>
											</tr>
										</>
									);
								})}
							</table>
						</Col>
					</Row>
				</Card>
			</Col>
		</>
	);
}
