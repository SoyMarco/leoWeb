import React, { useContext } from "react";
import { Row, Tooltip, Button, Switch } from "antd";
import moment from "moment";
import { AiFillPrinter } from "react-icons/ai";
import ErrorConection from "Utils/ErrorConection";
import { openNotification } from "Utils/openNotification";
import { CANCELAR_VENTA } from "myGraphql/venta";
import { useMutation } from "@apollo/client";
import AuthContext from "context/Auth/AuthContext";

const SchemaVentas = (setimprimir) => {
	const { timeLogout } = useContext(AuthContext);

	const [mutateCANCELAR_VENTA, { loading }] = useMutation(CANCELAR_VENTA);

	const colorRow = (record) => {
		if (record.cancelado === true) {
			return "red";
		}

		for (const item of record?.productos) {
			if (item.apartado > 0) return "darkblue";
		}

		return "green";
	};
	const pasarAFecha = (item) => {
		return moment.unix(item / 1000).format("LTS");
	};
	const cantidadProductos = (record) => {
		if (record?.productos?.length > 0) {
			let numProd = 0;
			for (const item of record?.productos) {
				numProd = numProd + item.cantidad;
			}
			return numProd;
		}
		return 0;
	};
	const tooltipStatusAbono = (record) => {
		if (record.cancelado === true) {
			return "Desactivada";
		}
		return "Activa";
	};
	const cancelVenta = async (item) => {
		console.log("cancelVenta", item);
		if (loading === false) {
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
				}
			} catch (error) {
				ErrorConection(timeLogout);
			}
		}
	};
	return [
		{
			title: "Folio",
			dataIndex: "folio",
			key: "folio",
			sorter: (a, b) => b.folio - a.folio,
			defaultSortOrder: "ascend",
			width: "80px",
			ellipsis: true,
			render: (folio, record) => (
				<h3
					style={{
						textAlignLast: "center",
						fontWeight: "bold",
						color: colorRow(record),
					}}
				>
					{folio}
				</h3>
			),
		},
		{
			title: "Hora",
			dataIndex: "createAt",
			key: "createAt",
			ellipsis: true,
			render: (createAt, record) => (
				<h3
					style={{
						fontWeight: "bold",
						textAlignLast: "center",
						color: colorRow(record),
					}}
				>
					{pasarAFecha(createAt)}
				</h3>
			),
		},
		{
			title: "Efectivo",
			dataIndex: "efectivo",
			key: "efectivo",
			ellipsis: true,
			render: (efectivo, record) => (
				<h3
					style={{
						fontWeight: "bold",
						textAlignLast: "right",
						color: colorRow(record),
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
			ellipsis: true,
			render: (tarjeta, record) => (
				<h3
					style={{
						fontWeight: "bold",
						textAlignLast: "right",
						color: colorRow(record),
					}}
				>
					${tarjeta}
				</h3>
			),
		},
		{
			title: "A cuenta",
			dataIndex: "aCuenta",
			key: "aCuenta",
			ellipsis: true,
			render: (aCuenta, record) => (
				<h3
					style={{
						textAlignLast: "right",
						fontWeight: "bold",
						color: colorRow(record),
					}}
				>
					${aCuenta}
				</h3>
			),
		},
		{
			title: "Cantidad Productos",
			dataIndex: "productos",
			key: "productos",
			ellipsis: true,
			render: (productos, record) => (
				<h3
					style={{
						textAlignLast: "center",
						fontWeight: "bold",
						color: colorRow(record),
					}}
				>
					{cantidadProductos(record)}
				</h3>
			),
		},
		{
			title: "Total",
			dataIndex: "total",
			key: "total",
			ellipsis: true,
			render: (total, record) => (
				<Tooltip placement='topRight' title={total}>
					<h2
						style={{
							textAlignLast: "right",
							fontWeight: "bold",
							fontSize: "x-large",
							color: colorRow(record),
						}}
					>
						${total}
					</h2>
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
			width: "90px",
			render: (totalArticulo, record) => (
				<Row justify='center'>
					<Tooltip placement='left' title={"Reimprimir"}>
						<Button
							loading={loading}
							icon={<AiFillPrinter style={{ fontSize: "30px" }} />}
							ghost
							size='large'
							style={{
								color: colorRow(record),
							}}
							onClick={() => setimprimir(true)}
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
			width: "90px",
			render: (totalArticulo, record) => (
				<Row justify='center'>
					<Tooltip placement='top' title={() => tooltipStatusAbono(record)}>
						<Switch
							loading={loading}
							checked={!record.cancelado}
							size='small'
							style={{
								background: colorRow(record),
								marginTop: "5px",
							}}
							onClick={() => cancelVenta(record)}
						/>
					</Tooltip>
				</Row>
			),
		},
	];
};

export default SchemaVentas;
