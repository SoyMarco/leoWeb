import { useState, useContext } from "react";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { Table, Result, Col, Row, Progress } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import useSchema from "./useSchema";
import "./productos.css";

export default function Abonos({ loading }) {
	const { totalTotal, totalAbonos, abonos, abono, inputAbono } =
		useContext(ApartadoContext);
	const { colAbonos } = useSchema({ loading });
	const [selectedRowKeys, setselectedRowKeys] = useState(0);

	const onSelectChange = () => {
		setselectedRowKeys([]);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const click = (record) => {
		setselectedRowKeys([record.key]);
		inputAbono.current.select();
	};

	const calculatePorcent = () => {
		let addAbono = 0;
		if (parseInt(abono.abono) > 0) {
			addAbono = parseInt(abono.abono);
		}
		let porcent = 0;
		porcent = ((totalAbonos + addAbono) * 100) / totalTotal ?? 0;

		return porcent;
	};
	return (
		<Col xs={24} sm={24} md={10}>
			{/* PRODUCTOS */}
			<Table
				rowKey={(record) => record._id}
				id='tableApartado'
				columns={colAbonos}
				dataSource={abonos}
				pagination={false}
				loading={loading}
				bordered
				scroll={{ y: 190 }}
				rowSelection={rowSelection}
				size='small'
				style={{
					height: "380px",
					borderRadius: "10px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					margin: "10px",
					background: "#f0f2f5",
				}}
				onRow={(record) => {
					return {
						onClick: () => {
							click(record);
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
								margin: "10px 0 0 10px",
							}}
						>
							Abonos: {abonos.length}
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
						<Row justify='end'>
							<h1 className='totalAbonosApartado'>Abonos ${totalAbonos}</h1>
						</Row>
						<Row justify='center'>
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
						</Row>
					</>
				)}
			/>
		</Col>
	);
}
