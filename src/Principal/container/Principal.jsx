/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, Table, Tooltip, Input, Button, Result, Form, Row } from "antd";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { SmileOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Cobrar from "../Components/Cobrar/Cobrar";
import { keyBlock } from "../../Utils";
import "./principal.css";

function Principal() {
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [precio, setprecio] = useState({
		precio: null,
	});
	const [form] = Form.useForm();
	const [idArticulo, setidArticulo] = useState(0);
	const [listaCompras, setlistaCompras] = useState([]);
	const [totalTotal, settotalTotal] = useState(0);
	const [totalProductos, settotalProductos] = useState(0);
	const [stateRecord, setstateRecord] = useState(null);
	const initialState = () => {
		setmodalCobrar(false);
		setselectedRowKeys(0);
		setprecio({
			precio: null,
		});
		setidArticulo(0);
		setlistaCompras([]);
		settotalTotal(0);
		settotalProductos(0);
		setstateRecord(null);
	};
	useEffect(() => {
		selectInputPrecio();
	}, []);

	useEffect(() => {
		selectLastRow();
	}, [listaCompras.length]);

	useEffect(() => {
		if (modalCobrar === false) {
			document.querySelector("#inputPrecio").select();
		}
	}, [modalCobrar]);

	useEffect(() => {
		// selectLastRow();
		let sum = 0;
		let sumProd = 0;
		for (let i = 0; i < listaCompras.length; i++) {
			sum += listaCompras[i].totalArticulo;
			sumProd += listaCompras[i].cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);
	}, [listaCompras]);

	useEffect(() => {
		setstateRecord({ key: selectedRowKeys[0] });
	}, [selectedRowKeys]);

	const onSelectChange = (selectedRowKeys) => {
		setselectedRowKeys([]);
		// setselectedRowKeys(selectedRowKeys);
	};

	const selectInputPrecio = () => {
		setprecio({
			precio: null,
		});
		document.querySelector("#inputPrecio").select();
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		selectInputPrecio();
		// addArticulo(record, rowIndex);
	};

	const pressKeyPrecio = (e) => {
		if (e.keyCode === 13) {
			pressEnter();
		}
		if (e.keyCode === 123) {
			pressEnter();
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
		if (e.keyCode === 38) {
			if (listaCompras.length > 1) {
				let max = listaCompras.length;
				if (selectedRowKeys[0] < max) {
					setselectedRowKeys([selectedRowKeys[0] + 1]);
				}
			}
		}
		if (e.keyCode === 40) {
			if (listaCompras.length > 1) {
				if (selectedRowKeys[0] > 1) {
					setselectedRowKeys([selectedRowKeys[0] - 1]);
				}
			}
		}
	};
	const handlePrecio = (e) => {
		setprecio({
			precio: e.target.value,
		});
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
			setlistaCompras(listaCompras.filter((item) => item.key !== key));
			selectLastRow();
		} else if (item.key > 0) {
			let key = item.key;
			setlistaCompras(listaCompras.filter((item) => item.key !== key));
			selectLastRow();
		}
		// this.focusPrecio();
	};
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
					refApartado: 0,
					totalArticulo: Math.round(precio.precio * 100) / 100,
				},
			]);
			setprecio({ precio: null });
			// 	this.dialog = 0;
			setidArticulo(idArticulo + 1);

			// 	this.unaPrueba();
			// } else if (!this.precio && this.cantidadAtirulos > 0) {
			// 	this.abrirCobrar();
			// } else {
			// 	this.precio = "";
		} else if (listaCompras.length > 0) {
			setmodalCobrar(true);
		}
	};

	const addArticulo = (record) => {
		if (listaCompras.length > 0) {
			const currentShopList = [...listaCompras];
			const shopItem = currentShopList.find((item) => item.key === record.key);
			shopItem.cantidad = shopItem.cantidad + 1;
			shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
			const newShopList = [...currentShopList];
			setlistaCompras(newShopList);
		}
	};
	const removeArticulo = (record) => {
		if (listaCompras.length > 0) {
			const currentShopList = [...listaCompras];
			const shopItem = currentShopList.find((item) => item.key === record.key);

			if (shopItem.cantidad > 1) {
				shopItem.cantidad = shopItem.cantidad - 1;
				shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
				const newShopList = [...currentShopList];
				setlistaCompras(newShopList);
			} else if (shopItem.cantidad === 1) {
				eliminarProducto(record);
			}
		}
	};
	const columns = [
		{
			title: "ID",
			dataIndex: "key",
			key: "key",
			sorter: (a, b) => b.key - a.key,
			defaultSortOrder: "ascend",
			width: "60px",
		},
		{
			title: "Producto",
			dataIndex: "nombre",
			key: "nombre",
			width: "90px",
		},
		{
			title: "Precio",
			dataIndex: "precio",
			key: "precio",
			ellipsis: true,
			render: (precio) => (
				<h3
					style={{
						textAlignLast: "right",
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					${precio}
				</h3>
			),
		},
		{
			title: "Cantidad",
			dataIndex: "cantidad",
			key: "cantidad",
			render: (cantidad, record) => (
				<Row justify="space-around">
					<Button
						type="primary"
						shape="circle"
						icon={<MinusOutlined />}
						size="small"
						onClick={() => removeArticulo(record)}
					></Button>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						{cantidad}
					</h3>
					<Button
						type="primary"
						shape="circle"
						icon={<PlusOutlined />}
						size="small"
						onClick={() => addArticulo(record)}
					></Button>
				</Row>
			),
		},
		{
			title: "Apartado",
			dataIndex: "apartado",
			key: "apartado",
			ellipsis: {
				showTitle: false,
			},
			width: "90px",
			render: (address) => (
				<Tooltip placement="topLeft" title={address}>
					{address}
				</Tooltip>
			),
		},
		{
			title: "Referencia",
			dataIndex: "refApartado",
			key: "refApartado",
			ellipsis: {
				showTitle: false,
			},
			width: "90px",
			render: (address) => (
				<Tooltip placement="topLeft" title={address}>
					{address}
				</Tooltip>
			),
		},
		{
			title: "Total",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: {
				showTitle: false,
			},
			render: (totalArticulo, record) => (
				<h3
					style={{
						textAlignLast: "right",
						color: "green",
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					${totalArticulo}
				</h3>
			),
		},
		{
			title: "Borrar",
			dataIndex: "key",
			key: "key",
			width: "60px",
			render: (key, record) => (
				<div style={{ textAlignLast: "center" }}>
					<Button
						shape="circle"
						icon={<MdDelete style={{ color: "#c5221f" }} size="25px" />}
						// size="large"
						onClick={() => eliminarProducto(record)}
					></Button>
				</div>
			),
		},
	];

	return (
		<>
			<Card
				actions={[
					<h1
						style={{
							color: "darkblue",
							fontSize: "xx-large",
							fontWeight: "bold",
							marginTop: "-5px",
						}}
					>
						Productos: {totalProductos ?? 0}
					</h1>,
					<></>,
					<h1
						style={{
							color: "green",
							fontSize: "xxx-large",
							fontWeight: "bold",
							marginTop: "-20px",
						}}
						onClick={pressEnter}
					>
						${totalTotal}
					</h1>,
				]}
			>
				<div
					style={{
						background: "linear-gradient(#0000a6, #000066)",
						textAlignLast: "center",
						padding: "7px",
						borderRadius: "25px 5px 0 0",
					}}
				>
					{/* Ingresar Precio */}
					<Input
						id="inputPrecio"
						prefix={<AiFillDollarCircle />}
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
				</div>
				<Form form={form} component={false}>
					<Table
						columns={columns}
						dataSource={listaCompras}
						pagination={false}
						bordered
						scroll={{ y: 300 }}
						style={{
							height: "330px",
							borderRadius: "10px",
							boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
							margin: "10px",
						}}
						rowSelection={rowSelection}
						size="small"
						onRow={(record, rowIndex) => {
							return {
								onClick: (e) => {
									click(record, rowIndex);
								},
							};
						}}
						locale={{
							emptyText: (
								<Result
									icon={<SmileOutlined />}
									// status="500"
									subTitle="Agrega productos"
								/>
							),
						}}
					/>
				</Form>
			</Card>
			{modalCobrar ? (
				<Cobrar
					modalCobrar={modalCobrar}
					setmodalCobrar={setmodalCobrar}
					totalTotal={totalTotal}
					listaCompras={listaCompras}
					initialState={initialState}
				></Cobrar>
			) : null}
		</>
	);
}

export default Principal;
// idArray: idArticulo + 1,
// 					nombre: "Articulo",
// 					precio: Math.round(precio.precio * 100) / 100,
// 					cantidad: 1,
// 					apartado: 0,
// 					refApartado: 0,
// 					totalArticulo: 0,
