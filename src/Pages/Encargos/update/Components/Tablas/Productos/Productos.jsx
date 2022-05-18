import { useState, useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { MdLocalGroceryStore } from "react-icons/md";
import AddProduct from "../../AddProduct/AddProduct";
import { Table, Result, Col, Row } from "antd";
import useSchema from "./useSchema";
import "../encargo.css";

export default function Productos() {
	const {
		dataEncargo,
		productos,
		refetch,
		loading,
		inputAbono,
		setstateRecord,
		totalTotal,
	} = useContext(ReadEncargoContext);

	const { colProductos } = useSchema();

	const [modalAddProduct, setmodalAddProduct] = useState(false);

	const click = (record) => {
		setstateRecord(record);
		inputAbono.current.select();
	};

	return (
		<>
			<Col xs={24} sm={24} md={14}>
				<Table
					id='tableEncargos'
					title={() => (
						<Row justify='space-between'>
							<h1
								style={{
									color: "white",
									fontSize: "large",
									fontWeight: "revert",
									margin: "0px",
								}}
							>
								Encargos
							</h1>
						</Row>
					)}
					columns={colProductos}
					dataSource={productos}
					pagination={false}
					bordered
					loading={loading}
					scroll={{ y: 210, x: 720 }}
					style={{
						height: "380px",
						borderRadius: "10px",
						boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
						margin: "10px",
					}}
					size='small'
					onRow={(record) => {
						return {
							onClick: () => {
								click(record);
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

			{modalAddProduct && (
				<AddProduct
					setmodalAddProduct={setmodalAddProduct}
					modalAddProduct={modalAddProduct}
					refetch={refetch}
					dataEncargo={dataEncargo}
				/>
			)}
		</>
	);
}
