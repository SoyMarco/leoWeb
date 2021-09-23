import { Row } from "antd";
import React, { useState, useEffect } from "react";
import EncargoTable from "Pages/Encargos/create/Components/EncargoTable";
import { useApolloClient /* , useMutation  */ } from "@apollo/client";
// import { openNotification } from "Utils/openNotification";
// import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
// import { useHistory } from "react-router-dom";
// import aceptar from "assets/sonido/Aceptar.wav";
import ImprimirNewEncargo from "../components/ImprimirEncargo/ImprimirNewEncargo";
import { GET_ENCARGOS } from "graphql/encargo";
export default function ReadEncargo() {
	const client = useApolloClient();
	let getEncargos = client.readQuery({
		query: GET_ENCARGOS,
	});

	// const audio = new Audio(aceptar);

	// const history = useHistory();
	const { auth /* , logout  */ } = useAuth();
	// const [abono, setabono] = useState(0);
	// const [modalAbono, setmodalAbono] = useState(false);
	const [imprimirEncargo, setimprimirEncargo] = useState(false);
	// const [loader, setloader] = useState(false);

	useEffect(() => {}, [getEncargos]);

	const [listaProductos, setlistaProductos] = useState([]);
	// const [cliente, setcliente] = useState("");

	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "darkblue" }}>
					ENCARGOS
				</h1>
			</Row>

			<EncargoTable
				listaProductos={listaProductos}
				setlistaProductos={setlistaProductos}
			/>

			{imprimirEncargo && (
				<ImprimirNewEncargo
					imprimir={imprimirEncargo}
					setimprimir={setimprimirEncargo}
					totalTotal={0}
					auth={auth}
					listaProductos={listaProductos}
					// abono={abono}
					// cliente={cliente}
					// dataApartado={dataApartado}
					// dinero={dinero}
					// cambio={cambio}
				/>
			)}
		</>
	);
}
