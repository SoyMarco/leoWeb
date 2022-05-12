import { useEffect, useContext } from "react";
import { Table, Result, Col, Row, Button, Tooltip } from "antd";
import ApartadoContext from "context/Apartado/ApartadoContext";
import AddProduct from "../../../AddProduct/AddProduct";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import useSchema from "./useSchema";
import "moment/locale/es";
import "./productos.css";

export default function Productos({ refetch, loading }) {
	const {
		totalTotal,
		productos,
		inputAbono,
		modalAddProduct,
		setmodalAddProduct,
	} = useContext(ApartadoContext);

	const { colProductos } = useSchema({ refetch });

	useEffect(() => {
		if (modalAddProduct === false) inputAbono.current.select();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalAddProduct]);
	const click = () => {
		inputAbono.current.select();
	};
	const titleTable = () => {
		return (
			<Row justify='space-between'>
				<h1
					style={{
						color: "white",
						fontSize: "large",
						fontWeight: "revert",
						margin: "10px 0 0 10px",
					}}
				>
					Productos: {productos.length}
				</h1>
				<Tooltip placement='top' title='Agregar producto'>
					<Button
						shape='round'
						style={{
							background: "linear-gradient(#2196F3,#0000E6)",
							marginTop: 5,
							marginRight: 10,
							color: "white",
							border: 0,
							// fontSize: "large",
							fontWeight: "bold",
						}}
						onClick={() => setmodalAddProduct(true)}
					>
						<FaShoppingCart style={{ fontSize: "large", marginRight: 5 }} />
						Agregar
					</Button>
				</Tooltip>
			</Row>
		);
	};
	return (
		<>
			<Col xs={24} sm={24} md={14}>
				<Table
					id='tableApartado'
					title={() => titleTable()}
					columns={colProductos}
					dataSource={productos}
					pagination={false}
					bordered
					loading={loading}
					scroll={{ y: 210, x: 500 }}
					style={{
						height: "380px",
						borderRadius: "10px",
						boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
						margin: "10px",
						background: "#f0f2f5",
					}}
					size='small'
					onRow={() => {
						return {
							onClick: () => {
								click();
							},
						};
					}}
					locale={{
						emptyText: (
							<Result
								icon={
									<MdLocalGroceryStore
										style={{ color: "red", fontSize: "xxx-large" }}
									/>
								}
								subTitle='Apartado sin productos'
							/>
						),
					}}
					footer={() => (
						<Row justify='end'>
							<h1 className='totalProductoApartado'>Productos ${totalTotal}</h1>
						</Row>
					)}
				/>
			</Col>

			{modalAddProduct && <AddProduct />}
		</>
	);
}
