import React, { useEffect, useState } from "react";
import {
	Table,
	Result,
	Col,
	Divider,
	Row,
	Tooltip,
	Popconfirm,
	Button,
	Switch,
} from "antd";
import { AiFillPrinter } from "react-icons/ai";

import { SmileOutlined } from "@ant-design/icons";
import moment from "moment";
export default function Abonos({ abonos, loading, loader, setloader }) {
	const [selectedRowKeys, setselectedRowKeys] = useState(0);

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
	const pasarAFecha = (item) => {
		let fecha = moment.unix(item / 1000).format("L");
		return fecha;
	};
	/* COLUMNAS ABONOS */
	const colAbonos = [
		{
			title: "ID",
			dataIndex: "_id",
			key: "_id",
			width: "0px",
			ellipsis: true,
		},
		{
			title: "Vendedor",
			dataIndex: "vendedor",
			key: "vendedor",
			ellipsis: true,
			render: (vendedor) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{vendedor}
				</h3>
			),
		},
		{
			title: "Fecha",
			dataIndex: "createAt",
			key: "createAt",
			width: "100px",
			sorter: (a, b) => b._id - a._id,
			defaultSortOrder: "ascend",
			render: (createAt) => <h1>{pasarAFecha(createAt)}</h1>,
		},

		{
			title: "Abono",
			dataIndex: "abono",
			key: "abono",
			width: "90px",
			render: (abono, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							// fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						${abono}
					</h3>
				</Row>
			),
		},
		// {
		// 	title: "Print",
		// 	dataIndex: "totalArticulo",
		// 	key: "totalArticulo",
		// 	ellipsis: {
		// 		showTitle: false,
		// 	},
		// 	width: "60px",
		// 	render: (totalArticulo, record) => (
		// 		<Row justify='center'>
		// 			<Popconfirm
		// 				title='¿Deseas reimprimir?'
		// 				onConfirm={() => console.log(record)}
		// 			>
		// 				<Button
		// 					icon={<AiFillPrinter style={{ fontSize: "25px" }} />}
		// 					shape='circle'
		// 					style={{ color: "blue" }}
		// 				/>
		// 			</Popconfirm>
		// 		</Row>
		// 	),
		// },
		{
			title: "Activo",
			dataIndex: "idArray",
			key: "idArray",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (idArray, record) => (
				<Row justify='center'>
					<Popconfirm
						title='¿Cancelar Venta?'
						onConfirm={() => /* cancelVenta(record) */ console.log(record)}
					>
						<Switch
							loading={loader}
							checked={record.cancelado}
							size='small'
							style={
								record.cancelado.status === true
									? { background: "limegreen", marginTop: "5px" }
									: { background: "red", marginTop: "5px" }
							}
						/>
					</Popconfirm>
				</Row>
			),
		},
	];

	return (
		<>
			<Col xs={24} sm={24} md={10}>
				<Divider orientation='left'>Abonos</Divider>
				{/* PRODUCTOS */}
				<Table
					columns={colAbonos}
					dataSource={abonos}
					pagination={false}
					loading={loading}
					bordered
					scroll={{ y: 300 }}
					// rowSelection={rowSelection}
					size='small'
					style={{
						height: "400px",
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
								subTitle='Selecciona un apartado'
							/>
						),
					}}
				/>
			</Col>
		</>
	);
}
