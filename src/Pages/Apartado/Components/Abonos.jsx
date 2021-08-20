import React, { useState } from "react";
import { Table, Result, Col, Row, Tooltip, Popconfirm, Button } from "antd";
import { MdDelete } from "react-icons/md";
import { SmileOutlined } from "@ant-design/icons";
import moment from "moment";
import { BORRAR_EDITAR_ABONO } from "graphql/apartado";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";

export default function Abonos({
	abonos,
	loading,
	loader,
	setloader,
	totalAbonos,
	inputAbono,
	refetch,
}) {
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [mutateBORRAR_EDITAR_ABONO] = useMutation(BORRAR_EDITAR_ABONO);
	const { logout, auth } = useAuth();

	const onSelectChange = (selectedRowKeys) => {
		setselectedRowKeys([]);
		// setselectedRowKeys(selectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const click = (record, rowIndex) => {
		console.log(record);
		setselectedRowKeys([record.key]);
		inputAbono.current.select();
		// setstateRecord(record);
		// addArticulo(record, rowIndex);
	};
	const pasarAFecha = (item) => {
		let fecha = moment.unix(item / 1000).format("L");
		return fecha;
	};
	const borrarAbono = async (record, borrarEditar) => {
		setloader(true);

		try {
			if (record._id) {
				let { data } = await mutateBORRAR_EDITAR_ABONO({
					// Parameters
					variables: {
						input: {
							_id: record._id,
							abono: 0,
							borrarEditar: borrarEditar,
						},
					},
				});
				if (data) {
					openNotification("success", `Abono borrado`);
					refetch();
					setloader(false);
				}
			}
		} catch (error) {
			setloader(false);
			ErrorConection(logout);
		}
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
						// fontWeight: "revert",
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
			sorter: (a, b) => b._id - a._id,
			defaultSortOrder: "ascend",
			render: (createAt) => <h1>{pasarAFecha(createAt)}</h1>,
		},

		{
			title: "Abono",
			dataIndex: "abono",
			key: "abono",
			render: (abono, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						${abono}
					</h3>
				</Row>
			),
		},
		{
			title: "Delete",
			dataIndex: "idArray",
			key: "idArray",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (idArray, record) => (
				<Tooltip placement='bottom' title='Borrar abono'>
					<Row justify='center'>
						<Popconfirm
							title='¿Deseas eliminarlo?'
							onConfirm={() => borrarAbono(record, "borrar")}
						>
							<Button
								shape='circle'
								icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
							></Button>
						</Popconfirm>
					</Row>
				</Tooltip>
			),
		},
	];

	return (
		<>
			<Col xs={24} sm={24} md={10}>
				{/* PRODUCTOS */}
				<Table
					id='tableApartado'
					title={() => (
						<Row justify='space-between'>
							<h1
								style={{
									color: "white",
									fontSize: "large",
									fontWeight: "revert",
									margin: "10px 0 5px 10px",
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
					scroll={{ y: 230 }}
					rowSelection={rowSelection}
					size='small'
					style={{
						height: "380px",
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
						<Row justify='end'>
							<h1
								style={{
									color: "green",
									fontSize: "xx-large",
									fontWeight: "revert",
									marginRight: "20px",
								}}
							>
								Abonos ${totalAbonos}
							</h1>
						</Row>
					)}
				/>
			</Col>
		</>
	);
}
