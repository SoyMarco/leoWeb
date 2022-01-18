// import React, { useEffect, useState } from "react";
// import {
// 	Table,
// 	Result,
// 	Divider,
// 	Row,
// 	Tooltip,
// 	Button,
// 	Modal,
// 	Popconfirm,
// 	Switch,
// } from "antd";
// import { SmileOutlined } from "@ant-design/icons";
// import { UrlFrontend } from "config/apollo";
// import { Link } from "react-router-dom";
// import moment from "moment";

// export default function Productos({
// 	stateRecord,
// 	loading,
// 	modalProductos,
// 	setmodalProductos,
// }) {
// 	const [selectedRowKeys, setselectedRowKeys] = useState(0);
// 	const [dataProductos, setdataProductos] = useState([]);

// 	useEffect(() => {
// 		console.log("stateRecord@@@", stateRecord);
// 		if (stateRecord) {
// 			let { productos } = stateRecord;
// 			let listaProductos = productos.map((item) => {
// 				return { ...item, key: item.idArray };
// 			});
// 			setdataProductos(listaProductos);
// 		}
// 	}, [stateRecord]);

// 	const onSelectChange = () => {
// 		setselectedRowKeys([]);
// 	};
// 	const rowSelection = {
// 		selectedRowKeys,
// 		onChange: onSelectChange,
// 	};

// 	const click = (record, rowIndex) => {
// 		setselectedRowKeys([record.key]);
// 	};
// 	const tooltipStatusAbono = (record) => {
// 		let title = "";
// 		if (record?.apartado > 0 && record.cancelado === false) {
// 			title = "Abono activo";
// 		} else if (record?.apartado > 0 && record.cancelado === true) {
// 			title = "No se puede activar, se borró el Abono vinculado";
// 		} else if (record.cancelado === true) {
// 			title = "Desactivada";
// 		} else {
// 			title = "Activa";
// 		}

