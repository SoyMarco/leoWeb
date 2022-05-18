import React, { useState, useContext } from "react";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { CANCELAR_PRODUCTO_APARTDO } from "myGraphql/apartado";
import { MdLocalGroceryStore, MdDelete } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { Table, Result, Col, Row, Button, Popconfirm, Tooltip } from "antd";
import AddProduct from "./AddProduct/AddProduct";
import AuthContext from "context/Auth/AuthContext";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import "./productos.css";

export default function Productos() {
	const {
		dataEncargo,
		pasarAFecha,
		productos,
		refetch,
		loading,
		inputAbono,
		setstateRecord,
		loader,
		setloader,
	} = useContext(ReadEncargoContext);

	const { timeLogout } = useContext(AuthContext);
	const [mutateCANCELAR_PRODUCTO_APARTDO] = useMutation(
		CANCELAR_PRODUCTO_APARTDO
	);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [modalAddProduct, setmodalAddProduct] = useState(false);
	const onSelectChange = () => {
		setselectedRowKeys([]);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const click = (record) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		inputAbono.current.select();
	};
	const borrarEntregarProduct = async (item, borrarEntregar) => {
		if (loader === false) {
			setloader(true);
			let status = true;
			if (item.entregado[0] && item.entregado[0].status) {
				status = !item.entregado[0].status;
			}
			try {
				if (item._id) {
					const { data } = await mutateCANCELAR_PRODUCTO_APARTDO({
						// Parameters
						variables: {
							input: {
								_id: item._id,
								status: status,
								borrarEntregar: borrarEntregar,
							},
						},
					});
					if (data) {
						if (borrarEntregar === "borrar") {
							openNotification("success", `Articulo borrado con exito`);
						} else if (borrarEntregar === "entregar") {
							openNotification("success", `Articulo modificado con exito`);
						}
						refetch();
						setTimeout(() => {
							setloader(false);
						}, 1000);
					}
				}
			} catch (error) {
				setloader(false);
				ErrorConection(timeLogout);
			}
		}
	};

	/* COLUMNAS VENTAS */
	const colProductos = [
		{
			title: "Encargo",
			dataIndex: "nombre",
			key: "nombre",
			ellipsis: true,
			render: (nombre) => (
				<Tooltip placement='top' title={nombre}>
					<h3
						style={{
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						{nombre}
					</h3>
				</Tooltip>
			),
		},
		{
			title: "Talla",
			dataIndex: "talla",
			key: "talla",
			ellipsis: true,
			render: (talla) => (
				<Tooltip placement='top' title={talla}>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						{talla}
					</h3>
				</Tooltip>
			),
		},

		{
			title: "Color",
			dataIndex: "color",
			key: "color",
			ellipsis: true,
			render: (color) => (
				<Tooltip placement='top' title={color}>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						{color}
					</h3>
				</Tooltip>
			),
		},

		{
			title: "Genero",
			dataIndex: "genero",
			key: "genero",
			ellipsis: true,
			render: (genero) => (
				<Tooltip placement='top' title={genero}>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						{genero}
					</h3>
				</Tooltip>
			),
		},

		{
			title: "Modelo",
			dataIndex: "modelo",
			key: "modelo",
			ellipsis: true,
			render: (modelo) => (
				<Tooltip placement='top' title={modelo}>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						{modelo}
					</h3>
				</Tooltip>
			),
		},
		{
			title: "Fecha",
			dataIndex: "createAt",
			key: "createAt",
			sorter: (a, b) => b.createAt - a.createAt,
			defaultSortOrder: "ascend",
			// width: "80px",
			render: (createAt, record) => (
				<Tooltip
					placement='top'
					title={
						record?.entregado[0]?.status === true
							? `${pasarAFecha(
									record?.entregado[0]?.fecha,
									"LLLL"
							  )} por ${record?.entregado[0]?.vendedor.toUpperCase()}`
							: `${pasarAFecha(
									createAt,
									"LLLL"
							  )}  por ${record.vendedor.toUpperCase()}`
					}
				>
					<h1
						style={{
							textAlignLast: "center",
							// fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						{record?.entregado[0]?.status === true
							? `${pasarAFecha(record?.entregado[0]?.fecha, "ll")}`
							: `${pasarAFecha(createAt, "ll")}`}
					</h1>
				</Tooltip>
			),
		},

		{
			title: "Delete",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (_totalArticulo, record) => (
				<Tooltip placement='right' title='Borrar producto'>
					<Row justify='center'>
						<Popconfirm
							title='¿Deseas eliminar?'
							onConfirm={() => borrarEntregarProduct(record, "borrar")}
						>
							<Button
								loading={loader}
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
			<Col xs={24} sm={24} md={14}>
				<Table
					id='tableEncargos'
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
								Encargos: {productos.length}
							</h1>
						</Row>
					)}
					columns={colProductos}
					dataSource={productos}
					pagination={false}
					bordered
					loading={loading}
					scroll={{ y: 210 }}
					style={{
						height: "280px",
						borderRadius: "10px",
						boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
						margin: "10px",
					}}
					rowSelection={rowSelection}
					size='small'
					onRow={(record) => {
						return {
							onClick: () => {
								click(record);
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
								subTitle='Apartado sin productos'
							/>
						),
					}}
				/>
			</Col>

			{modalAddProduct && (
				<AddProduct
					setmodalAddProduct={setmodalAddProduct}
					modalAddProduct={modalAddProduct}
					refetch={refetch}
					dataEncargo={dataEncargo}
				/>
			)}
		</>
	);
}
