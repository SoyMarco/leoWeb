import { useContext } from "react";
import useService from "Hooks/Service/useService";
import { Row, Button, Popconfirm, Switch, Tooltip } from "antd";
import { CANCELAR_PRODUCTO_APARTDO } from "myGraphql/apartado";
import { openNotification } from "Utils/openNotification";
import AuthContext from "context/Auth/AuthContext";
import { useMutation } from "@apollo/client";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import "moment/locale/es";
import "./productos.css";

export default function useSchema({ refetch }) {
	const { isLoading } = useContext(AuthContext);

	const { register } = useService();

	const [mutateCANCELAR_PRODUCTO_APARTDO] = useMutation(
		CANCELAR_PRODUCTO_APARTDO
	);

	const pasarAFecha = (item) => {
		moment.locale("es");
		return moment.unix(item / 1000).format("ll");
	};

	const pasarAFechaLLLL = (item) => {
		return moment.unix(item / 1000).format("LLLL");
	};
	const borrarEntregarProduct = async (item, borrarEntregar) => {
		if (isLoading === false) {
			const isEntregado = item.entregado[0];
			let status = true;
			if (isEntregado && isEntregado.status) {
				status = !isEntregado.status;
			}
			const data = await register({
				mutate: mutateCANCELAR_PRODUCTO_APARTDO,
				input: {
					_id: item._id,
					status: status,
					borrarEntregar: borrarEntregar,
				},
			});

			if (data) {
				refetch();
				if (borrarEntregar === "borrar") {
					openNotification("success", `Articulo borrado con exito`);
					return;
				}
				openNotification("success", `Articulo modificado con exito`);
			}
		}
	};
	const titleFecha = (createAt, record) => {
		if (record?.status === true) {
			return `${pasarAFechaLLLL(
				record?.fecha
			)} por ${record?.vendedor?.toUpperCase()}`;
		}
		return `${pasarAFechaLLLL(
			createAt
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
							? `${pasarAFecha(record?.entregado[0]?.fecha)}`
							: `${pasarAFecha(createAt)}`}
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
