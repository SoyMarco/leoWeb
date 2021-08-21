import React, { useState } from "react";
import { Card, Table, Tooltip, Input, Button, Result, Form, Row } from "antd";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { DollarCircleOutlined } from "@ant-design/icons";
import { GiLargeDress, GiArchiveResearch } from "react-icons/gi";

export default function ProductsAddApartado() {
	const [listaCompras, setlistaCompras] = useState([]);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [stateRecord, setstateRecord] = useState(null);

	const click = (record, rowIndex) => {
		console.log(record);
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		// selectInputPrecio();
		// addArticulo(record, rowIndex);
	};
	const onSelectChange = (selectedRowKeys) => {
		setselectedRowKeys([]);
		// setselectedRowKeys(selectedRowKeys);
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
			setlistaCompras(listaCompras.filter((item) => item.key !== key));
			selectLastRow();
		} else if (item.key > 0) {
			let key = item.key;
			setlistaCompras(listaCompras.filter((item) => item.key !== key));
			selectLastRow();
		}
		// this.focusPrecio();
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
				<Row justify='space-around'>
					<Button
						type='primary'
						shape='circle'
						// icon={<MinusOutlined />}
						size='small'
						// onClick={() => removeArticulo(record)}
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
						// icon={<PlusOutlined />}
						size='small'
						// onClick={() => addArticulo(record)}
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
			<Row
				justify='space-around'
				style={{
					background: "linear-gradient(#0000a6, #000066)",
					textAlignLast: "center",
					padding: "7px",
					borderRadius: "25px 25px 0 0",
				}}
			>
				{/* Ingresar Precio */}
				<Input
					id='inputPrecio'
					// <GiLargeDress style={{ color: "darkblue" }} />
					prefix={<GiLargeDress style={{ marginLeft: "20px" }} />}
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
					// onKeyUp={pressKeyPrecio}
					// onKeyDown={keyBlock}
					// value={precio.precio}
					// onChange={handlePrecio}
				/>
				<Input
					id='inputPrecio'
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
					// onKeyUp={pressKeyPrecio}
					// onKeyDown={keyBlock}
					// value={precio.precio}
					// onChange={handlePrecio}
				/>
			</Row>

			<Table
				columns={columns}
				dataSource={listaCompras}
				pagination={false}
				bordered
				scroll={{ y: 280 }}
				style={{
					height: "300px",
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
