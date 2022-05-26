import { useContext } from "react";
import useService from "Hooks/Service/useService";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { openNotification } from "Utils/openNotification";
import { BORRAR_EDITAR_ABONO } from "myGraphql/apartado";
import { Row, Tooltip, Switch, Popconfirm } from "antd";
import AuthContext from "context/Auth/AuthContext";
import { useMutation } from "@apollo/client";
import moment from "moment";
import "./abonos.css";

export default function useSchema({ loading }) {
	const { dataApartado } = useContext(ApartadoContext);
	const { isLoading } = useContext(AuthContext);

	const { register } = useService();

	const [mutateBORRAR_EDITAR_ABONO] = useMutation(BORRAR_EDITAR_ABONO);

	const pasarAFecha = (item, format) => {
		return moment.unix(item / 1000).format(format);
	};
	const colorRow = (record) => {
		if (record.cancel === true) return "red";
		return "darkgreen";
	};
	const tooltipStatusAbono = (record) => {
		if (record.cancelado === true) return "Desactivado";
		return "Activado";
	};

	const borrarAbono = async (record, borrarEditar) => {
		if (record) {
			const data = await register({
				mutate: mutateBORRAR_EDITAR_ABONO,
				input: {
					abono: record.abono,
					borrarEditar: borrarEditar,
					idVenta: record.idVenta,
					idAbono: record._id,
					idApartado: dataApartado.id,
					statusVenta: record.cancel,
				},
			});

			if (data) openNotification("success", `Abono borrado`);
		}
	};

	/* COLUMNAS ABONOS */
	const colAbonos = [
		{
			title: "ID",
			dataIndex: "_id",
			key: "_id",
			width: "0px",
			ellipsis: true,
		},
		{
			title: "Vendedor",
			dataIndex: "vendedor",
			key: "vendedor",
			ellipsis: true,
			render: (vendedor, _record) => (
				<h3
					style={{
						// color: colorRow(record),
						fontSize: "large",
					}}
				>
					{vendedor}
				</h3>
			),
		},
		{
			title: "Fecha",
			dataIndex: "createAt",
			key: "createAt",
			sorter: (a, b) => b.createAt - a.createAt,
			defaultSortOrder: "ascend",
			render: (createAt, _record) => (
				<Tooltip placement='top' title={`${pasarAFecha(createAt, "LLLL")}`}>
					<h1
					// style={{ color: colorRow(record) }}
					>
						{pasarAFecha(createAt, "L")}
					</h1>
				</Tooltip>
			),
		},
		{
			title: "Abonos",
			dataIndex: "abono",
			key: "abono",
			render: (abonoRender, record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
							color: colorRow(record),
						}}
					>
						${abonoRender}
					</h3>
				</Row>
			),
		},
		{
			title: "Status",
			dataIndex: "idArray",
			key: "idArray",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (_idArray, record) => (
				<Row justify='center'>
					<Tooltip placement='right' title={() => tooltipStatusAbono(record)}>
						<Popconfirm
							disabled={isLoading || loading}
							title='¿Deseas eliminarlo?'
							onConfirm={() => borrarAbono(record, "borrar")}
						>
							<Switch
								loading={loading}
								checked={!record.cancel}
								size='small'
								style={{
									background: colorRow(record),
									marginTop: "5px",
								}}
							/>
						</Popconfirm>
					</Tooltip>
				</Row>
			),
		},
	];
	return { colAbonos };
}
