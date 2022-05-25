import { useContext } from "react";
import { MdDelete, MdLocalGroceryStore } from "react-icons/md";
import { Table, Button, Result, Row } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import EncargoContext from "context/NewEncargo/context";

export default function EncargoTable() {
	const { listaProductos, setlistaProductos } = useContext(EncargoContext);

	const eliminarProducto = (itemX) => {
		let i = listaProductos.indexOf(itemX);
		if (i !== -1) {
			let key = listaProductos.splice(i, 1);
			setlistaProductos(listaProductos.filter((item) => item.key !== key));
		} else if (itemX.key > 0) {
			let key = itemX.key;
			setlistaProductos(listaProductos.filter((item) => item.key !== key));
		}
	};

	const addArticulo = (record) => {
		if (listaProductos.length > 0) {
			const currentShopList = [...listaProductos];
			const shopItem = currentShopList.find((item) => item.key === record.key);
			shopItem.cantidad = shopItem.cantidad + 1;
			const newShopList = [...currentShopList];
			setlistaProductos(newShopList);
		}
	};
	const removeArticulo = (record) => {
		if (listaProductos.length > 0) {
			const currentShopList = [...listaProductos];
			const shopItem = currentShopList.find((item) => item.key === record.key);

			if (shopItem.cantidad > 1) {
				shopItem.cantidad = shopItem.cantidad - 1;
				shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
				const newShopList = [...currentShopList];
				setlistaProductos(newShopList);
			} else if (shopItem.cantidad === 1) {
				eliminarProducto(record);
			}
		}
	};
	const columns = [
		{
			title: "Producto",
			dataIndex: "nombre",
			key: "nombre",
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
			title: "Talla o tamaño",
			dataIndex: "talla",
			key: "talla",
			render: (talla) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{talla}
				</h3>
			),
		},
		{
			title: "Color o aroma",
			dataIndex: "color",
			key: "color",
			render: (color) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{color}
				</h3>
			),
		},
		{
			title: "Genero",
			dataIndex: "genero",
			key: "genero",
			render: (genero) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{genero}
				</h3>
			),
		},
		{
			title: "Modelo",
			dataIndex: "modelo",
			key: "modelo",
			render: (modelo) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{modelo}
				</h3>
			),
		},
		{
			title: "Precio",
			dataIndex: "precio",
			key: "precio",
			render: (precio) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					${precio}
				</h3>
			),
		},
		{
			title: "Cantidad",
			dataIndex: "cantidad",
			key: "cantidad",
			width: "100px",
			render: (cantidad, record) => (
				<Row justify='space-around'>
					<Button
						type='primary'
						shape='circle'
						icon={<MinusOutlined />}
						size='small'
						onClick={() => removeArticulo(record)}
					></Button>
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
							// fontSize: "x-large",
						}}
					>
						{cantidad}
					</h3>
					<Button
						type='primary'
						shape='circle'
						icon={<PlusOutlined />}
						size='small'
						onClick={() => addArticulo(record)}
					></Button>
				</Row>
			),
		},
		{
			title: "Borrar",
			dataIndex: "key",
			key: "key",
			width: "90px",
			render: (_key, record) => (
				<div style={{ textAlignLast: "center" }}>
					<Button
						shape='circle'
						icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
						// size="large"
						onClick={() => eliminarProducto(record)}
					></Button>
				</div>
			),
		},
	];
	return (
		<Table
			columns={columns}
			dataSource={listaProductos}
			pagination={false}
			bordered
			size='small'
			style={{
				boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
				margin: "0 10px",
			}}
			locale={{
				emptyText: (
					<Result
						icon={
							<MdLocalGroceryStore
								style={{ color: "blue", fontSize: "xxx-large" }}
							/>
						}
						subTitle='Agrega productos'
					/>
				),
			}}
		/>
	);
}
