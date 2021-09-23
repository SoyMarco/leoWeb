import React, { useState } from "react";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { Table, Button, Result, Row } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

export default function EncargoTable({ listaProductos, setlistaProductos }) {
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const onSelectChange = (selectedRowKeys) => {
		setselectedRowKeys([]);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const eliminarProducto = (item) => {
		let i = listaProductos.indexOf(item);
		if (i !== -1) {
			let key = listaProductos.splice(i, 1);
			setlistaProductos(listaProductos.filter((item) => item.key !== key));
			selectLastRow();
		} else if (item.key > 0) {
			let key = item.key;
			setlistaProductos(listaProductos.filter((item) => item.key !== key));
			selectLastRow();
		}
		// this.focusPrecio();
	};
	const selectLastRow = () => {
		let ultimoArray = listaProductos.length;
		if (ultimoArray) {
			setselectedRowKeys([listaProductos[ultimoArray - 1].key]);
		}
	};
	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
	};
	const addArticulo = (record) => {
		if (listaProductos.length > 0) {
			const currentShopList = [...listaProductos];
			const shopItem = currentShopList.find((item) => item.key === record.key);
			shopItem.cantidad = shopItem.cantidad + 1;
			// shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
			const newShopList = [...currentShopList];
			setlistaProductos(newShopList);
		}
	};
	const removeArticulo = (record) => {
		if (listaProductos.length > 0) {
			const currentShopList = [...listaProductos];
			const shopItem = currentShopList.find((item) => item.key === record.key);

			if (shopItem.cantidad > 1) {
				shopItem.cantidad = shopItem.cantidad - 1;
				shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
				const newShopList = [...currentShopList];
				setlistaProductos(newShopList);
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
			// width: "90px",
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
			title: "Talla o tamaño",
			dataIndex: "talla",
			key: "talla",
			ellipsis: true,
			render: (talla) => (
				<h3
					style={{
						textAlignLast: "center",
						fontWeight: "revert",
						fontSize: "large",
						color: "green",
					}}
				>
					{talla}
				</h3>
			),
		},
		{
			title: "Color o aroma",
			dataIndex: "color",
			key: "color",
			ellipsis: true,
			render: (color) => (
				<h3
					style={{
						textAlignLast: "center",
						fontWeight: "revert",
						fontSize: "large",
						color: "green",
					}}
				>
					{color}
				</h3>
			),
		},
		{
			title: "Genero",
			dataIndex: "genero",
			key: "genero",
			ellipsis: true,
			render: (genero) => (
				<h3
					style={{
						textAlignLast: "center",
						fontWeight: "revert",
						fontSize: "large",
						color: "green",
					}}
				>
					{genero}
				</h3>
			),
		},
		{
			title: "Modelo",
			dataIndex: "modelo",
			key: "modelo",
			ellipsis: true,
			render: (modelo) => (
				<h3
					style={{
						textAlignLast: "center",
						fontWeight: "revert",
						fontSize: "large",
						color: "green",
					}}
				>
					{modelo}
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
			title: "Borrar",
			dataIndex: "key",
			key: "key",
			width: "90px",
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
			<Table
				columns={columns}
				dataSource={listaProductos}
				pagination={false}
				bordered
				style={{
					// height: "250px",
					borderRadius: "10px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					margin: "0 10px 10px 10px",
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
