import { Table } from "antd";

export default function TablaEncargos({ item }) {
	const columns = [
		{
			title: "Producto",
			dataIndex: "nombre",
			key: "nombre",
		},
		{
			title: "Color o aroma",
			dataIndex: "color",
			key: "color",
		},
		{
			title: "Genero",
			dataIndex: "genero",
			key: "genero",
		},
		{
			title: "Talla o tamaño",
			dataIndex: "talla",
			key: "talla",
		},

		{
			title: "Modelo",
			dataIndex: "modelo",
			key: "modelo",
		},
		{
			title: "Cantidad",
			dataIndex: "cantidad",
			key: "cantidad",
			width: "100px",
		},
		{
			title: "Vendedor",
			dataIndex: "vendedor",
			key: "vendedor",
			// fixed: "right",
		},
	];
	return (
		<Table
			columns={columns}
			dataSource={item?.productos}
			pagination={false}
			bordered
			size='small'
			style={{
				boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
				marginBottom: 10,
			}}
			scroll={{ x: 720 }}
			className='tableEncargos'
		/>
	);
}
