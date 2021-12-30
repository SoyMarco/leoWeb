import React from "react";
import { Table, Tooltip, Button, Result, Row } from "antd";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

export default function TablaPrincipal({
	listaCompras,
	removeArticulo,
	addArticulo,
	eliminarProducto,
	selectInputPrecio,
	setselectedRowKeys,
	setstateRecord,
	selectedRowKeys,
}) {
	const onSelectChange = () => {
		setselectedRowKeys([]);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		selectInputPrecio();
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
			render: (precioRender) => (
				<h3
					style={{
						textAlignLast: "right",
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					${precioRender}
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
			render: (apartado) => (
				<Tooltip placement='topLeft' title={apartado}>
					{apartado}
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
			width: "70px",
			render: (key, record) => (
				<div style={{ textAlignLast: "center" }}>
					<Button
						shape='circle'
						icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
						onClick={() => eliminarProducto(record)}
					></Button>
				</div>
			),
		},
	];

	return (
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
						subTitle='Agrega productos'
					/>
				),
			}}
		/>
	);
}
