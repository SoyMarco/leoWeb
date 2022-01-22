import React, { useState, useEffect, useContext } from "react";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { CANCELAR_PRODUCTO_APARTDO } from "myGraphql/apartado";
import { MdLocalGroceryStore, MdDelete } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import moment from "moment";
import "moment/locale/es";

import {
	Table,
	Result,
	Col,
	Row,
	Button,
	Popconfirm,
	Switch,
	Tooltip,
} from "antd";
import "./productos.css";
import AddProduct from "./AddProduct/AddProduct";
import AuthContext from "context/Auth/AuthContext";

export default function Productos({
	loading,
	productos,
	refetch,
	setstateRecord,
	loader,
	setloader,
	stateRecord,
	dataApartado,
	totalProductos,
	totalTotal,
	inputAbono,
	initialState,
}) {
	const { timeLogout } = useContext(AuthContext);
	const [mutateCANCELAR_PRODUCTO_APARTDO] = useMutation(
		CANCELAR_PRODUCTO_APARTDO
	);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [modalAddProduct, setmodalAddProduct] = useState(false);
	const onSelectChange = () => {
		setselectedRowKeys([]);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	useEffect(() => {
		if (modalAddProduct === false) inputAbono.current.select();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalAddProduct]);
	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		inputAbono.current.select();
	};
	const pasarAFecha = (item) => {
		moment.locale("es");
		let algo = moment.unix(item / 1000).format("ll");
		console.log(algo);
		return algo;
	};

	const pasarAFechaLLLL = (item) => {
		return moment.unix(item / 1000).format("LLLL");
	};
	const borrarEntregarProduct = async (item, borrarEntregar) => {
		if (loader === false) {
			setloader(true);
			let status = true;
			if (item.entregado[0] && item.entregado[0].status) {
				status = !item.entregado[0].status;
			}
			try {
				if (item._id) {
					const { data } = await mutateCANCELAR_PRODUCTO_APARTDO({
						// Parameters
						variables: {
							input: {
								_id: item._id,
								status: status,
								borrarEntregar: borrarEntregar,
							},
						},
					});
					if (data) {
						if (borrarEntregar === "borrar") {
							openNotification("success", `Articulo borrado con exito`);
						} else if (borrarEntregar === "entregar") {
							openNotification("success", `Articulo modificado con exito`);
						}
						refetch();
						setTimeout(() => {
							setloader(false);
						}, 1000);
					}
				}
			} catch (error) {
				setloader(false);
				ErrorConection(timeLogout);
			}
		}
	};

	/* COLUMNAS VENTAS */
	const colProductos = [
		// {
		// 	title: "ID",
		// 	dataIndex: "idArray",
		// 	key: "idArray",
		// 	width: "24px",
		// 	render: (idArray) => <span></span>,
		// },
		{
			title: "Producto",
			dataIndex: "nombre",
			key: "nombre",

			ellipsis: true,
			render: (nombre) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{nombre}
				</h3>
			),
		},
		{
			title: "Fecha",
			dataIndex: "createAt",
			key: "createAt",
			sorter: (a, b) => b.createAt - a.createAt,
			defaultSortOrder: "ascend",
			// width: "80px",
			render: (createAt, record) => (
				<Tooltip
					placement='top'
					title={
						record?.entregado[0]?.status === true
							? `${pasarAFechaLLLL(
									record?.entregado[0]?.fecha
							  )} por ${record?.entregado[0]?.vendedor.toUpperCase()}`
							: `${pasarAFechaLLLL(
									createAt
							  )}  por ${record.vendedor.toUpperCase()}`
					}
				>
					<h1
						style={{
							textAlignLast: "center",
							// fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						{record?.entregado[0]?.status === true
							? `${pasarAFecha(record?.entregado[0]?.fecha)}`
							: `${pasarAFecha(createAt)}`}
					</h1>
				</Tooltip>
			),
		},

		{
			title: "Precio",
			dataIndex: "precio",
			key: "precio",
			sorter: (a, b) => b.precio - a.precio,
			// width: "90px",
			render: (precio, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						${precio}
					</h3>
				</Row>
			),
		},
		{
			title: "Borrar",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (totalArticulo, record) => (
				<Tooltip placement='right' title='Borrar producto'>
					<Row justify='center'>
						<Popconfirm
							title='¿Deseas eliminar?'
							onConfirm={() => borrarEntregarProduct(record, "borrar")}
						>
							<Button
								loading={loader}
								shape='circle'
								icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
							></Button>
						</Popconfirm>
					</Row>
				</Tooltip>
			),
		},
		{
			title: "Entregar",
			dataIndex: "idArray",
			key: "idArray",
			ellipsis: {
				showTitle: false,
			},
			width: "70px",
			render: (idArray, record) => (
				<Tooltip
					placement='right'
					title={
						record?.entregado[0]?.status !== true
							? "Entregar producto"
							: "Producto Entregado"
					}
				>
					<Row justify='center'>
						<Switch
							loading={loader}
							checked={record?.entregado[0]?.status === false}
							size='small'
							style={
								record?.entregado[0]?.status
									? { background: "orange", marginTop: "5px" }
									: { background: "limegreen", marginTop: "5px" }
							}
							onClick={() => borrarEntregarProduct(record, "entregar")}
						/>
					</Row>
				</Tooltip>
			),
		},
	];

	return (
		<>
			<Col xs={24} sm={24} md={14}>
				<Table
					id='tableApartado'
					title={() => (
						<Row justify='space-between'>
							<h1
								style={{
									color: "white",
									fontSize: "large",
									fontWeight: "revert",
									margin: "10px 0 0 10px",
								}}
							>
								Productos: {productos.length}
							</h1>
							<Tooltip placement='top' title='Agregar producto'>
								<Button
									shape='round'
									style={{
										background: "linear-gradient(#2196F3,#0000E6)",
										marginTop: 5,
										marginRight: 10,
										color: "white",
										border: 0,
										// fontSize: "large",
										fontWeight: "bold",
									}}
									onClick={() => setmodalAddProduct(true)}
								>
									<FaShoppingCart
										style={{ fontSize: "large", marginRight: 5 }}
									/>
									Agregar
								</Button>
							</Tooltip>
						</Row>
					)}
					columns={colProductos}
					dataSource={productos}
					pagination={false}
					bordered
					loading={loading}
					scroll={{ y: 210 }}
					style={{
						height: "380px",
						borderRadius: "10px",
						boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
						margin: "10px",
						background: "#f0f2f5",
					}}
					rowSelection={rowSelection}
					size='small'
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
								icon={
									<MdLocalGroceryStore
										style={{ color: "red", fontSize: "xxx-large" }}
									/>
								}
								subTitle='Apartado sin productos'
							/>
						),
					}}
					footer={() => (
						<Row justify='end'>
							<h1 className='totalProductoApartado'>Productos ${totalTotal}</h1>
						</Row>
					)}
				/>
			</Col>

			{modalAddProduct && (
				<AddProduct
					setmodalAddProduct={setmodalAddProduct}
					modalAddProduct={modalAddProduct}
					refetch={refetch}
					initialState={initialState}
					dataApartado={dataApartado}
				/>
			)}
		</>
	);
}
