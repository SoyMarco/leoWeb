import React, { useEffect, useState } from "react";
import { TablaProductos, TablaApartados } from "../Components";
import { Row, notification, Input, Card } from "antd";
import { useQuery } from "@apollo/client";
import { GET_APARTADOS } from "graphql/apartado";
import { RiWifiOffLine } from "react-icons/ri";
import { BsSearch } from "react-icons/bs";
import "./apartados.css";
export default function Apartados() {
	let { data, loading, error, refetch } = useQuery(GET_APARTADOS);
	const [stateRecord, setstateRecord] = useState(null);
	const [getApartados, setgetApartados] = useState([]);
	const [dataFilter, setdataFilter] = useState(null);
	const [loader, setloader] = useState(false);

	const onChangeFilter = (e) => {
		setdataFilter(null);
		let texto = e.target.value;
		let isNumber = texto / 2;
		console.log(texto, isNumber);
		let newArray = [];

		if (isNumber > 0) {
			for (let apartado of getApartados) {
				let folio = apartado.folio;
				texto = parseInt(texto);
				if (texto === folio) {
					newArray.push(apartado);
				}
			}
		} else {
			for (let apartado of getApartados) {
				let cliente = apartado.cliente.toLowerCase();
				if (cliente.indexOf(texto.toLowerCase()) !== -1) {
					newArray.push(apartado);
				}
			}
		}

		setdataFilter(newArray);
		setstateRecord(null);
	};
	useEffect(() => {
		refetch();
		document.querySelector("#inputSearch").select();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		notification.open({
			message: "Error de conexión",
			description: "Intentalo más tarde",
			icon: <RiWifiOffLine style={{ color: "red" }} />,
		});
	}
	useEffect(() => {
		if (data) {
			console.log(data);
			let { getApartados } = data;
			let listaApartados = getApartados.map((item) => {
				return { ...item, key: item.folio };
			});
			setgetApartados(listaApartados);
		}
	}, [data]);
	return (
		<>
			<Card>
				<div
					style={{
						background: "linear-gradient(#0000a6, #000066)",
						textAlignLast: "center",
						padding: "7px",
						borderRadius: "25px 5px 0 0",
					}}
				>
					<Input
						id='inputSearch'
						prefix={<BsSearch style={{ marginLeft: "20px" }} />}
						placeholder='Buscar...'
						onChange={onChangeFilter}
						style={{
							color: "blue",
							// fontSize: 30,
							fontSize: "x-large",
							fontWeight: "bold",
							borderRadius: "50px",
							maxWidth: "60%",
							padding: "0 0 0 0px",
							border: "0 0 0 0",
						}}
					></Input>
				</div>

				<Row>
					<TablaApartados
						getApartados={dataFilter ?? getApartados}
						loading={loading}
						loader={loader}
						setloader={setloader}
						refetch={refetch}
						setstateRecord={setstateRecord}
						stateRecord={stateRecord}
					/>
					<TablaProductos stateRecord={stateRecord} loading={loading} />
				</Row>
			</Card>
		</>
	);
}
