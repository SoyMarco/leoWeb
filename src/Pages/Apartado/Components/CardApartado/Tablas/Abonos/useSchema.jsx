import { useContext } from "react";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { Row, Tooltip, Switch, Popconfirm } from "antd";
import "./abonos.css";

export default function useSchema() {
	const { isLoading, borrarAbono, pasarAFecha } = useContext(ApartadoContext);

	const colorRow = (record) => {
		if (record.cancel === true) return "red";
		return "darkgreen";
	};
	const tooltipStatusAbono = (record) => {
		if (record.cancelado === true) return "Desactivado";
		return "Activado";
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
							disabled={isLoading}
							title='¿Deseas eliminarlo?'
							onConfirm={() => borrarAbono(record, "borrar")}
						>
							<Switch
								loading={isLoading}
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
