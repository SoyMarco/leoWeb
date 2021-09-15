import React, { useEffect, useState } from "react";
import { Table, Result, Col, Divider, Row, Tooltip } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import moment from "moment";
export default function Productos({ stateRecord, loading }) {
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [productos, setproductos] = useState([]);
	const [abonos, setabonos] = useState([]);
	const [totalProductos, settotalProductos] = useState(0);
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);

	useEffect(() => {
		// selectLastRow();
		let sum = 0;
		let sumProd = 0;
		for (let i = 0; i < productos?.length; i++) {
			sum += productos[i]?.totalArticulo;
			sumProd += productos[i]?.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);

		let sumAbo = 0;
		for (let i = 0; i < abonos?.length; i++) {
			sumAbo += abonos[i]?.abono;
		}
		settotalAbonos(sumAbo);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productos]);

	useEffect(() => {
		if (stateRecord) {
			try {
				let { productos } = stateRecord;
				let listaProductos = productos?.map((item) => {
					return { ...item, key: item.idArray };
				});
				setproductos(listaProductos);
				let { abonos } = stateRecord;
				let listaAbonos = abonos?.map((item2) => {
					return { ...item2, key: item2.idArray };
				});
				setabonos(listaAbonos);
			} catch (error) {
				setproductos([]);
				setabonos(0);
			}
		} else {
			setproductos([]);
			setabonos(0);
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
	const pasarAFecha = (item) => {
		let fecha = moment.unix(item / 1000).format("L");
		return fecha;
	};
	/* COLUMNAS PRODUCTOS */
	const colProductos = [
		{
			title: "ID",
			dataIndex: "key",
			key: "key",
			width: "35px",
			sorter: (a, b) => b.key - a.key,
			defaultSortOrder: "ascend",
		},
		{
			title: "Producto",
			dataIndex: "nombre",
			key: "nombre",
			ellipsis: true,

			render: (nombre) => (
				<Tooltip placement='topLeft' title={nombre}>
					{nombre}
				</Tooltip>
			),
		},
		{
			title: "Fecha",
			dataIndex: "createAt",
			key: "createAt",
			ellipsis: true,
			render: (createAt) => <h1>{pasarAFecha(createAt)}</h1>,
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
				<Row justify='end'>
					<h3
						style={{
							textAlignLast: "end",
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
			<Col xs={24} sm={24} md={10}>
				<Divider orientation='left'>Productos</Divider>
				{/* PRODUCTOS */}
				<Table
					columns={colProductos}
					dataSource={productos}
					pagination={false}
					loading={loading}
					bordered
					scroll={{ y: 300 }}
					rowSelection={rowSelection}
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
					footer={() => (
						<Row justify='space-around'>
							<h1
								style={{
									color: "blue",
									fontSize: "x-large",
									fontWeight: "bold",
									marginTop: "10px",
								}}
							>
								Productos: {totalProductos}
							</h1>
							<h1
								style={{
									color: "green",
									fontSize: "xx-large",
									fontWeight: "bold",
								}}
							>
								Resta ${totalTotal - totalAbonos}
							</h1>
						</Row>
					)}
				/>
			</Col>
		</>
	);
}
