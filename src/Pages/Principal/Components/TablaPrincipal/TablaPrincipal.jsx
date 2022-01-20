import React, { useContext } from "react";
import { Table, Tooltip, Button, Result, Row } from "antd";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ShopListContext from "context/Shopping/ShopListContext";
import { Link } from "react-router-dom";

export default function TablaPrincipal({ setstateRecord }) {
	const {
		eliminarProducto,
		shopList,
		addOneShopList,
		removeOneShopList,
		selectedRowKeys,
		setselectedRowKeys,
	} = useContext(ShopListContext);

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
		// selectInputPrecio
		document.querySelector("#inputPrecio").select();
	};
	const addArticulo = (record) => {
		if (shopList.length > 0 && record.apartado === 0) {
			addOneShopList(record.key);
		}
	};
	const removeArticulo = (record) => {
		if (shopList.length > 0) {
			removeOneShopList(record);
		}
	};
	// Columnas de tabla
	const columns = [
		{
			title: "",
			dataIndex: "key",
			// key: "key",
			sorter: (a, b) => b.key - a.key,
			defaultSortOrder: "ascend",
			width: "0px",
			render: () => "",
		},

		{
			title: "Apartado",
			dataIndex: "apartado",
			key: "apartado",
			ellipsis: {
				showTitle: false,
			},
			width: "100px",
			render: (apartado) =>
				apartado > 0 && (
					<Link
						to={{
							pathname: `/apartado/${apartado}`,
						}}
					>
						<h3
							style={{
								textAlignLast: "center",
								fontWeight: "revert",
								fontSize: "large",
								color: "#1890ff",
							}}
						>
							{apartado}
						</h3>
					</Link>
				),
		},
		{
			title: "Nombre",
			dataIndex: "nombre",
			key: "nombre",
			// width: "100px",
			ellipsis: {
				showTitle: false,
			},
			render: (nombre) =>
				nombre !== "Articulo" ? (
					<Tooltip placement='topLeft' title={nombre}>
						<h3
							style={{
								fontWeight: "revert",
								fontSize: "large",
							}}
						>
							{nombre}
						</h3>
					</Tooltip>
				) : (
					<p>{nombre}</p>
				),
		},
		{
			title: "Precio por pieza",
			dataIndex: "precio",
			key: "precio",
			ellipsis: true,
			width: "150px",
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
			width: "200px",
			render: (cantidad, record) => (
				<Row justify='space-around'>
					<Button
						type='primary'
						shape='circle'
						ghost
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
						ghost
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
			width: "150px",
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
			width: "85px",
			render: (key, record) => (
				<div style={{ textAlignLast: "center" }}>
					<Button
						danger
						style={{ borderRadius: "10px" }}
						ghost
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
			dataSource={shopList}
			pagination={false}
			bordered
			scroll={{ y: 300 }}
			style={{
				height: "330px",
				borderRadius: "10px",
				boxShadow: "10px 6px 20px 5px #8b8b8b, -6px 0px 20px #ffffff",
				margin: "5px 10px",
				background: "#f0f2f5",
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
