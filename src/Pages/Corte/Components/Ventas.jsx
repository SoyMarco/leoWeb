import React, { useState, useEffect } from "react";
import { BORRAR_EDITAR_ABONO, GET_PRODUCTOS_FOLIO } from "graphql/apartado";
import ImprimirApartadoCorte from "./ImprimirApartado/ImprimirApartadoCorte";
import { openNotification } from "../../../Utils/openNotification";
import { CANCELAR_VENTA } from "../../../graphql/venta";
import { useMutation, useQuery } from "@apollo/client";
import { MdLocalGroceryStore } from "react-icons/md";
import ErrorConection from "Utils/ErrorConection";
import { AiFillPrinter } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";
import Imprimir from "./Imprimir/Imprimir";
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
	getVentasDia,
	refetch,
	setstateRecord,
	loader,
	setloader,
	stateRecord,
}) {
	const [imprimirApartado, setimprimirApartado] = useState(0);
	let {
		data: dataGetApartado,
		loading: loadGetApartado,
		refetch: refetchGetApartado,
	} = useQuery(GET_PRODUCTOS_FOLIO, {
		variables: { folio: imprimirApartado },
		notifyOnNetworkStatusChange: true,
	});
	useEffect(() => {
		if (imprimirApartado) {
			refetchGetApartado();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imprimirApartado]);
	const [mutateCANCELAR_VENTA] = useMutation(CANCELAR_VENTA);
	const [mutateBORRAR_EDITAR_ABONO] = useMutation(BORRAR_EDITAR_ABONO);

	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [dataVenta, setdataVenta] = useState({});
	const { auth, logout } = useAuth();
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
			ErrorConection(logout);
		}
	};
	const printApartado = (record) => {
		setdataVenta(record);
		setimprimirApartado(record?.productos[0]?.apartado);
	};
	const borrarAbono = async (record, borrarEditar) => {
		setloader(true);
		try {
			if (record?.productos[0]?.refApartado) {
				let { data } = await mutateBORRAR_EDITAR_ABONO({
					// Parameters
					variables: {
						input: {
							// _id: record.productos[0]._id,
							abono: 0,
							borrarEditar: borrarEditar,
							idVenta: record.id,
							statusVenta: true,
						},
					},
				});
				if (data) {
					openNotification("success", `Abono borrado`);
					setloader(false);
					refetch();
				}
			}
		} catch (error) {
			setloader(false);
			ErrorConection(logout);
			console.log("error", error);
		}
	};
	const tooltipStatusAbono = (record) => {
		let title = "";
		if (record?.productos[0]?.apartado > 0 && record.cancelado === false) {
			title = "Abono activo";
		} else if (
			record?.productos[0]?.apartado > 0 &&
			record.cancelado === true
		) {
			title = "No se puede activar, se borró el Abono vinculado";
		} else if (record.cancelado === true) {
			title = "Desactivada";
		} else {
			title = "Activa";
		}

		return title;
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
			render: (folio, record) => (
				<h4
					style={{
						color: record?.productos[0]?.apartado > 0 ? "darkblue" : "green",
					}}
				>
					{folio}
				</h4>
			),
		},
		{
			title: "Hora",
			dataIndex: "createAt",
			key: "createAt",
			width: "60px",
			ellipsis: true,
			render: (createAt, record) => (
				<h4
					style={{
						color: record?.productos[0]?.apartado > 0 ? "darkblue" : "green",
					}}
				>
					{pasarAFecha(createAt)}
				</h4>
			),
		},
		{
			title: "Efectivo",
			dataIndex: "efectivo",
			key: "efectivo",
			width: "70px",
			ellipsis: true,
			render: (efectivo, record) => (
				<h3
					style={{
						textAlignLast: "right",
						color: record?.productos[0]?.apartado > 0 ? "darkblue" : "green",
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
			width: "70px",
			ellipsis: true,
			render: (tarjeta, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							color: record?.productos[0]?.apartado > 0 ? "darkblue" : "green",
						}}
					>
						${tarjeta}
					</h3>
				</Row>
			),
		},
		{
			title: "aCuenta",
			dataIndex: "aCuenta",
			key: "aCuenta",
			width: "70px",
			ellipsis: true,
			render: (aCuenta, record) => (
				<h3
					style={{
						textAlignLast: "right",
						color: record?.productos[0]?.apartado > 0 ? "darkblue" : "green",
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
			width: "90px",
			ellipsis: true,
			render: (total, record) => (
				<Tooltip placement='topRight' title={total}>
					<h3
						style={{
							textAlignLast: "right",
							fontWeight: "revert",
							fontSize: "large",
							color: record?.productos[0]?.apartado > 0 ? "darkblue" : "green",
						}}
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
								? "Reimprime el apartado"
								: "Reimprimir"
						}
					>
						<Button
							disabled={loadGetApartado}
							loading={loadGetApartado}
							icon={<AiFillPrinter style={{ fontSize: "25px" }} />}
							shape='circle'
							style={{
								color:
									record?.productos[0]?.apartado > 0 ? "blue" : "limegreen",
							}}
							onClick={() =>
								record?.productos[0]?.apartado > 0
									? printApartado(record)
									: setimprimir(true)
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
					<Tooltip placement='right' title={() => tooltipStatusAbono(record)}>
						{record?.productos[0]?.apartado > 0 ? (
							// Switch para APARTADOS
							<Popconfirm
								title='Si borras este abono no se podrá recuperar'
								onConfirm={() => borrarAbono(record, "borrar")}
								placement='topRight'
								disabled={
									record?.productos[0]?.apartado > 0 &&
									record?.cancelado === true
								}
							>
								<Switch
									disabled={
										record?.productos[0]?.apartado > 0 &&
										record?.cancelado === true
									}
									loading={loader || loadGetApartado}
									checked={!record.cancelado}
									size='small'
									style={
										record.cancelado
											? { background: "red", marginTop: "5px" }
											: record?.productos[0]?.apartado > 0
											? { background: "blue", marginTop: "5px" }
											: { background: "limegreen", marginTop: "5px" }
									}
								/>
							</Popconfirm>
						) : (
							// Switch para VENTAS
							<Switch
								// disabled={record.cancelado === true ? true : false}
								loading={loader || loadGetApartado}
								checked={!record.cancelado}
								size='small'
								style={{
									background: record.cancelado ? "red" : "limegreen",
									marginTop: "5px",
								}}
								onClick={() => cancelVenta(record)}
							/>
						)}
					</Tooltip>
				</Row>
			),
		},
	];

	return (
		<>
			<Col xs={24} sm={24} md={24}>
				{imprimir ? (
					<Imprimir
						imprimir={imprimir}
						setimprimir={setimprimir}
						stateRecord={stateRecord}
						auth={auth}
					/>
				) : null}
				{dataGetApartado?.getProductosFolio[0]?.folio > 1 ? (
					<ImprimirApartadoCorte
						imprimirApartado={imprimirApartado}
						setimprimirApartado={setimprimirApartado}
						dataApartado={dataGetApartado?.getProductosFolio[0]}
						dinero={dataVenta}
						auth={auth}
					/>
				) : null}
			</Col>
			<Col xs={24} sm={24} md={15}>
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
						margin: "0 10px 10px 0",
					}}
					rowSelection={rowSelection}
					size='small'
					onRow={(record, rowIndex) => {
						return {
							onClick: (e) => {
								click(record, rowIndex);
							},
							onMouseEnter: (event) => {
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
