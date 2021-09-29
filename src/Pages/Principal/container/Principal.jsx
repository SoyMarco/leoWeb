/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, Table, Tooltip, Input, Button, Result, Form, Row } from "antd";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { keyBlock } from "Utils";
import { useLocation } from "react-router-dom";
import { UrlFrontend } from "config/apollo";
import { useApolloClient } from "@apollo/client";
import { VENTA_F3 } from "graphql/venta";
import { FIRST_LOGIN } from "graphql/user";
import Cobrar from "../Components/Cobrar/Cobrar";
import BarraMayorVenta from "../Components/BarraMayorVenta/BarraMayorVenta";
import "./principal.css";

function Principal() {
	const client = useApolloClient();
	const history = useHistory();
	let firstLogin = client.readQuery({
		query: FIRST_LOGIN,
	});
	if (firstLogin?.firstLogin?.screenWidth > 600) {
		history.push("/caja");
		client.writeQuery({
			query: FIRST_LOGIN,
			data: { firstLogin: null },
		});
	}
	const Location = useLocation();
	const [titleWeb, settitleWeb] = useState("Leo Web");
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
	/* Cambiar titulo de pagina */
	useEffect(() => {
		if (Location.pathname === "/") {
			settitleWeb(`CUENTA: $${totalTotal}`);
		} else {
			let title = Location.pathname;
			title = title.toUpperCase();
			title = title.replace(/^./, "");
			settitleWeb(title);
		}
	}, [Location, totalTotal]);
	useEffect(() => {
		var detectorPantalla = window.screen.width;
		if (detectorPantalla < 600) {
			history.push(`mobile/corte`);
		}
		selectInputPrecio();

		// Venta F3
		const ventaF3 = client.readQuery({
			query: VENTA_F3,
		});
		if (ventaF3) {
			let nuevaLista = [...listaCompras];
			let idArray = idArticulo;
			for (let i = 0; i < ventaF3?.ventaF3.length; i++) {
				const element = ventaF3?.ventaF3[i];

				let {
					// aCuenta,
					// efectivo,
					folio,
					// notas,
					// pagoCon,
					// productos,
					referencia,
					// tarjeta,
					total,
				} = element;

				nuevaLista.push({
					key: idArray + 1,
					nombre: "APARTADO",
					precio: Math.round(total * 100) / 100,
					cantidad: 1,
					apartado: folio,
					refApartado: referencia,
					totalArticulo: Math.round(total * 100) / 100,
				});
				idArray = idArray + 1;
			}
			setidArticulo(idArray);
			setlistaCompras(nuevaLista);
		}
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
		console.log(record, rowIndex);
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		selectInputPrecio();
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
					// setselectedRowKeys([selectedRowKeys[0] - 1]);
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
			window.open(UrlFrontend);
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

	// Columnas de tabla
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
				<Row justify='space-around'>
					<Button
						type='primary'
						shape='circle'
						icon={<MinusOutlined />}
						size='small'
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
						type='primary'
						shape='circle'
						icon={<PlusOutlined />}
						size='small'
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
				<Tooltip placement='topLeft' title={address}>
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
				<Tooltip placement='topLeft' title={address}>
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
						shape='circle'
						icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
						// size="large"
						onClick={() => eliminarProducto(record)}
					></Button>
				</div>
			),
		},
	];

	return (
		<>
			<title>{titleWeb}</title>

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
						{totalProductos ? `Productos: ${totalProductos}` : null}
					</h1>,
					<></>,
					<h1
						style={{
							color: "green",
							fontSize: "65px",
							fontWeight: "bold",
							marginTop: "-20px",
						}}
						onClick={() => pressEnter}
					>
						{totalProductos ? `$ ${totalTotal}` : null}
					</h1>,
				]}
			>
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
						// onMouseOver={() => document.querySelector("#inputPrecio").select()}
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
											style={{ color: "darkBlue", fontSize: "xxx-large" }}
										/>
									}
									// status="500"
									subTitle='Agrega productos'
								/>
							),
						}}
					/>
				</Form>
			</Card>
			<BarraMayorVenta modalCobrar={modalCobrar} totalTotal={totalTotal} />
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
