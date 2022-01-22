import React, { useState, useContext } from "react";
import {
	Table,
	Result,
	Col,
	Row,
	Tooltip,
	Switch,
	Progress,
	Popconfirm,
} from "antd";
import { SmileOutlined } from "@ant-design/icons";
import moment from "moment";
import { BORRAR_EDITAR_ABONO } from "myGraphql/apartado";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import AuthContext from "context/Auth/AuthContext";
import "./productos.css";
export default function Abonos({
	abonos,
	loading,
	loader,
	setloader,
	totalAbonos,
	inputAbono,
	refetch,
	totalTotal,
	abono,
	getApartadoFolio,
}) {
	const { timeLogout } = useContext(AuthContext);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [mutateBORRAR_EDITAR_ABONO] = useMutation(BORRAR_EDITAR_ABONO);

	const onSelectChange = () => {
		setselectedRowKeys([]);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const click = (record, rowIndex) => {
		setselectedRowKeys([record.key]);
		inputAbono.current.select();
	};
	const pasarAFecha = (item) => {
		return moment.unix(item / 1000).format("L");
	};
	const pasarAFechaLLLL = (item) => {
		return moment.unix(item / 1000).format("LLLL");
	};
	const borrarAbono = async (record, borrarEditar) => {
		console.log(record, getApartadoFolio);
		setloader(true);
		try {
			if (record) {
				let { data } = await mutateBORRAR_EDITAR_ABONO({
					// Parameters
					variables: {
						input: {
							abono: record.abono,
							borrarEditar: borrarEditar,
							idVenta: record.idVenta,
							idAbono: record._id,
							idApartado: getApartadoFolio.getProductosFolio.id,
							statusVenta: record.cancel,
						},
					},
				});
				if (data) {
					openNotification("success", `Abono borrado`);
					setloader(false);
				}
			}
		} catch (error) {
			setloader(false);
			ErrorConection(timeLogout);
		}
	};
	const colorRow = (record) => {
		if (record.cancel === true) {
			return "red";
		}

		return "darkgreen";
	};
	const tooltipStatusAbono = (record) => {
		if (record.cancelado === true) {
			return "Desactivado";
		}
		return "Activado";
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
			render: (vendedor, record) => (
				<h3
					style={{
						color: colorRow(record),
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
			sorter: (a, b) => b.createAt - a.createAt,
			defaultSortOrder: "ascend",
			render: (createAt, record) => (
				<Tooltip placement='top' title={`${pasarAFechaLLLL(createAt)}`}>
					<h1 style={{ color: colorRow(record) }}>{pasarAFecha(createAt)}</h1>
				</Tooltip>
			),
		},
		{
			title: "Abonos",
			dataIndex: "abono",
			key: "abono",
			render: (abonoRender, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
							color: colorRow(record),
						}}
					>
						${abonoRender}
					</h3>
				</Row>
			),
		},
		{
			title: "Status",
			dataIndex: "idArray",
			key: "idArray",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (idArray, record) => (
				<Row justify='center'>
					<Tooltip placement='right' title={() => tooltipStatusAbono(record)}>
						<Popconfirm
							disabled={loader || loading}
							title='¿Deseas eliminarlo?'
							onConfirm={() => borrarAbono(record, "borrar")}
						>
							<Switch
								loading={loading}
								checked={!record.cancel}
								size='small'
								style={{
									background: colorRow(record),
									marginTop: "5px",
								}}
								// onClick={() => borrarAbono(record, "borrar")}}
							/>
						</Popconfirm>
					</Tooltip>
				</Row>
			),
		},
	];
	const calculatePorcent = () => {
		let addAbono = 0;
		if (parseInt(abono.abono) > 0) {
			addAbono = parseInt(abono.abono);
		}
		let porcent = 0;
		porcent = ((totalAbonos + addAbono) * 100) / totalTotal ?? 0;

		return porcent;
	};
	return (
		<Col xs={24} sm={24} md={10}>
			{/* PRODUCTOS */}
			<Table
				rowKey={(record) => record._id}
				id='tableApartado'
				title={() => (
					<Row justify='space-between'>
						<h1
							style={{
								color: "white",
								fontSize: "large",
								fontWeight: "revert",
								margin: "10px 0 0 10px",
							}}
						>
							Abonos: {abonos.length}
						</h1>
					</Row>
				)}
				columns={colAbonos}
				dataSource={abonos}
				pagination={false}
				loading={loading}
				bordered
				scroll={{ y: 190 }}
				rowSelection={rowSelection}
				size='small'
				style={{
					height: "380px",
					borderRadius: "10px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					margin: "10px",
					background: "#f0f2f5",
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
					<>
						<Row justify='end'>
							<h1 className='totalAbonosApartado'>Abonos ${totalAbonos}</h1>
						</Row>
						<Row justify='center'>
							<Progress
								strokeColor={
									calculatePorcent() > 100
										? {
												from: "red",
												to: "limegreen",
										  }
										: {
												from: "dodgerblue",
												to: "limegreen",
										  }
								}
								percent={parseInt(calculatePorcent())}
								status='active'
								// style={{ width: "90%" }}
							/>
						</Row>
					</>
				)}
			/>
		</Col>
	);
}
