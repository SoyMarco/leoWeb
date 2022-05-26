import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { Row, Button, Popconfirm, Tooltip } from "antd";
import { MdDelete } from "react-icons/md";
import "moment/locale/es";

export default function useSchema() {
	const { pasarAFecha, loader, borrarEntregarProduct } =
		useContext(ReadEncargoContext);

	const colProductos = [
		{
			title: "Encargo",
			dataIndex: "nombre",
			key: "nombre",
			ellipsis: true,
			fixed: "left",
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
			title: "Precio",
			dataIndex: "precio",
			key: "precio",
			render: (precio) => <h1>${precio}</h1>,
		},
		{
			title: "Talla",
			dataIndex: "talla",
			key: "talla",
			render: (talla) => (
				<Tooltip placement='top' title={talla}>
					{talla}
				</Tooltip>
			),
		},

		{
			title: "Color",
			dataIndex: "color",
			key: "color",
			render: (color) => (
				<Tooltip placement='top' title={color}>
					{color}
				</Tooltip>
			),
		},

		{
			title: "Genero",
			dataIndex: "genero",
			key: "genero",
			render: (genero) => (
				<Tooltip placement='top' title={genero}>
					{genero}
				</Tooltip>
			),
		},

		{
			title: "Modelo",
			dataIndex: "modelo",
			key: "modelo",
			render: (modelo) => (
				<Tooltip placement='top' title={modelo}>
					{modelo}
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
			title: "Borrar",
			dataIndex: "totalArticulo",
			key: "totalArticulo",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			fixed: "right",
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
	return { colProductos };
}
