import React, { useState, useContext } from "react";
import { Table, Input, Button, Result, Row, AutoComplete } from "antd";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { DollarCircleOutlined } from "@ant-design/icons";
import { keyBlock } from "Utils";
import AuthContext from "context/Auth/AuthContext";

export default function ProductsAddApartado({
	next,
	prev,
	setlistaCompras,
	listaCompras,
	getProductsName,
}) {
	const [idArticulo, setidArticulo] = useState(0);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [nombre, setnombre] = useState("");
	const [precio, setprecio] = useState(null);
	const { auth } = useContext(AuthContext);

	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
	};
	const onSelectChange = () => {
		setselectedRowKeys([]);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const selectLastRow = () => {
		let ultimoArray = listaCompras.length;
		if (ultimoArray) {
			setselectedRowKeys([listaCompras[ultimoArray - 1].key]);
		}
	};
	const eliminarProducto = (item) => {
		let i = listaCompras.indexOf(item);
		if (i !== -1) {
			let key = listaCompras.splice(i, 1);
			setlistaCompras(listaCompras.filter((itemF) => itemF.key !== key));
			selectLastRow();
		} else if (item.key > 0) {
			let key = item.key;
			setlistaCompras(listaCompras.filter((itemF) => itemF.key !== key));
			selectLastRow();
		}
	};
	const addProducto = () => {
		if (precio > 0 && nombre) {
			setlistaCompras([
				...listaCompras,
				{
					key: idArticulo + 1,
					idArray: idArticulo + 1,
					vendedor: auth.name,
					nombre: nombre,
					precio: Math.round(precio * 100) / 100,
					cantidad: 1,
					totalArticulo: Math.round(precio * 100) / 100,
				},
			]);
			setprecio(null);
			setnombre("");
			setidArticulo(idArticulo + 1);
			document.querySelector("#inputNameProduct").select();
			// } else if (!this.precio && this.cantidadAtirulos > 0) {
			// 	this.abrirCobrar();
			// } else {
			// 	this.precio = "";
		}
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			if (precio > 0 && nombre) {
				addProducto();
			} else if (!nombre && precio > 0) {
				document.querySelector("#inputNameProduct").select();
			} else if (nombre && !precio) {
				document.querySelector("#inputPriceProduct").select();
			} else if (listaCompras.length > 0) {
				next();
			}
		}

		if (e.keyCode === 27) {
			prev();
		}
	};
	const columns = [
		// {
		// 	title: "ID",
		// 	dataIndex: "key",
		// 	key: "key",
		// 	sorter: (a, b) => b.key - a.key,
		// 	defaultSortOrder: "ascend",
		// 	width: "60px",
		// },
		{
			title: "Producto",
			dataIndex: "nombre",
			key: "nombre",
			// width: "90px",
			render: (nombreRender) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{nombreRender}
				</h3>
			),
		},
		{
			title: "Precio",
			dataIndex: "precio",
			key: "precio",
			ellipsis: true,
			render: (precioRender) => (
				<h3
					style={{
						textAlignLast: "center",
						fontWeight: "revert",
						fontSize: "large",
						color: "green",
					}}
				>
					${precioRender}
				</h3>
			),
		},

		{
			title: "Borrar",
			dataIndex: "key",
			key: "key",
			width: "90px",
			render: (key, record) => (
				<div style={{ textAlignLast: "center" }}>
					<Button
						shape='circle'
						icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
						// size="large"
						onClick={() => eliminarProducto(record)}
					></Button>
				</div>
			),
		},
	];
	const keyNumber = (e) => {
		if (e.keyCode >= 96 && e.keyCode <= 105) {
			document.querySelector("#inputPriceProduct").select();
		}
	};
	return (
		<>
			<Row
				justify='space-around'
				style={{
					background: "linear-gradient(#0000a6, #000066)",
					textAlignLast: "center",
					padding: "7px",
					borderRadius: "25px 25px 0 0",
				}}
			>
				<AutoComplete
					defaultActiveFirstOption={true}
					id='inputNameProduct'
					autoFocus={true}
					backfill={true}
					size='large'
					onKeyUp={pressKeyEnter}
					onKeyDown={keyNumber}
					style={{
						color: "green",
						fontSize: "large",
						fontWeight: "bold",
						borderRadius: "50px",
						width: "40%",
						padding: "0 0 0 0px",
						border: "0 0 0 0",
					}}
					value={nombre}
					onChange={(e) => setnombre(e.toUpperCase())}
					options={getProductsName}
					placeholder='Ingresa la prenda'
					filterOption={(inputValue, option) =>
						option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}
				/>
				<Input
					id='inputPriceProduct'
					prefix={<DollarCircleOutlined style={{ marginLeft: "20px" }} />}
					style={{
						color: "green",
						// fontSize: 30,
						fontSize: "x-large",
						fontWeight: "bold",
						borderRadius: "50px",
						maxWidth: "40%",
						padding: "0 0 0 0px",
						border: "0 0 0 0",
					}}
					onKeyUp={pressKeyEnter}
					onKeyDown={keyBlock}
					value={precio}
					onChange={(e) => setprecio(e.target.value.toUpperCase())}
				/>
			</Row>

			<Table
				columns={columns}
				dataSource={listaCompras}
				pagination={false}
				bordered
				scroll={{ y: 200 }}
				style={{
					height: "250px",
					borderRadius: "10px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					margin: "10px",
				}}
				rowSelection={rowSelection}
				size='small'
				onRow={(record, rowIndex) => {
					return {
						onClick: () => {
							click(record, rowIndex);
						},
					};
				}}
				locale={{
					emptyText: (
						<Result
							icon={
								<MdLocalGroceryStore
									style={{ color: "blue", fontSize: "xxx-large" }}
								/>
							}
							// status="500"
							subTitle='Agrega productos'
						/>
					),
				}}
			/>
		</>
	);
}
