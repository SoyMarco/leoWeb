import { Row } from "antd";
import React, { useState, useEffect } from "react";
import EncargoTable from "Pages/Encargos/create/Components/EncargoTable";
import { useApolloClient, useMutation } from "@apollo/client";
import { GET_APARTADOS_BUSCADOR } from "graphql/apartado";
import { REGISTER_ENCARGO } from "graphql/encargo";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
import { useHistory } from "react-router-dom";
import ModalAbonoEncargo from "../Components/ModalAbonoEncargo";
import aceptar from "assets/sonido/Aceptar.wav";
import ImprimirNewEncargo from "../Components/ImprimirEncargo/ImprimirNewEncargo";

export default function ReadEncargo() {
	const [mutateREGISTER_ENCARGO] = useMutation(REGISTER_ENCARGO);

	const client = useApolloClient();
	let apartadosBuscador = client.readQuery({
		query: GET_APARTADOS_BUSCADOR,
	});

	const audio = new Audio(aceptar);

	const history = useHistory();
	const { auth, logout } = useAuth();
	// const [optionsClientes, setoptionsClientes] = useState([]);
	const [abono, setabono] = useState(0);
	const [modalAbono, setmodalAbono] = useState(false);
	const [imprimirEncargo, setimprimirEncargo] = useState(false);
	const [loader, setloader] = useState(false);

	useEffect(() => {
		if (apartadosBuscador?.getApartados) {
			let { getApartados } = apartadosBuscador;
			let listClientes = [];
			for (let i = 0; i < getApartados.length; i++) {
				const element = getApartados[i].cliente;
				let repetido = false;
				for (let x = 0; x < listClientes.length; x++) {
					if (listClientes[x].value === element) {
						repetido = true;
					}
				}
				if (repetido === false) {
					listClientes.push({ value: element });
				}
			}
			// setoptionsClientes(listClientes);
		}
	}, [apartadosBuscador]);

	const [listaProductos, setlistaProductos] = useState([]);
	// const [cliente, setcliente] = useState("");

	const guardarEncargo = async () => {
		if (loader === false) {
			try {
				const { data } = await mutateREGISTER_ENCARGO({
					variables: {
						input: {
							productos: listaProductos,
							abonos: [{ abono: abono, vendedor: auth.name }],
							// cliente: cliente,
						},
					},
				});
				if (data) {
					audio.play();
					openNotification("success", `Encargo guardado `);
					setloader(false);
					history.push("/");
				}
			} catch (error) {
				setloader(false);
				ErrorConection(logout);
			}
		}
	};

	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "darkblue" }}>
					ENCARGO
				</h1>
			</Row>

			<EncargoTable
				listaProductos={listaProductos}
				setlistaProductos={setlistaProductos}
			/>
			<ModalAbonoEncargo
				modalAbono={modalAbono}
				setmodalAbono={setmodalAbono}
				setabono={setabono}
				abono={abono}
				loader={loader}
				guardarEncargo={guardarEncargo}
				setimprimirEncargo={setimprimirEncargo}
			/>
			{imprimirEncargo && (
				<ImprimirNewEncargo
					imprimir={imprimirEncargo}
					setimprimir={setimprimirEncargo}
					totalTotal={0}
					auth={auth}
					listaProductos={listaProductos}
					abono={abono}
					// cliente={cliente}
					// dataApartado={dataApartado}
					// dinero={dinero}
					// cambio={cambio}
				/>
			)}
		</>
	);
}
