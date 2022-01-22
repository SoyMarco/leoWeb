import React, { useContext } from "react";
import { Row, Tooltip, Switch } from "antd";
import { Link } from "react-router-dom";
import ErrorConection from "Utils/ErrorConection";
import { openNotification } from "Utils/openNotification";
import AuthContext from "context/Auth/AuthContext";
import { CANCELAR_PRODUCTO_VENTA } from "myGraphql/venta";
import { useMutation } from "@apollo/client";

const SchemaProductos = (stateRecord) => {
	const { timeLogout } = useContext(AuthContext);

	const [mutateCANCELAR_PRODUCTO_VENTA, { loading }] = useMutation(
		CANCELAR_PRODUCTO_VENTA
	);
	const cancelarProductoVenta = async (record) => {
		try {
			if (record) {
				let { data } = await mutateCANCELAR_PRODUCTO_VENTA({
					// Parameters
					variables: {
						input: {
							refApartado: record.refApartado,
							apartado: record.apartado,
							idVenta: stateRecord.id,
							idArticulo: record._id,
							status: record.cancelado,
							totalArticulo: record.totalArticulo,
						},
					},
				});
				if (data.cancelProductVenta) {
					openNotification("success", `Venta modificada`);
				}
			}
		} catch (error) {
			ErrorConection(timeLogout);
			console.log("error", error);
		}
	};
	const colorRow = (record) => {
		if (stateRecord.cancelado === true || record.cancelado === true) {
			return "red";
		}

		if (record.apartado > 0) return "darkblue";

		return "green";
	};
	const tooltipStatusAbono = (record) => {
		if (record.cancelado === true) {
			return "Desactivado";
		}
		return "Activado";
	};
	return [
		{
			title: "Apartado",
			dataIndex: "idArray",
			key: "idArray",
			width: "80px",
			ellipsis: true,
			render: (key, record) =>
				record.apartado > 0 && (
					<Link
						to={{
							pathname: `/apartado/${record.apartado}`,
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
							{record.apartado}
						</h3>
					</Link>
				),
		},
		{
			title: "Nombre",
			dataIndex: "nombre",
			key: "nombre",
			// width: "120px",
			ellipsis: true,
			render: (nombre, record) => (
				<Tooltip placement='topLeft' title={nombre}>
					<h3
						style={{
							color: colorRow(record),
							fontWeight: nombre !== "Articulo" ? "revert" : "normal",
							fontSize: "large",
						}}
					>
						{nombre}
					</h3>
				</Tooltip>
			),
		},
		{
			title: "Precio c/u",
			dataIndex: "precio",
			key: "precio",
			ellipsis: true,
			render: (precio, record) => (
				<Tooltip placement='top' title={precio}>
					<h3
						style={{
							textAlignLast: "right",
							fontWeight: "revert",
							fontSize: "large",
							color: colorRow(record),
						}}
					>
						${precio}
					</h3>
				</Tooltip>
			),
		},
		{
			title: "Cantidad",
			dataIndex: "cantidad",
			key: "cantidad",
			ellipsis: true,
			render: (cantidad, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							color: colorRow(record),
						}}
					>
						{cantidad}
					</h3>
				</Row>
			),
		},
		{
			title: "Total",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: true,
			render: (totalArticulo, record) => (
				<Tooltip placement='top' title={totalArticulo}>
					<Row justify='space-around'>
						<h3
							style={{
								textAlignLast: "center",
								fontWeight: "revert",
								fontSize: "large",
								color: colorRow(record),
							}}
						>
							${totalArticulo}
						</h3>
					</Row>
				</Tooltip>
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
						<Switch
							disabled={stateRecord?.cancelado === true}
							loading={loading}
							checked={!record.cancelado}
							size='small'
							style={{
								background: colorRow(record),
								marginTop: "5px",
							}}
							onClick={() => cancelarProductoVenta(record)}
						/>
					</Tooltip>
				</Row>
			),
		},
	];
};
export default SchemaProductos;
