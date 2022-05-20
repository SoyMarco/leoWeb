import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { SmileOutlined } from "@ant-design/icons";
import { Table, Result, Col, Row, Progress } from "antd";
import useSchema from "./useSchema";

export default function Abonos() {
	const { abonos, loading, inputAbono, newAbono, totalAbonos, totalTotal } =
		useContext(ReadEncargoContext);

	const { colAbonos } = useSchema();

	const click = () => {
		inputAbono.current.select();
	};
	const calculatePorcent = () => {
		let addAbono = 0;
		if (parseInt(newAbono) > 0) {
			addAbono = parseInt(newAbono);
		}
		let porcent = 0;
		porcent = ((totalAbonos + addAbono) * 100) / totalTotal ?? 0;

		return porcent;
	};
	return (
		<Col xs={24} sm={24} md={10}>
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
							Abonos
						</h1>
					</Row>
				)}
				columns={colAbonos}
				dataSource={abonos}
				pagination={false}
				loading={loading}
				bordered
				scroll={{ y: 210 }}
				size='small'
				style={{
					height: "380px",
					borderRadius: "10px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					margin: "10px",
				}}
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
							icon={<SmileOutlined />}
							// status="500"
							subTitle='Selecciona un apartado'
						/>
					),
				}}
				footer={() => (
					<>
						<Row justify='space-around'>
							<h1 className='conteoEncargo'>Abonos {abonos?.length}</h1>
							<h1 className='totalAbonosApartado'>${totalAbonos}</h1>
						</Row>
						<Progress
							strokeColor={
								calculatePorcent() > 100
									? {
											from: "red",
											to: "limegreen",
									  }
									: {
											from: "dodgerblue",
											to: "limegreen",
									  }
							}
							percent={parseInt(calculatePorcent())}
							status='active'
							// style={{ width: "90%" }}
						/>
					</>
				)}
			/>
		</Col>
	);
}
