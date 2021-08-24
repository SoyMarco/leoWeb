import React, { useState } from "react";
import "antd/dist/antd.css";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function Prueba() {
	const [state, setState] = useState({
		searchText: "",
		searchedColumn: "",
	});
	const data = [
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
		},
		{
			key: "2",
			name: "Joe Black",
			age: 42,
			address: "London No. 1 Lake Park",
		},
		{
			key: "3",
			name: "Jim Green",
			age: 32,
			address: "Sidney No. 1 Lake Park",
		},
		{
			key: "4",
			name: "Jim Red",
			age: 32,
			address: "London No. 2 Lake Park",
		},
	];
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref='name'
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type='primary'
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size='small'
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => handleReset(clearFilters)}
						size='small'
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type='link'
						size='small'
						onClick={() => {
							confirm({ closeDropdown: false });
							setState({
								searchText: selectedKeys[0],
								searchedColumn: dataIndex,
							});
						}}
					>
						Filter
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: "",
		onFilterDropdownVisibleChange: (visible) => {},
		render: (text) => (state.searchedColumn === dataIndex ? "hola" : text),
	});
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setState({ searchText: "" });
	};
	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			width: "30%",
			render: (key) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{getColumnSearchProps("name")}
				</h3>
			),
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
			width: "20%",
			render: (key) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{getColumnSearchProps("age")}
				</h3>
			),
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
			render: (key) => (
				<h3
					style={{
						fontWeight: "revert",
						fontSize: "large",
					}}
				>
					{getColumnSearchProps("address")}
				</h3>
			),
			sorter: (a, b) => a.address.length - b.address.length,
			sortDirections: ["descend", "ascend"],
		},
	];
	return <Table columns={columns} dataSource={data} />;
}
