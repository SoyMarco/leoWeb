import { useContext } from "react";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { Table, Result, Col, Row, Progress } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import useSchema from "./useSchema";
import "./abonos.css";

export default function Abonos() {
	const { totalAbonos, abonos, inputAbono, isLoading, porcentBar } =
		useContext(ApartadoContext);

	const { colAbonos } = useSchema();

	const click = () => {
		inputAbono.current.select();
	};

	return (
		<Col xs={24} sm={24} md={10}>
			<Table
				rowKey={(record) => record._id}
				id='tableApartado'
				columns={colAbonos}
				dataSource={abonos}
				pagination={false}
				loading={isLoading}
				bordered
				scroll={{ y: 190, x: 400 }}
				size='small'
				style={{
					height: "380px",
					borderRadius: "10px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					margin: "10px",
					background: "#f0f2f5",
				}}
				onRow={() => {
					return {
						onClick: () => {
							click();
						},
					};
				}}
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
							Abonos
						</h1>
					</Row>
				)}
				locale={{
					emptyText: (
						<Result
							icon={<SmileOutlined />}
							// status="500"
							subTitle='Selecciona un apartado'
						/>
					),
				}}
				footer={() => (
					<>
						<Row justify='space-around'>
							<h1 className='numeroAbonosApartado'>Abonos {abonos?.length}</h1>
							<h1 className='totalAbonosApartado'>${totalAbonos}</h1>
						</Row>
						<Progress
							strokeColor={
								porcentBar > 100
									? {
											from: "red",
											to: "limegreen",
									  }
									: {
											from: "dodgerblue",
											to: "limegreen",
									  }
							}
							percent={parseInt(porcentBar)}
							status='active'
							// style={{ width: "90%" }}
						/>
					</>
				)}
			/>
		</Col>
	);
}
