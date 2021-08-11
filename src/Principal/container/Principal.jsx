import React, { useState, useEffect } from "react";
import {
	Card,
	Table,
	Tooltip,
	Input,
	Button,
	Popconfirm,
	Result,
	Form,
	Row,
} from "antd";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { SmileOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Cobrar from "../Components/Cobrar/Cobrar";
import { keyBlock } from "../../Utils";
import "./principal.css";

function Principal() {
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [selectedRowKeys, setselectedRowKeys] = useState("1");
	const [precio, setprecio] = useState({
		precio: null,
	});
	const [form] = Form.useForm();
	const [idArticulo, setidArticulo] = useState(0);
	const [listaCompras, setlistaCompras] = useState([]);
	const [totalTotal, settotalTotal] = useState(0);
	const [stateRecord, setstateRecord] = useState(null);
	useEffect(() => {
		selectInputPrecio();
	}, []);

	useEffect(() => {
		selectLastRow();
		let sum = 0;
		for (let i = 0; i < listaCompras.length; i++) {
			sum += listaCompras[i].totalArticulo;
		}
		settotalTotal(sum);
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
		console.log(record);
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		// addArticulo(record, rowIndex);
	};

	const pressKeyPrecio = (e) => {
		if (e.keyCode === 13) {
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
			let algo = listaCompras.splice(i, 1);
			setlistaCompras(listaCompras.filter((item) => item.algo !== algo));
		}
		// this.focusPrecio();
		selectLastRow();
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

			// 	console.log(data);
			// 	this.unaPrueba();
			// } else if (!this.precio && this.cantidadAtirulos > 0) {
			// 	this.abrirCobrar();
			// } else {
			// 	this.precio = "";
		} else if (listaCompras.length > 0) {
			setmodalCobrar(!modalCobrar);
		}
	};
	const addArticulo = (record) => {
		console.log("record", record);
		const currentShopList = [...listaCompras];
		const shopItem = currentShopList.find((item) => item.key === record.key);
		shopItem.cantidad = shopItem.cantidad + 1;
		shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
		const newShopList = [...currentShopList];
		setlistaCompras(newShopList);
	};
	const removeArticulo = (record) => {
		const currentShopList = [...listaCompras];
		const shopItem = currentShopList.find((item) => item.key === record.key);
		console.log("shopItem.cantidad ", shopItem.cantidad);
		if (shopItem.cantidad > 1) {
			shopItem.cantidad = shopItem.cantidad - 1;
			shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
			const newShopList = [...currentShopList];
			setlistaCompras(newShopList);
		} else if (shopItem.cantidad === 1) {
			eliminarProducto(record);
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
						"text-align-last": "right",
						"font-weight": "revert",
						"font-size": "large",
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
							"text-align-last": "center",
							"font-weight": "revert",
							// "font-size": "x-large",
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
						"text-align-last": "right",
						color: "green",
						"font-weight": "revert",
						"font-size": "large",
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
				<div style={{ "text-align-last": "center" }}>
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
							"font-size": "xx-large",
							"font-weight": "bold",
							"margin-top": "-5px",
						}}
					>
						Productos: {listaCompras.length ?? 0}
					</h1>,
					<></>,
					<h1
						style={{
							color: "green",
							"font-size": "xxx-large",
							"font-weight": "bold",
							"margin-top": "-20px",
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
						"text-align-last": "center",
						padding: "7px",
						"border-radius": "25px 5px 0 0",
					}}
				>
					{/* Ingresar Precio */}
					<Input
						id="inputPrecio"
						prefix={<AiFillDollarCircle />}
						style={{
							color: "green",
							fontSize: 30,
							"font-size": "x-large",
							"font-weight": "bold",
							"border-radius": "50px",
							"max-width": "60%",
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
							"border-radius": "10px",
							"box-shadow": "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
							margin: "10px",
						}}
						rowSelection={rowSelection}
						size="small"
						onRow={(record, rowIndex) => {
							return {
								onClick: (e) => {
									click(record, rowIndex);
								}, // click row
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

			<Cobrar
				modalCobrar={modalCobrar}
				setmodalCobrar={setmodalCobrar}
				totalTotal={totalTotal}
				listaCompras={listaCompras}
			></Cobrar>
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
