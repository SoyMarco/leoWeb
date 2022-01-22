import React, { useState, useEffect, useContext } from "react";

import { MdLocalGroceryStore } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import Imprimir from "./Imprimir/Imprimir";
import AuthContext from "context/Auth/AuthContext";

import moment from "moment";
import {
	Table,
	Result,
	Col,
	Divider,
	Row,
	Tooltip,
	Button,
	Switch,
} from "antd";
export default function Ventas({
	loading,
	getVentasDia,
	refetch,
	setstateRecord,
	loader,
	setloader,
	stateRecord,
}) {
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const { auth } = useContext(AuthContext);

	const [imprimir, setimprimir] = useState(false);
	const onSelectChange = () => {
		setselectedRowKeys([]);
	};
	useEffect(() => {
		let numArray = getVentasDia.length - 1;
		let lastFolio = getVentasDia[numArray]?.key;
		setselectedRowKeys([lastFolio]);
		setstateRecord(getVentasDia[numArray]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getVentasDia]);

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
	};
	const pasarAFecha = (item) => {
		let fecha = moment.unix(item / 1000).format("LTS");
		return fecha;
	};

	/* COLUMNAS VENTAS */
	const colVentas = [
		{
			title: "Folio",
			dataIndex: "key",
			key: "key",
			sorter: (a, b) => b.key - a.key,
			defaultSortOrder: "ascend",
			width: "70px",
		},
		{
			title: "Hora",
			dataIndex: "createAt",
			key: "createAt",
			render: (createAt) => <h1>{pasarAFecha(createAt)}</h1>,
		},
		{
			title: "Efectivo",
			dataIndex: "efectivo",
			key: "efectivo",
			ellipsis: true,
			render: (efectivo) => (
				<h3
					style={{
						textAlignLast: "right",
						// fontWeight: "revert",
						// fontSize: "large",
					}}
				>
					${efectivo}
				</h3>
			),
		},
		{
			title: "Tajeta",
			dataIndex: "tarjeta",
			key: "tarjeta",
			render: (tarjeta, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							// fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						${tarjeta}
					</h3>
				</Row>
			),
		},
		{
			title: "A cuenta",
			dataIndex: "aCuenta",
			key: "aCuenta",
			ellipsis: {
				showTitle: false,
			},
			render: (aCuenta) => (
				<h3
					style={{
						textAlignLast: "right",
						// fontWeight: "revert",
						// fontSize: "large",
					}}
				>
					${aCuenta}
				</h3>
			),
		},
		{
			title: "Total",
			dataIndex: "total",
			key: "total",
			ellipsis: {
				showTitle: false,
			},
			render: (total, record) => (
				<Tooltip placement='topRight' title={total}>
					<h3
						style={
							record?.productos[0]?.apartado > 0
								? {
										textAlignLast: "right",
										fontWeight: "revert",
										fontSize: "large",
										color: "blue",
								  }
								: {
										textAlignLast: "right",
										fontWeight: "revert",
										fontSize: "large",
										color: "green",
								  }
						}
					>
						${total}
					</h3>
				</Tooltip>
			),
		},
		{
			title: "Print",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (totalArticulo, record) => (
				<Row justify='center'>
					<Tooltip
						placement='left'
						title={
							record?.productos[0]?.apartado > 0
								? "Abre el apartado para Reimprimir"
								: "Reimprimir"
						}
					>
						<Button
							// disabled={record?.productos[0]?.apartado > 0 ? true : false}
							icon={<AiFillPrinter style={{ fontSize: "25px" }} />}
							shape='circle'
							style={
								record?.productos[0]?.apartado > 0
									? { color: "blue" }
									: { color: "limegreen" }
							}
						/>
					</Tooltip>
				</Row>
			),
		},
		{
			title: "Activo",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (totalArticulo, record) => (
				<Row justify='center'>
					<Tooltip
						placement='right'
						title={
							record?.productos[0]?.apartado > 0 && record.cancelado === false
								? "Abre el apartado para borrar"
								: record?.productos[0]?.apartado > 0 &&
								  record.cancelado === true
								? "No se puede activar, se borró el Abono vinculado"
								: record.cancelado === true
								? "Desactivado"
								: "Activo"
						}
					>
						{/* <Popconfirm
							disabled={
								record?.productos[0]?.apartado > 0 && record.cancelado === true
									? true
									: false
							}
							title='¿Cancelar Venta?'
							onConfirm={() =>
								record?.productos[0]?.apartado > 0
									? window.open(
											`${UrlFrontend}apartado/${record?.productos[0]?.apartado}`
									  )
									: cancelVenta(record)
							}
						> */}
						<Switch
							disabled={
								record?.productos[0]?.apartado > 0 && record.cancelado === true
									? true
									: false
							}
							loading={loader}
							checked={!record.cancelado}
							size='small'
							style={
								record.cancelado
									? { background: "red", marginTop: "5px" }
									: record?.productos[0]?.apartado > 0
									? { background: "blue", marginTop: "5px" }
									: { background: "limegreen", marginTop: "5px" }
							}
							// onClick={() =>
							// 	record?.productos[0]?.apartado > 0
							// 		? window.open(
							// 				`${UrlFrontend}apartado/${record?.productos[0]?.apartado}`
							// 		  )
							// 		: cancelVenta(record)
							// }
						/>
						{/* </Popconfirm> */}
					</Tooltip>
				</Row>
			),
		},
	];

	return (
		<>
			{imprimir ? (
				<Imprimir
					imprimir={imprimir}
					setimprimir={setimprimir}
					stateRecord={stateRecord}
					auth={auth}
				/>
			) : null}
			<Col xs={24} sm={24} md={16}>
				<Divider orientation='left' style={{ marginTop: 0 }}>
					Ventas
				</Divider>
				<Table
					columns={colVentas}
					dataSource={getVentasDia}
					pagination={false}
					bordered
					loading={loading}
					scroll={{ y: 250 }}
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
		</>
	);
}
