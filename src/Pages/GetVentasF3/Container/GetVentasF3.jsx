import React, { useEffect, useContext, useState } from "react";
import { GET_ALL_F3, CANCEL_F3 } from "myGraphql/f3";
import { useQuery, useMutation } from "@apollo/client";
import { Drawer, Table, Tooltip, Result, Button, Popconfirm } from "antd";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { Link } from "react-router-dom";
import "./f3.css";
import ShopListContext from "context/Shopping/ShopListContext";
import ErrorConection from "Utils/ErrorConection";
import AuthContext from "context/Auth/AuthContext";
import { ShoppingOutlined } from "@ant-design/icons";

export default function GetVentasF3() {
	const { timeLogout } = useContext(AuthContext);
	const {
		DrawerF3Visible,
		setDrawerF3Visible,
		addProductShopList,
		eliminarProductoF3,
	} = useContext(ShopListContext);

	const {
		data,
		error: errorAllF3,
		refetch: refetchAllF3,
		startPolling,
		stopPolling,
	} = useQuery(GET_ALL_F3);

	const [mutateCANCEL_F3] = useMutation(CANCEL_F3);

	if (errorAllF3) {
		console.log("ERROR GetVentasF3", errorAllF3);
	}

	const [loader, setloader] = useState(false);
	const [dataTable, setdataTable] = useState([]);

	useEffect(() => {
		if (DrawerF3Visible === true) {
			refetchAllF3();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [DrawerF3Visible]);

	useEffect(() => {
		if (data?.getAllF3) {
			setdataTable(data?.getAllF3);
		}
	}, [data]);
	useEffect(() => {
		if (dataTable.length === 0) {
			setDrawerF3Visible(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataTable]);

	useEffect(() => {
		startPolling(300000);
		return () => {
			stopPolling();
		};
	}, [startPolling, stopPolling]);

	const onClose = () => {
		setDrawerF3Visible(!DrawerF3Visible);
	};
	const cancelF3 = async (record) => {
		if (loader === false) {
			setloader(true);
			try {
				const { data: dataCancelF3 } = await mutateCANCEL_F3({
					variables: {
						input: {
							id: record._id,
						},
					},
				});
				if (dataCancelF3) {
					eliminarProductoF3(record);
					setdataTable(dataCancelF3?.cancelF3);
					refetchAllF3();
					setloader(false);
				}
			} catch (error) {
				setloader(false);
				ErrorConection(timeLogout);
			}
		}
	};
	// Columnas de tabla
	const columns = [
		{
			title: "Apartado",
			dataIndex: "apartado",
			key: "apartado",
			ellipsis: {
				showTitle: false,
			},

			render: (apartado) =>
				apartado > 0 && (
					<Link
						to={{
							pathname: `/apartado/${apartado}`,
						}}
					>
						<h3
							style={{
								textAlignLast: "center",
								fontWeight: "revert",
								fontSize: "large",
								color: "#1890ff",
							}}
						>
							{apartado}
						</h3>
					</Link>
				),
		},
		{
			title: "Nombre",
			dataIndex: "nombre",
			key: "nombre",
			//
			ellipsis: {
				showTitle: false,
			},
			render: (nombre) =>
				nombre !== "Articulo" ? (
					<Tooltip placement='topLeft' title={nombre}>
						<h3
							style={{
								fontWeight: "revert",
								fontSize: "large",
							}}
						>
							{nombre}
						</h3>
					</Tooltip>
				) : (
					<p>{nombre}</p>
				),
		},
		{
			title: "Total",
			dataIndex: "totalArticulo",
			key: "totalArticulo",

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
		{
			title: "Borrar",
			dataIndex: "key",
			key: "key",
			render: (key, record) => (
				<div style={{ textAlignLast: "center" }}>
					<Popconfirm
						disabled={loader}
						title='¿Seguro? Se borrará para siempre'
						onConfirm={() => cancelF3(record)}
					>
						<Button
							icon={<MdDelete className='btnBorrar' size='25px' disabled />}
							danger
							ghost
							loading={loader}
						></Button>
					</Popconfirm>
				</div>
			),
		},
		{
			title: "Agregar",
			dataIndex: "key",
			key: "key",
			render: (key, record) => (
				<div style={{ textAlignLast: "center" }}>
					<Button
						icon={<MdLocalGroceryStore className='btnCarrito' size='30px' />}
						type='primary'
						ghost
						size='large'
						loading={loader}
						onClick={() => addToShop(key, record)}
					/>
				</div>
			),
		},
	];
	const addToShop = (key, record) => {
		addProductShopList({
			nombre: record.nombre,
			precio: record.precio,
			apartado: record.apartado,
			refApartado: record.refApartado,
			idF3: record._id,
		});
	};
	return (
		<Drawer
			title={
				<>
					<h2 className='tituloDrawer'>
						Ventas con F3
						<ShoppingOutlined
							style={{
								fontSize: "30px",
								color: "darkBlue",
								marginLeft: "30px",
							}}
						/>
					</h2>
				</>
			}
			placement='right'
			onClose={onClose}
			visible={DrawerF3Visible && dataTable.length}
			className='DrawerF3'
		>
			<Table
				columns={columns}
				dataSource={dataTable}
				pagination={false}
				bordered
				style={{
					borderRadius: "10px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					margin: "3px",
				}}
				size='small'
				locale={{
					emptyText: (
						<Result
							icon={
								<MdLocalGroceryStore
									style={{ color: "darkBlue", fontSize: "xxx-large" }}
								/>
							}
							subTitle='Agrega productos'
						/>
					),
				}}
			/>
		</Drawer>
	);
}
