import { useContext } from "react";
import { Row, Tooltip, Button, Switch } from "antd";
import moment from "moment";
import { AiFillPrinter } from "react-icons/ai";
import VentasContext from "Pages/Ventas/Context/context";

const useVentas = () => {
	const { cancelVenta, loadCancelVenta, setimprimir } =
		useContext(VentasContext);

	const colorRow = (record) => {
		if (record.cancelado === true) {
			return "red";
		}

		const typeVenta = record?.referencia?.toLowerCase();
		if (typeVenta === "apartado") return "darkblue";
		if (typeVenta === "encargo") return "#1873b9";

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

	const columnsVentas = [
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
			title: "Tipo Venta",
			dataIndex: "referencia",
			key: "referencia",
			ellipsis: true,
			render: (referencia, record) => {
				return (
					<h3
						style={{
							fontWeight: "bold",
							textAlignLast: "center",
							color: colorRow(record),
						}}
					>
						{referencia ? referencia : "Venta"}
					</h3>
				);
			},
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
			render: (_, record) => (
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
			render: (_totalArticulo, record) => (
				<Row justify='center'>
					<Tooltip placement='left' title={"Reimprimir"}>
						<Button
							loading={loadCancelVenta}
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
			render: (_totalArticulo, record) => (
				<Row justify='center'>
					<Tooltip placement='top' title={() => tooltipStatusAbono(record)}>
						<Switch
							loading={loadCancelVenta}
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
	return { columnsVentas };
};

export default useVentas;
