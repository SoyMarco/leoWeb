import React from "react";
import { keyBlock } from "Utils";
import { AiFillDollarCircle } from "react-icons/ai";
import { Input } from "antd";
import { useHistory } from "react-router-dom";
import GetVentasF3 from "Pages/GetVentasF3/Container/GetVentasF3";

export default function Encabezado({
	precio,
	setprecio,
	handlePrecio,
	listaCompras,
	setlistaCompras,
	idArticulo,
	setidArticulo,
	setmodalCobrar,
	selectedRowKeys,
	setselectedRowKeys,
	removeArticulo,
	addArticulo,
	stateRecord,
}) {
	const history = useHistory();
	const pressEnter = () => {
		if (precio.precio > 0) {
			setlistaCompras([
				...listaCompras,
				{
					key: idArticulo + 1,
					nombre: "Articulo",
					precio: Math.round(precio.precio * 100) / 100,
					cantidad: 1,
					apartado: 0,
					refApartado: "0",
					totalArticulo: Math.round(precio.precio * 100) / 100,
				},
			]);
			setprecio({ precio: null });
			setidArticulo(idArticulo + 1);
		} else if (listaCompras.length > 0) {
			setmodalCobrar(true);
		}
	};
	const rowAbajo = () => {
		for (let i = 0; i < listaCompras.length; i++) {
			const element = listaCompras[i].key;
			if (element === selectedRowKeys[0]) {
				let newRow = i - 1;
				setselectedRowKeys([listaCompras[newRow]?.key]);
				return;
			}
		}
	};
	const rowArriba = () => {
		for (let i = 0; i < listaCompras.length; i++) {
			const element = listaCompras[i].key;
			if (element === selectedRowKeys[0]) {
				let newRow = i + 1;
				setselectedRowKeys([listaCompras[newRow]?.key]);
				return;
			}
		}
	};

	// Press Key Precio commands
	const pressKeyPrecio = (e) => {
		if (e.keyCode === 13) {
			pressEnter();
		}
		// Tecla ⬆️
		if (e.keyCode === 38) {
			if (listaCompras.length > 1) {
				let max = listaCompras.length - 1;
				if (listaCompras[max].key !== selectedRowKeys[0]) {
					rowArriba();
				}
			}
		}
		// Tecla ⬇️
		if (e.keyCode === 40) {
			if (listaCompras.length > 1) {
				if (listaCompras[0].key !== selectedRowKeys[0]) {
					rowAbajo();
				}
			}
		}
		if (e.keyCode === 66) {
			document.querySelector("#buscarApartadoInput").select();
		}
		if (e.keyCode === 67) {
			history.push("/corte");
		}
		if (e.keyCode === 78) {
			history.push("/add");
		}
		if (e.keyCode === 121) {
			document.querySelector("#buscarApartadoInput").select();
		}
		if (e.keyCode === 122) {
			history.push("/add");
		}
		if (e.keyCode === 123) {
			pressEnter();
		}
		// F6 abrir ventana
		if (e.keyCode === 117) {
			document.getElementById("linkNewWindow").click();
		}
		if (e.keyCode === 107) {
			if (stateRecord) {
				addArticulo(stateRecord);
			}
		}
		if (e.keyCode === 109) {
			if (stateRecord) {
				removeArticulo(stateRecord);
			}
		}
		if (e.keyCode === 46) {
			if (stateRecord) {
				removeArticulo(stateRecord);
			}
		}
	};
	return (
		<div
			style={{
				background: "linear-gradient(#000066, #000058, #000036)",
				textAlignLast: "center",
				padding: "7px",
				borderRadius: "25px 5px 0 0",
			}}
		>
			{/* Ingresar Precio */}
			<Input
				id='inputPrecio'
				prefix={<AiFillDollarCircle style={{ marginLeft: "20px" }} />}
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
				onKeyUp={pressKeyPrecio}
				onKeyDown={keyBlock}
				value={precio.precio}
				onChange={handlePrecio}
			/>
			{/* GET VENTAS MOBILE */}
			<GetVentasF3 />
		</div>
	);
}
