import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { CANCELAR_PRODUCTO_APARTDO } from "myGraphql/apartado";
import { openNotification } from "Utils/openNotification";
import { Row, Button, Popconfirm, Tooltip } from "antd";
import { useMutation } from "@apollo/client";
import { MdDelete } from "react-icons/md";
import "moment/locale/es";

export default function useSchema() {
	const { pasarAFecha, refetch, loader, setloader } =
		useContext(ReadEncargoContext);

	const [mutateCANCELAR_PRODUCTO_APARTDO] = useMutation(
		CANCELAR_PRODUCTO_APARTDO
	);

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
			}
		}
	};
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
