import { useEffect, useContext } from "react";
import ApartadoContext from "context/Apartado/ApartadoContext";
import AddProduct from "../../../AddProduct/AddProduct";
import { Table, Result, Col, Row, Button } from "antd";
import { MdLocalGroceryStore } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import useSchema from "./useSchema";
import "moment/locale/es";
import "./productos.css";

export default function Productos() {
	const {
		totalTotal,
		productos,
		inputAbono,
		modalAddProduct,
		setmodalAddProduct,
		isLoading,
	} = useContext(ApartadoContext);

	const { colProductos } = useSchema();

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
						margin: "0px",
					}}
				>
					Productos
				</h1>

				<Button
					className='btn_addProduct'
					onClick={() => setmodalAddProduct(true)}
				>
					<FaShoppingCart style={{ fontSize: "large", marginRight: 5 }} />
					Agregar producto
				</Button>
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
					loading={isLoading}
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
						<Row justify='space-around'>
							<h1 className='numeroProductoApartado'>
								Productos {productos?.length}
							</h1>
							<h1 className='totalProductoApartado'>${totalTotal}</h1>
						</Row>
					)}
				/>
			</Col>

			{modalAddProduct && <AddProduct />}
		</>
	);
}
