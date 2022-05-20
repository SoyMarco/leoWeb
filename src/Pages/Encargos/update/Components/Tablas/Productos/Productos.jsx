import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { MdLocalGroceryStore } from "react-icons/md";
import { Table, Result, Col, Row, Button } from "antd";
import useSchema from "./useSchema";
import "../encargo.css";
import UpdateProducto from "./UpdateProduct/UpdateProducto";

export default function Productos() {
	const {
		productos,
		loading,
		inputAbono,
		totalProductos,
		cantidadProductos,
		setencargoSelect,
		openModal,
		setopenModal,
	} = useContext(ReadEncargoContext);

	const { colProductos } = useSchema();

	const click = (record) => {
		console.log(record);
		setencargoSelect(record);
		setopenModal("UPDATE");
		inputAbono.current.select();
	};

	return (
		<>
			<Col xs={24} sm={24} md={14}>
				<Table
					id='tableEncargos'
					rowKey={(record) => record._id}
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

							<Button
								onClick={() => {
									setopenModal("NEW");
								}}
							>
								Agregar producto
							</Button>
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
							<h1 className='conteoEncargo'>Encargos {cantidadProductos}</h1>
							<h1 className='totalProductoApartado'>${totalProductos}</h1>
						</Row>
					)}
				/>
			</Col>

			{openModal && <UpdateProducto />}
		</>
	);
}