// 		return title;
// 	};
// 	const pasarAFechaLLLL = (item) => {
// 		return moment.unix(item / 1000).format("LLLL");
// 	};
// 		const borrarAbono = async (record, borrarEditar) => {
// 			setloader(true);
// 			try {
// 				if (record?.productos[0]?.refApartado) {
// 					let { data } = await mutateBORRAR_EDITAR_ABONO({
// 						// Parameters
// 						variables: {
// 							input: {
// 								// _id: record.productos[0]._id,
// 								abono: 0,
// 								borrarEditar: borrarEditar,
// 								idVenta: record.id,
// 								statusVenta: true,
// 							},
// 						},
// 					});
// 					if (data) {
// 						openNotification("success", `Abono borrado`);
// 						setloader(false);
// 						refetch();
// 					}
// 				}
// 			} catch (error) {
// 				setloader(false);
// 				ErrorConection(timeLogout);
// 				console.log("error", error);
// 			}
// 		};
// 	/* COLUMNAS PRODUCTOS */
// 	const colProductos = [
// 		{
// 			title: "Apartado",
// 			dataIndex: "key",
// 			key: "key",
// 			width: "80px",
// 			ellipsis: true,
// 			render: (key, record) =>
// 				record.apartado > 0 && (
// 					<Link
// 						to={{
// 							pathname: `/apartado/${record.apartado}`,
// 						}}
// 					>
// 						<h3
// 							style={{
// 								textAlignLast: "center",
// 								fontWeight: "revert",
// 								fontSize: "large",
// 								color: "#1890ff",
// 							}}
// 						>
// 							{record.apartado}
// 						</h3>
// 					</Link>
// 				),
// 		},
// 		{
// 			title: "Nombre",
// 			dataIndex: "nombre",
// 			key: "nombre",
// 			// width: "120px",
// 			ellipsis: true,
// 			render: (nombre, record) =>
// 				nombre !== "Articulo" ? (
// 					<Tooltip placement='topLeft' title={nombre}>
// 						<h3
// 							style={{
// 								fontWeight: "revert",
// 								fontSize: "large",
// 							}}
// 						>
// 							{nombre}
// 						</h3>
// 					</Tooltip>
// 				) : (
// 					<p>{nombre}</p>
// 				),
// 		},
// 		{
// 			title: "Precio c/u",
// 			dataIndex: "precio",
// 			key: "precio",
// 			ellipsis: true,
// 			render: (precio) => (
// 				<Tooltip placement='top' title={precio}>
// 					<h3
// 						style={{
// 							textAlignLast: "right",
// 							fontWeight: "revert",
// 							fontSize: "large",
// 						}}
// 					>
// 						${precio}
// 					</h3>
// 				</Tooltip>
// 			),
// 		},
// 		{
// 			title: "Cantidad",
// 			dataIndex: "cantidad",
// 			key: "cantidad",
// 			ellipsis: true,
// 			render: (cantidad, record) => (
// 				<Row justify='space-around'>
// 					<h3
// 						style={{
// 							textAlignLast: "center",
// 							fontWeight: "revert",
// 							// fontSize: "x-large",
// 						}}
// 					>
// 						{cantidad}
// 					</h3>
// 				</Row>
// 			),
// 		},
// 		{
// 			title: "Total",
// 			dataIndex: "totalArticulo",
// 			key: "totalArticulo",
// 			ellipsis: true,
// 			render: (totalArticulo, record) => (
// 				<Tooltip placement='top' title={totalArticulo}>
// 					<Row justify='space-around'>
// 						<h3
// 							style={{
// 								textAlignLast: "center",
// 								fontWeight: "revert",
// 								// fontSize: "x-large",
// 							}}
// 						>
// 							${totalArticulo}
// 						</h3>
// 					</Row>
// 				</Tooltip>
// 			),
// 		},
// 		{
// 			title: "Activo",
// 			dataIndex: "totalArticulo",
// 			key: "totalArticulo",
// 			ellipsis: {
// 				showTitle: false,
// 			},
// 			width: "60px",
// 			render: (totalArticulo, record) => (
// 				<Row justify='center'>
// 					<Tooltip placement='right' title={() => tooltipStatusAbono(record)}>
// 						{record?.apartado > 0 ? (
// 							// Switch para APARTADOS
// 							<Popconfirm
// 								title='Si borras este abono no se podrá recuperar'
// 								placement='topRight'
// 								disabled={record?.apartado > 0 && record?.cancelado === true}
// 							>
// 								<Switch
// 									disabled={record?.apartado > 0 && record?.cancelado === true}
// 									// onConfirm={() => borrarAbono(record, "borrar")}
// 									// loading={loader || loadGetApartado}
// 									checked={!record.cancelado}
// 									size='small'
// 									style={{
// 										background: record.cancelado
// 											? "red"
// 											: record?.apartado > 0
// 											? "blue"
// 											: "limegreen",
// 										marginTop: "5px",
// 									}}
// 								/>
// 							</Popconfirm>
// 						) : (
// 							// Switch para VENTAS
// 							<Switch
// 								// disabled={record.cancelado === true ? true : false}
// 								// loading={loader || loadGetApartado}
// 								checked={!record.cancelado}
// 								size='small'
// 								style={{
// 									background: record.cancelado ? "red" : "limegreen",
// 									marginTop: "5px",
// 								}}
// 								// onClick={() => cancelVenta(record)}
// 							/>
// 						)}
// 					</Tooltip>
// 				</Row>
// 			),
// 		},
// 	];
// 	const btnCancel = () => {
// 		setmodalProductos(false);
// 	};
// 	return (
// 		<Modal
// 			visible={modalProductos}
// 			width={"700px"}
// 			onCancel={() => btnCancel()}
// 			style={{ top: 50 }}
// 			className='ModalCobrarPrincipal'
// 			title={
// 				<>
// 					Productos de la venta: <b>{stateRecord?.folio}</b>
// 				</>
// 			}
// 		>
// 			<h2 style={{ color: "darkblue" }}>
// 				{pasarAFechaLLLL(stateRecord?.createAt)}
// 			</h2>

// 			{/* PRODUCTOS */}
// 			<Table
// 				columns={colProductos}
// 				dataSource={dataProductos}
// 				pagination={false}
// 				loading={loading}
// 				bordered
// 				rowSelection={rowSelection}
// 				size='small'
// 				scroll={{ y: 350 }}
// 				style={{
// 					borderRadius: "15px",
// 					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
// 					marginTop: "10px",
// 				}}
// 				onRow={(record, rowIndex) => {
// 					return {
// 						onClick: (e) => {
// 							click(record, rowIndex);
// 						},
// 					};
// 				}}
// 				locale={{
// 					emptyText: (
// 						<Result
// 							icon={<SmileOutlined />}
// 							// status="500"
// 							subTitle='Selecciona una venta'
// 						/>
// 					),
// 				}}
// 			/>
// 			<Row align='space-around'>
// 				<h1 className='numeroProductos'>
// 					{stateRecord?.productos?.length
// 						? `Productos: ${stateRecord?.productos?.length}`
// 						: null}
// 				</h1>
// 				<h1 className='totalProductos'>
// 					{stateRecord ? `$ ${stateRecord?.total}` : null}
// 				</h1>
// 			</Row>
// 		</Modal>
// 	);
// }
