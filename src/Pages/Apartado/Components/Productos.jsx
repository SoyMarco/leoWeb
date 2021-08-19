import React, { useEffect, useState } from "react";
import { openNotification, ErrorConection } from "Utils/openNotification";
import { CANCELAR_VENTA } from "graphql/venta";
import {
	GET_PRODUCTOS_FOLIO,
	CANCELAR_APARTADO,
	EDIT_VENCE_APARTADO,
	CANCELAR_PRODUCTO_APARTDO,
} from "graphql/apartado";
import {
	MdLocalGroceryStore,
	MdDelete,
	MdAddShoppingCart,
} from "react-icons/md";
import { FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import { GiLargeDress } from "react-icons/gi";
import { useMutation } from "@apollo/client";
import Imprimir from "./Imprimir/Imprimir";
import useAuth from "hooks/useAuth";
import moment from "moment";
import {
	Table,
	Result,
	Col,
	Divider,
	Row,
	Button,
	Popconfirm,
	Switch,
	Tooltip,
	Modal,
	Input,
	Form,
} from "antd";
import "./productos.css";
export default function Productos({
	loading,
	productos,
	refetch,
	setstateRecord,
	loader,
	setloader,
	stateRecord,
}) {
	const [mutateCANCELAR_PRODUCTO_APARTDO] = useMutation(
		CANCELAR_PRODUCTO_APARTDO
	);
	const [nombre, setnombre] = useState("");
	const [precio, setprecio] = useState(0);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [modalAddProduct, setmodalAddProduct] = useState(true);
	const { auth } = useAuth();
	const [imprimir, setimprimir] = useState(false);
	const onSelectChange = (selectedRowKeys) => {
		setselectedRowKeys([]);
		// setselectedRowKeys(selectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		// addArticulo(record, rowIndex);
	};
	const pasarAFecha = (item) => {
		let fecha = moment.unix(item / 1000).format("l");
		return fecha;
	};
	const pasarAFechaLL = (item) => {
		let fecha = moment.unix(item / 1000).format("LL");
		return fecha;
	};

	const borrarEntregarProduct = async (item, borrarEntregar) => {
		console.log(item);
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
					setloader(false);
				}
			}
		} catch (error) {
			setloader(false);
			ErrorConection();
		}
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			agregarProducto();
		}
	};
	const agregarProducto = () => {
		// 	if (precio > 0 && nombre) {
		// 		borrarEntregar = "editar";
		// 		updateProducto();
		// 	} else if (!nombre && precio > 0) {
		// 		document.querySelector("#addProductNombre").select();
		// 	} else if (nombre && !precio) {
		// 		document.querySelector("#addProductPrecio").select();
		// 	} else {
		// 	}
	};

	// const updateProducto = async () => {
	// 	console.log(item);
	// 	setloader(true);
	// 	let status = true;
	// 	if (item.entregado[0] && item.entregado[0].status) {
	// 		status = !item.entregado[0].status;
	// 	}
	// 	try {
	// 		if (item._id) {
	// 			const { data } = await mutateCANCELAR_PRODUCTO_APARTDO({
	// 				// Parameters
	// 				variables: {
	// 					input: {
	// 						_id: item._id,
	// 						status: status,
	// 						borrarEntregar: borrarEntregar,
	// 					},
	// 				},
	// 			});
	// 			if (data) {
	// 				if (borrarEntregar === "borrar") {
	// 					openNotification("success", `Articulo borrado con exito`);
	// 				} else if (borrarEntregar === "entregar") {
	// 					openNotification("success", `Articulo modificado con exito`);
	// 				}
	// 				refetch();
	// 				setloader(false);
	// 			}
	// 		}
	// 	} catch (error) {
	// 		setloader(false);
	// 		ErrorConection();
	// 	}
	// };
	/* COLUMNAS VENTAS */
	const colProductos = [
		{
			title: "ID",
			dataIndex: "idArray",
			key: "idArray",
			sorter: (a, b) => b.idArray - a.idArray,
			defaultSortOrder: "ascend",
			width: "24px",
			// render: (idArray) => <span>{idArray}</span>,
		},
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
			// width: "80px",
			render: (createAt, record) => (
				<h1
					style={{
						textAlignLast: "center",
						// fontWeight: "revert",
						// fontSize: "x-large",
					}}
				>
					{record?.entregado[0]?.status === true
						? `${pasarAFechaLL(
								createAt
						  )} por ${record?.entregado[0]?.vendedor.toUpperCase()}`
						: `${pasarAFecha(createAt)}`}
				</h1>
			),
		},

		{
			title: "Precio",
			dataIndex: "precio",
			key: "precio",
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
			title: "Delete",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (totalArticulo, record) => (
				<Row justify='center'>
					<Popconfirm
						title='¿Deseas eliminar?'
						onConfirm={() => borrarEntregarProduct(record, "borrar")}
					>
						<Button
							shape='circle'
							icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
						></Button>
					</Popconfirm>
				</Row>
			),
		},
		{
			title: "Status",
			dataIndex: "idArray",
			key: "idArray",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (idArray, record) => (
				<Tooltip
					placement='right'
					title={record?.entregado[0]?.status !== true ? "Activo" : "Entregado"}
				>
					<Row justify='center'>
						<Popconfirm
							title='¿Entregar Venta?'
							onConfirm={() => borrarEntregarProduct(record, "entregar")}
						>
							<Switch
								loading={loader}
								checked={record?.entregado[0]?.status !== true}
								size='small'
								style={
									record?.entregado[0]?.status
										? { background: "orange", marginTop: "5px" }
										: { background: "limegreen", marginTop: "5px" }
								}
							/>
						</Popconfirm>
					</Row>
				</Tooltip>
			),
		},
	];

	return (
		<>
			{imprimir ? (
				<Imprimir imprimir={imprimir} stateRecord={stateRecord} auth={auth} />
			) : null}
			<Col xs={24} sm={24} md={14}>
				<Divider orientation='left'>Productos</Divider>
				<Table
					id='tableApartado'
					title={() => (
						<Row justify='space-between'>
							<h1
								style={{
									color: "white",
									fontSize: "large",
									fontWeight: "revert",
									margin: "10px 0 5px 10px",
								}}
							>
								Productos: {productos.length}
							</h1>
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
								<FaShoppingCart style={{ fontSize: "large", marginRight: 5 }} />
								Agregar
							</Button>
						</Row>
					)}
					columns={colProductos}
					dataSource={productos}
					pagination={false}
					bordered
					loading={loading}
					scroll={{ y: 350 }}
					style={{
						height: "400px",
						borderRadius: "10px",
						boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
						margin: "10px",
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
								subTitle='No se encontraron ventas'
							/>
						),
					}}
				/>
			</Col>
			{modalAddProduct && (
				<Modal
					title='Agregar producto'
					visible={modalAddProduct}
					onOk={() => agregarProducto()}
					onCancel={() => setmodalAddProduct(false)}
				>
					<Form.Item
						label='Articulo'
						name='Articulo'
						key='1'
						rules={[
							{
								required: false,
								message: "Please input your username!",
							},
						]}
						className='labelCobrar'
						id='inputAddProduct'
						onKeyUp={pressKeyEnter}
						onChange={(e) => setnombre(e.target.value)}
					>
						<Input
							id='addProductNombre'
							className='labelAddProducts'
							prefix={<GiLargeDress style={{ color: "gray" }} />}
							// onKeyUp={pressKeyPrecio}
							// onKeyDown={keyBlock}
						/>
					</Form.Item>

					<Form.Item
						label='Precio'
						name='Precio'
						key='1'
						rules={[
							{
								required: false,
								message: "Please input your username!",
							},
						]}
						className='labelCobrar'
						onKeyUp={pressKeyEnter}
						onChange={(e) => setprecio(e.target.value)}
					>
						<Input
							id='addProductPrecio'
							className='labelAddProducts'
							type='number'
							// style={{ borderRadius: 50 }}
							prefix={<FaMoneyBillWave style={{ color: "gray" }} />}
							// onKeyUp={pressKeyPrecio}
							// onKeyDown={keyBlock}
						/>
					</Form.Item>
				</Modal>
			)}
		</>
	);
}
