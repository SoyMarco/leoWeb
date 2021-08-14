import React, { useEffect, useState } from "react";
import { openNotification, errorConection } from "../../Utils/openNotification";
import { CANCELAR_VENTA } from "../../graphql/venta";
import { MdLocalGroceryStore } from "react-icons/md";
import { GoFileSymlinkDirectory } from "react-icons/go";
import { AiFillPrinter } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import Imprimir from "./Imprimir/Imprimir";
import useAuth from "../../hooks/useAuth";
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
	Popconfirm,
} from "antd";
export default function Ventas({
	loading,
	getApartados,
	refetch,
	setstateRecord,
	loader,
	setloader,
	stateRecord,
}) {
	const [mutateCANCELAR_VENTA] = useMutation(CANCELAR_VENTA);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const { auth } = useAuth();
	const [imprimir, setimprimir] = useState(false);
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
		setstateRecord(record);
		// addArticulo(record, rowIndex);
	};
	const pasarAFecha = (item) => {
		let fecha = moment.unix(item / 1000).format("ll");
		return fecha;
	};
	const cancelVenta = async (item) => {
		setloader(true);
		try {
			const { data } = await mutateCANCELAR_VENTA({
				variables: {
					input: {
						id: item.id,
						status: item.cancelado,
					},
				},
			});
			if (data) {
				openNotification(
					"success",
					`Venta ${item.cancelado ? "recuperada" : "cancelada"} con exito`
				);
				refetch();
				setloader(false);
			}
		} catch (error) {
			setloader(false);
			errorConection();
		}
	};
	/* COLUMNAS VENTAS */
	const colVentas = [
		{
			title: "Folio",
			dataIndex: "key",
			key: "key",
			sorter: (a, b) => b.key - a.key,
			defaultSortOrder: "ascend",
			width: "90px",
			render: (key) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{key}
				</h3>
			),
		},
		{
			title: "Cliente",
			dataIndex: "cliente",
			key: "cliente",
			ellipsis: true,
			render: (cliente) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{cliente}
				</h3>
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
				<Row justify="space-around">
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
				<Row justify="center">
					<Popconfirm
						title="¿Deseas reimprimir?"
						onConfirm={() => setimprimir(true)}
					>
						<Button
							icon={<AiFillPrinter style={{ fontSize: "25px" }} />}
							shape="circle"
							style={{ color: "blue" }}
						/>
					</Popconfirm>
				</Row>
			),
		},
		{
			title: "Abrir",
			dataIndex: "abrir",
			key: "abrir",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (abrir, record) => (
				<Row justify="center">
					<Popconfirm
						title="¿Deseas reimprimir?"
						onConfirm={() => setimprimir(true)}
					>
						<Button
							icon={<GoFileSymlinkDirectory style={{ fontSize: "25px" }} />}
							shape="circle"
							style={{ color: "blue" }}
						/>
					</Popconfirm>
				</Row>
			),
		},
	];

	return (
		<>
			{imprimir ? (
				<Imprimir imprimir={imprimir} stateRecord={stateRecord} auth={auth} />
			) : null}
			<Col xs={24} sm={24} md={14}>
				<Divider orientation="left">Ventas</Divider>
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
								icon={
									<MdLocalGroceryStore
										style={{ color: "red", fontSize: "xxx-large" }}
									/>
								}
								subTitle="No se encontraron ventas"
							/>
						),
					}}
				/>
			</Col>
		</>
	);
}
