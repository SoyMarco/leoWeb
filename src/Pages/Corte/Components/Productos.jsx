import React, { useEffect, useState } from "react";
import { Table, Result, Col, Divider, Row, Tooltip } from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default function Productos({ stateRecord, loading }) {
	const [listaCompras, setlistaCompras] = useState([]);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [productos, setproductos] = useState([]);
	const [precio, setprecio] = useState({
		precio: null,
	});
	useEffect(() => {
		if (stateRecord) {
			let { productos } = stateRecord;
			let listaProductos = productos.map((item) => {
				return { ...item, key: item.idArray };
			});
			console.log("stateRecord", listaProductos);
			setproductos(listaProductos);
		}
	}, [stateRecord]);

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
		// setstateRecord(record);
		// addArticulo(record, rowIndex);
	};

	/* COLUMNAS PRODUCTOS */
	const colProductos = [
		{
			title: "ID",
			dataIndex: "key",
			key: "key",
			width: "35px",
		},
		{
			title: "Nombre",
			dataIndex: "nombre",
			key: "nombre",
			width: "70px",
			render: (nombre) => (
				<Tooltip placement="topLeft" title={nombre}>
					{nombre}
				</Tooltip>
			),
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
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						x{cantidad}
					</h3>
				</Row>
			),
		},
		{
			title: "Total",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			render: (totalArticulo, record) => (
				<Row justify="space-around">
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						${totalArticulo}
					</h3>
				</Row>
			),
		},
	];

	return (
		<>
			<Col xs={24} sm={24} md={8}>
				<Divider orientation="left">Productos</Divider>
				{/* PRODUCTOS */}
				<Table
					columns={colProductos}
					dataSource={productos}
					pagination={false}
					loading={loading}
					bordered
					scroll={{ y: 250 }}
					// rowSelection={rowSelection}
					size="small"
					style={{
						height: "300px",
						borderRadius: "10px",
						boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
						margin: "10px",
					}}
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
								subTitle="Selecciona una venta"
							/>
						),
					}}
				/>
			</Col>
		</>
	);
}