import React, { useState } from "react";
import { Tooltip, Button, InputNumber } from "antd";
import { MdDelete } from "react-icons/md";

export default function SchemaPerfumes() {
	const [editingKey, setEditingKey] = useState("");
	const isEditing = (record) => {
		return record.key === editingKey;
	};
	const edit = (record) => {
		setEditingKey(record.key);
	};

	return [
		{
			title: "Aroma",
			dataIndex: "nombre",
			key: "nombre",
			ellipsis: true,
			onFilter: (value, record) => record.nombre.includes(value),
			sorter: (a, b) => a.nombre.length - b.nombre.length,
			filters: [
				{
					text: "212",
					value: "212",
				},
				{
					text: "katy",
					value: "katy",
				},
			],
			render: (nombre) =>
				nombre !== "Articulo" ? (
					<Tooltip placement='topLeft' title={nombre}>
						<h3
							style={{
								fontWeight: "revert",
								fontSize: "large",
							}}
						>
							{nombre}
						</h3>
					</Tooltip>
				) : (
					<p>{nombre}</p>
				),
		},

		{
			title: "Cantidad",
			dataIndex: "size",
			editable: true,
			render: (size, record) => {
				const editable = isEditing(record);
				return editable ? (
					<InputNumber
						type='number'
						autoFocus
						min={0}
						max={50}
						defaultValue={size.stok ?? 0}
						formatter={(value) => parseInt(value)}
						parser={(value) => {
							console.log(value);
							return value > 50 || !value ? 0 : value;
						}}
					/>
				) : (
					<h3
						style={{
							textAlignLast: "center",
							fontWeight: "revert",
						}}
						onClick={() => edit(record)}
					>
						{size.stok ?? 0}
					</h3>
				);
			},
		},
		{
			title: "Debe haber",
			dataIndex: "size",
			render: (size) => (
				<h3
					style={{
						textAlignLast: "center",
						fontWeight: "revert",
					}}
				>
					{size.minStock}
				</h3>
			),
		},
		{
			title: "Borrar",
			dataIndex: "key",
			key: "key",
			width: "85px",
			responsive: ["lg"],
			render: () => (
				<div style={{ textAlignLast: "center" }}>
					<Button
						danger
						style={{ borderRadius: "10px" }}
						ghost
						icon={<MdDelete style={{ color: "#c5221f" }} size='25px' />}
						// onClick={() => eliminarProducto(record)}
					></Button>
				</div>
			),
		},
	];
}
