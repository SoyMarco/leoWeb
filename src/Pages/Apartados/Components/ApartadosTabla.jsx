import React, { useState } from "react";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import ImprimirApartados from "../Components/Imprimir/ImprimirApartado";
import AuthContext from "context/Auth/AuthContext";
import moment from "moment";
import { Table, Result, Col, Divider, Row, Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

export default function ApartadosTabla({
	loading,
	getApartados,
	refetch,
	setstateRecord,
	loader,
	setloader,
	stateRecord,
}) {
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const { auth } = useContext(AuthContext);
	const [imprimir, setimprimir] = useState(false);
	let navigate = useNavigate();

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
		document.querySelector("#inputSearch").select();
	};
	const pasarAFecha = (item) => {
		let fecha = moment.unix(item / 1000).format("ll");
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
			render: (key) => (
				<Tooltip placement='topLeft' title={key}>
					<h3
						style={{
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						{key}
					</h3>
				</Tooltip>
			),
		},
		{
			title: "Cliente",
			dataIndex: "cliente",
			key: "cliente",
			ellipsis: true,
			render: (cliente) => (
				<Tooltip placement='topLeft' title={cliente}>
					<h3
						style={{
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						{cliente}
					</h3>
				</Tooltip>
			),
		},
		{
			title: "Vence",
			dataIndex: "vence",
			key: "vence",
			width: "100px",
			render: (vence) => <h1>{pasarAFecha(vence)}</h1>,
		},

		{
			title: "Vendedor",
			dataIndex: "vendedor",
			key: "vendedor",
			width: "90px",
			render: (vendedor, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							// fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						{vendedor}
					</h3>
				</Row>
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
					<Button
						icon={<AiFillPrinter style={{ fontSize: "25px" }} />}
						shape='circle'
						style={{ color: "blue" }}
						onClick={() => setimprimir(true)}
					/>
				</Row>
			),
		},
		{
			title: "Edit",
			dataIndex: "Edit",
			key: "Edit",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (Edit, record) => (
				<Row justify='center'>
					<Button
						icon={<FaRegEdit style={{ fontSize: "25px" }} />}
						shape='circle'
						style={{ color: "blue" }}
						onClick={() => navigate(`/apartado/${record.folio}`)}
					/>
				</Row>
			),
		},
	];

	return (
		<>
			{imprimir === true ? (
				<ImprimirApartados
					imprimir={imprimir}
					setimprimir={setimprimir}
					dataApartado={stateRecord}
					auth={auth}
				/>
			) : null}
			<Col xs={24} sm={24} md={14}>
				<Divider orientation='left'>Apartados</Divider>
				<Table
					columns={colVentas}
					dataSource={getApartados}
					pagination={false}
					bordered
					loading={loading}
					scroll={{ y: 350 }}
					style={{
						height: "400px",
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
								subTitle='No se encontraron apartados'
							/>
						),
					}}
				/>
			</Col>
		</>
	);
}
