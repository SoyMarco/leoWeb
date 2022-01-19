import React, { useState, useEffect } from "react";
import { MdLocalGroceryStore } from "react-icons/md";
import { Table, Result, Col } from "antd";
import SchemaVentas from "../Schema/SchemaVentas";

export default function TablaVentas({
	getVentas,
	setstateRecord,
	stateRecord,
	setimprimir,
	setmodalProductos,
}) {
	const [selectedRowKeys, setselectedRowKeys] = useState(0);

	const onSelectChange = () => {
		setselectedRowKeys([]);
	};
	useEffect(() => {
		if (getVentas) {
			let numArray = getVentas?.length - 1;
			let lastFolio = getVentas[numArray]?.key;
			setselectedRowKeys([lastFolio]);
			let algo = getVentas.find((item) => item.id === stateRecord?.id);
			setstateRecord(algo ?? []);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getVentas]);

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const click = (record) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
	};

	return (
		<Col xs={24} sm={24} md={24}>
			<Table
				rowKey={(record) => record.id}
				columns={SchemaVentas(setimprimir)}
				dataSource={getVentas}
				pagination={false}
				bordered
				scroll={{ y: 435 }}
				style={{
					height: "475px",
					borderRadius: "10px",
					boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
					margin: "0 10px 10px 0",
				}}
				rowSelection={rowSelection}
				size='small'
				onRow={(record) => {
					return {
						onClick: () => {
							click(record);
						},
						onDoubleClick: () => {
							setmodalProductos(true);
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
							subTitle='No se encontraron ventas'
						/>
					),
				}}
			/>
		</Col>
	);
}
