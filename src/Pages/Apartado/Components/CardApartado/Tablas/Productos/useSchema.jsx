import { useContext } from "react";
import { Row, Button, Popconfirm, Switch, Tooltip } from "antd";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { MdDelete } from "react-icons/md";
import "./productos.css";

export default function useSchema() {
	const { pasarAFecha, isLoading, borrarEntregarProduct } =
		useContext(ApartadoContext);

	const titleFecha = (createAt, record) => {
		if (record?.status === true) {
			return `${pasarAFecha(
				record?.fecha,
				"LLLL"
			)} por ${record?.vendedor?.toUpperCase()}`;
		}
		return `${pasarAFecha(
			createAt,
			"LLLL"
		)}  por ${record?.vendedor?.toUpperCase()}`;
	};

	/* COLUMNAS VENTAS */
	const colProductos = [
		{
			title: "Producto",
			dataIndex: "nombre",
			key: "nombre",

			ellipsis: true,
			render: (nombre) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{nombre}
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
				<Tooltip placement='top' title={titleFecha(createAt, record)}>
					<h1
						style={{
							textAlignLast: "center",
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
			title: "Precio",
			dataIndex: "precio",
			key: "precio",
			sorter: (a, b) => b.precio - a.precio,
			render: (precio) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						${precio}
					</h3>
				</Row>
			),
		},
		{
			title: "Borrar",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (_, record) => (
				<Tooltip placement='right' title='Borrar producto'>
					<Row justify='center'>
						<Popconfirm
							title='¿Deseas eliminar?'
							onConfirm={() => borrarEntregarProduct(record, "borrar")}
						>
							<Button
								loading={isLoading}
								shape='circle'
								icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
							></Button>
						</Popconfirm>
					</Row>
				</Tooltip>
			),
		},
		{
			title: "Entregar",
			dataIndex: "idArray",
			key: "idArray",
			ellipsis: {
				showTitle: false,
			},
			width: "70px",
			render: (_, record) => (
				<Tooltip
					placement='right'
					title={
						record?.entregado[0]?.status !== true
							? "Entregar producto"
							: "Producto Entregado"
					}
				>
					<Row justify='center'>
						<Switch
							loading={isLoading}
							checked={record?.entregado[0]?.status === false}
							size='small'
							style={
								record?.entregado[0]?.status
									? { background: "orange", marginTop: "5px" }
									: { background: "limegreen", marginTop: "5px" }
							}
							onClick={() => borrarEntregarProduct(record, "entregar")}
						/>
					</Row>
				</Tooltip>
			),
		},
	];
	return { colProductos };
}
