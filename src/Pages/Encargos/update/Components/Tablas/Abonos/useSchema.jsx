import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { Row, Tooltip, Popconfirm, Button } from "antd";
import { MdDelete } from "react-icons/md";

export default function useSchema() {
	const { pasarAFecha, loading, loader, borrarAbono } =
		useContext(ReadEncargoContext);

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
			render: (vendedor) => (
				<h3
					style={{
						// fontWeight: "revert",
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
					<h1>{pasarAFecha(createAt, "L")}</h1>
				</Tooltip>
			),
		},
		{
			title: "Abono",
			dataIndex: "abono",
			key: "abono",
			render: (abonoRender, _record) => (
				<Row justify='space-around'>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							fontSize: "large",
						}}
					>
						${abonoRender}
					</h3>
				</Row>
			),
		},
		{
			title: "Delete",
			dataIndex: "idArray",
			key: "idArray",
			ellipsis: {
				showTitle: false,
			},
			width: "60px",
			render: (_idArray, record) => (
				<Tooltip placement='bottom' title='Borrar abono'>
					<Row justify='center'>
						<Popconfirm
							disabled={loader || loading}
							title='¿Deseas eliminarlo?'
							onConfirm={() => borrarAbono(record, "borrar")}
						>
							<Button
								loading={loader || loading}
								shape='circle'
								icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
							></Button>
						</Popconfirm>
					</Row>
				</Tooltip>
			),
		},
	];
	return { colAbonos };
}
