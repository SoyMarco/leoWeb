import React, { useEffect, useState, useContext } from "react";
import { TablaProductos, TablaApartados } from "../Components";
import { Row, Input, Card } from "antd";
import { useQuery } from "@apollo/client";
import { GET_APARTADOS } from "myGraphql/apartado";
import { BsSearch } from "react-icons/bs";
import "./apartados.css";
import ErrorConection from "Utils/ErrorConection";
import AuthContext from "context/Auth/AuthContext";

export default function Apartados() {
	const { timeLogout } = useContext(AuthContext);
	let { data, loading, error, refetch } = useQuery(GET_APARTADOS);
	const [stateRecord, setstateRecord] = useState({ abonos: {} });
	const [getApartados, setgetApartados] = useState([]);
	const [dataFilter, setdataFilter] = useState(null);
	const [loader, setloader] = useState(false);

	const onChangeFilter = (e) => {
		setdataFilter(null);
		let texto = e.target.value;
		let isNumber = texto / 2;
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
	};
	useEffect(() => {
		refetch();
		document.querySelector("#inputSearch").select();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		ErrorConection(timeLogout);
	}
	useEffect(() => {
		if (data) {
			let { getApartados: arrayMap } = data;
			let listaApartados = arrayMap.map((item) => {
				return { ...item, key: item.folio };
			});
			setgetApartados(listaApartados);
		}
	}, [data]);
	const pressKeyAbono = (e) => {
		// F6 abrir ventana
		if (e.keyCode === 117) {
			document.getElementById("linkNewWindow").click();
		}
	};
	const keyBlock = (e) => {
		if (e.shiftKey || (e.shiftKey && e.which === 51) || e.key === "Dead") {
			e.preventDefault();
		}
		if (
			e.keyCode === 69 ||
			e.keyCode === 73 ||
			e.keyCode === 186 ||
			e.keyCode === 187 ||
			e.keyCode === 189 ||
			e.keyCode === 40 ||
			e.keyCode === 107 ||
			e.keyCode === 109 ||
			e.keyCode === 112 ||
			e.keyCode === 113 ||
			e.keyCode === 114 ||
			e.keyCode === 117 ||
			e.keyCode === 123 ||
			e.keyCode === 191 ||
			e.keyCode === 192 ||
			e.keyCode === 219 ||
			e.keyCode === 220 ||
			e.keyCode === 221 ||
			e.keyCode === 222 ||
			e.keyCode === 38 ||
			e.keyCode === 40 ||
			e.key === "{" ||
			e.key === "}" ||
			e.key === "+" ||
			e.key === "*" ||
			e.key === "[" ||
			e.key === "]" ||
			e.key === "´" ||
			e.key === "/" ||
			e.key === "<" ||
			e.key === "+" ||
			e.key === "´´" ||
			e.key === "ArrowLeft" ||
			e.key === "BracketLeft" ||
			e.key === "BracketRight" ||
			e.key === "Quote" ||
			e.key === "Shift" ||
			e.key === "Dead" ||
			e.shiftKey ||
			e.key === "ArrowDown" ||
			e.key === "ArrowUp"
		) {
			e.preventDefault();
		}
	};
	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "x-large", fontWeight: "bold", color: "blue" }}>
					Buscar apartados
				</h1>
			</Row>
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
						onKeyUp={pressKeyAbono}
						onKeyDown={keyBlock}
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
