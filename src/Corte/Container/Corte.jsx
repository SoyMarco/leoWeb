import React, { useState } from "react";
import "./corte.css";
import { FaCashRegister } from "react-icons/fa";
import { Table, Tooltip, Button, Result, Form, Row, Modal } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { MdDelete } from "react-icons/md";

import "./corte.css";

const Corte = ({ modalCorte, handleModalCorte }) => {
	const [form] = Form.useForm();
	const [listaCompras, setlistaCompras] = useState([]);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [stateRecord, setstateRecord] = useState(null);
	const [precio, setprecio] = useState({
		precio: null,
	});
	const onSelectChange = (selectedRowKeys) => {
		setselectedRowKeys([]);
		// setselectedRowKeys(selectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const selectInputPrecio = () => {
		setprecio({
			precio: null,
		});
		document.querySelector("#inputPrecio").select();
	};
	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		selectInputPrecio();
		// addArticulo(record, rowIndex);
	};

	/* VENTAS */
	const colVentas = [
		{
			title: "Folio",
			dataIndex: "key",
			key: "key",
			sorter: (a, b) => b.key - a.key,
			defaultSortOrder: "ascend",
			width: "60px",
		},
		{
			title: "Hora",
			dataIndex: "nombre",
			key: "nombre",
			width: "90px",
		},
		{
			title: "Efectivo",
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
			title: "Tajeta",
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
						{cantidad}
					</h3>
				</Row>
			),
		},
		{
			title: "A cuenta",
			dataIndex: "apartado",
			key: "apartado",
			ellipsis: {
				showTitle: false,
			},
			width: "90px",
			render: (address) => (
				<Tooltip placement="topLeft" title={address}>
					{address}
				</Tooltip>
			),
		},
		{
			title: "Total",
			dataIndex: "refApartado",
			key: "refApartado",
			ellipsis: {
				showTitle: false,
			},
			width: "90px",
			render: (address) => (
				<Tooltip placement="topLeft" title={address}>
					{address}
				</Tooltip>
			),
		},
		{
			title: "Opciones",
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
	];

	/* PRODUCTOS */
	const colProductos = [
		{
			title: "Nombre",
			dataIndex: "key",
			key: "key",
			sorter: (a, b) => b.key - a.key,
			defaultSortOrder: "ascend",
			width: "60px",
		},
		{
			title: "Precio",
			dataIndex: "nombre",
			key: "nombre",
			width: "90px",
		},
		{
			title: "Cantidad",
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
			title: "Total",
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
						{cantidad}
					</h3>
				</Row>
			),
		},
	];

	/* TOTALES */
	const colTotales = [
		{
			title: "Inicio Caja",
			dataIndex: "key",
			key: "key",
			sorter: (a, b) => b.key - a.key,
			defaultSortOrder: "ascend",
			width: "60px",
		},
		{
			title: "Entradas Salidas",
			dataIndex: "nombre",
			key: "nombre",
			width: "90px",
		},
		{
			title: "Efectivo",
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
			title: "Tajeta",
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
						{cantidad}
					</h3>
				</Row>
			),
		},
		{
			title: "A cuenta",
			dataIndex: "apartado",
			key: "apartado",
			ellipsis: {
				showTitle: false,
			},
			width: "90px",
			render: (address) => (
				<Tooltip placement="topLeft" title={address}>
					{address}
				</Tooltip>
			),
		},
		{
			title: "VENTA TOTAL",
			dataIndex: "refApartado",
			key: "refApartado",
			ellipsis: {
				showTitle: false,
			},
			width: "90px",
			render: (address) => (
				<Tooltip placement="topLeft" title={address}>
					{address}
				</Tooltip>
			),
		},
		{
			title: "Fin caja",
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
	];
	return (
		<Form form={form} component={false}>
			<Table
				columns={colVentas}
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
				size="small"
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
							subTitle="Agrega productos"
						/>
					),
				}}
			/>

			{/* PRODUCTOS */}
			<Table
				columns={colProductos}
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
				size="small"
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
							subTitle="Agrega productos"
						/>
					),
				}}
			/>

			{/* TOTALES */}
			<Table
				columns={colTotales}
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
				size="small"
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
							subTitle="Agrega productos"
						/>
					),
				}}
			/>
		</Form>
	);
};

export default Corte;
