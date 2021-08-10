import React, { useState } from "react";
import { Card, Table, Tooltip, Input, Button } from "antd";

import {
	EditOutlined,
	EllipsisOutlined,
	SettingOutlined,
	DollarOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import { AiFillDollarCircle } from "react-icons/ai";
import { BiDollar } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import "./principal.css";
const inputPrecio = <Input />;

function Principal() {
	const { Search } = Input;
	const [selectedRowKeys, setselectedRowKeys] = useState(["1"]);

	const onSelectChange = (selectedRowKeys) => {
		console.log("selectedRowKeys changed: ", selectedRowKeys);
		setselectedRowKeys([]);
		// setselectedRowKeys(selectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const click = (record, rowIndex) => {
		console.log(record, rowIndex);
		setselectedRowKeys([record.key]);
	};
	return (
		<>
			<Card
				actions={[
					<h1
						style={{
							color: "darkblue",
							"font-size": "xx-large",
							"font-weight": "bold",
							"margin-top": "-5px",
						}}
						onClick={click}
					>
						Productos: {data.length ?? 0}
					</h1>,
					<></>,
					<h1
						style={{
							color: "green",
							"font-size": "xxx-large",
							"font-weight": "bold",
							"margin-top": "-20px",
						}}
					>
						$540,515.00
					</h1>,
				]}
			>
				<div
					style={{
						background: "linear-gradient(#0000a6, #000066)",
						"text-align-last": "center",
						padding: "7px",
						"border-radius": "25px 5px 0 0",
					}}
				>
					<Input
						prefix={<AiFillDollarCircle />}
						style={{
							color: "green",
							fontSize: 30,
							"font-size": "xx-large",
							"font-weight": "bold",
							"border-radius": "50px",
							"max-width": "60%",
						}}
					/>
				</div>
				<Table
					columns={columns}
					dataSource={data}
					pagination={false}
					bordered
					scroll={{ y: 400 }}
					style={{
						height: "430px",
						"border-radius": "10px",
						"box-shadow": "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
						margin: "10px",
					}}
					rowSelection={rowSelection}
					size="small"
					onRow={(record, rowIndex) => {
						return {
							onClick: (e) => {
								click(record, rowIndex);
							}, // click row
						};
					}}
				/>
			</Card>
		</>
	);
}

export default Principal;

const columns = [
	{
		title: "ID",
		dataIndex: "key",
		key: "key",
	},
	{
		title: "Producto",
		dataIndex: "producto",
		key: "producto",
	},
	{
		title: "Precio",
		dataIndex: "precio",
		key: "precio",
		ellipsis: true,
		render: (precio) => (
			<h3 style={{ "text-align-last": "right" }}>{precio}</h3>
		),
	},
	{
		title: "Cantidad",
		dataIndex: "precio",
		key: "precio",
		render: (cantidad) => (
			<h3 style={{ "text-align-last": "center" }}>{cantidad}</h3>
		),
	},
	{
		title: "Apartado",
		dataIndex: "precio",
		key: "precio",
		ellipsis: {
			showTitle: false,
		},

		render: (address) => (
			<Tooltip placement="topLeft" title={address}>
				{address}
			</Tooltip>
		),
	},
	{
		title: "Referencia",
		dataIndex: "precio",
		key: "precio",
		ellipsis: {
			showTitle: false,
		},

		render: (address) => (
			<Tooltip placement="topLeft" title={address}>
				{address}
			</Tooltip>
		),
	},
	{
		title: "Total",
		dataIndex: "precio",
		key: "precio",
		ellipsis: {
			showTitle: false,
		},
		render: (precio) => (
			<h3 style={{ "text-align-last": "right", color: "green" }}>{precio}</h3>
		),
	},
	{
		title: "Borrar",
		dataIndex: "key",
		key: "key",
		render: (key) => (
			<div style={{ "text-align-last": "center" }}>
				<Button
					shape="circle"
					icon={<MdDelete style={{ color: "#c5221f" }} size="30px" />}
					size="large"
				></Button>
			</div>
		),
	},
];

const data = [
	{
		key: "1",
		producto: "John Brown",
		precio: "$100,985.50",
		address: "New York No. 1 Lake Park, New York No. 1 Lake Park",
	},
	{
		key: "2",
		producto: "Jim Green",
		precio: 42,
		address: "London No. 2 Lake Park, London No. 2 Lake Park",
	},
	{
		key: "3",
		producto: "Joe Black",
		precio: 32,
		address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
	},
	{
		key: "4",
		producto: "John Brown",
		precio: 32,
		address: "New York No. 1 Lake Park, New York No. 1 Lake Park",
	},
	{
		key: "5",
		producto: "Jim Green",
		precio: 42,
		address: "London No. 2 Lake Park, London No. 2 Lake Park",
	},
	{
		key: "6",
		producto: "Joe Black",
		precio: 32,
		address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
	},
	{
		key: "7",
		producto: "John Brown",
		precio: 32,
		address: "New York No. 1 Lake Park, New York No. 1 Lake Park",
	},
	{
		key: "8",
		producto: "Jim Green",
		precio: 42,
		address: "London No. 2 Lake Park, London No. 2 Lake Park",
	},
	{
		key: "9",
		producto: "Joe Black",
		precio: 32,
		address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
	},
];
