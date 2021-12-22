import React, { useState, useRef, useEffect } from "react";
import { InputNumber, Row, Table, Result, Button, Layout } from "antd";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import FooterHorizontal from "../Components/Footer";
import Cobrar from "../Components/Cobrar/Cobrar";

export default function Ventas() {
	const { Footer } = Layout;

	const [listaCompras, setlistaCompras] = useState([]);
	const [idArticulo, setidArticulo] = useState(0);
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [totalTotal, settotalTotal] = useState(0);
	const [totalProductos, settotalProductos] = useState(0);
	const [inputVisible, setinputVisible] = useState(false);
	const [precio, setprecio] = useState({
		precio: null,
	});
	const initialState = () => {
		setmodalCobrar(false);
		setprecio({
			precio: null,
		});
		setidArticulo(0);
		setlistaCompras([]);
		settotalTotal(0);
		settotalProductos(0);
	};
	const inputPrecio = useRef();

	useEffect(() => {
		selectInputPrecio();
	}, []);

	useEffect(() => {
		let sum = 0;
		let sumProd = 0;
		for (const compra of listaCompras) {
			sum += compra.totalArticulo;
			sumProd += compra.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);
	}, [listaCompras]);
	const selectInputPrecio = () => {
		setprecio({
			precio: null,
		});
		inputPrecio.current.select();
		setinputVisible(true);
	};

	const eliminarProducto = (item) => {
		let i = listaCompras.indexOf(item);
		if (i !== -1) {
			let key = listaCompras.splice(i, 1);
			setlistaCompras(listaCompras.filter((item2) => item2.key !== key));
		} else if (item.key > 0) {
			let key = item.key;
			setlistaCompras(listaCompras.filter((item2) => item2.key !== key));
		}
		selectInputPrecio();
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
	const pressKeyPrecio = (e) => {
		if (e.keyCode === 13) {
			pressEnter();
		}
	};
	const handlePrecio = (e) => {
		setprecio({
			precio: e,
		});
	};
	const columns = [
		{
			title: "Precio",
			dataIndex: "precio",
			key: "precio",
			ellipsis: true,
			render: (precioR) => (
				<h3
					style={{
						textAlignLast: "right",
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					${precioR}
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
			<Row justify='center'>
				<InputNumber
					ref={inputPrecio}
					type='number'
					style={{
						width: "90%",
						height: "50px",
						margin: "20px 0",
						borderRadius: "50px",
						fontSize: "xx-large",
						textAlignLast: "center",
						fontWeight: "bold",
					}}
					onKeyUp={pressKeyPrecio}
					value={precio.precio}
					onChange={handlePrecio}
					onClick={() => setinputVisible(true)}
				></InputNumber>

				{/* TABLA */}
				<Table
					columns={columns}
					dataSource={listaCompras}
					pagination={false}
					bordered
					// scroll={{ y: 300 }}
					style={{
						// height: "330px",
						borderRadius: "10px",
						boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
						margin: "0 0 100px",
					}}
					// rowSelection={rowSelection}
					size='small'
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
			</Row>
			<Footer
				style={{
					padding: 0,
					// marginTop: "50px",
					width: "100%",
					position: "fixed",
					bottom: 0,
					zIndex: 1,
					// height: "200px",
				}}
			>
				{inputVisible && (
					<FooterHorizontal
						totalProductos={totalProductos}
						totalTotal={totalTotal}
						setinputVisible={setinputVisible}
					/>
				)}
			</Footer>
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
