import { useContext } from "react";
import { Table, Result } from "antd";
import { MdLocalGroceryStore } from "react-icons/md";
import ShopListContext from "context/Shopping/ShopListContext";
import SchemaPrincipal from "./SchemaPrincipal";

export default function TablaPrincipal({ setstateRecord }) {
	const { shopList, selectedRowKeys, setselectedRowKeys } =
		useContext(ShopListContext);

	const rowSelection = {
		selectedRowKeys,
	};
	const click = (record) => {
		setselectedRowKeys([record.key]);
		setstateRecord(record);
		document.querySelector("#inputPrecio").select();
	};

	return (
		<Table
			columns={SchemaPrincipal()}
			dataSource={shopList}
			pagination={false}
			bordered
			scroll={{ y: 300 }}
			style={{
				height: "330px",
				borderRadius: "10px",
				boxShadow: "10px 6px 20px 5px #8b8b8b, -6px 0px 20px #ffffff",
				margin: "5px 10px",
				background: "#f0f2f5",
			}}
			rowSelection={rowSelection}
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
								style={{ color: "darkBlue", fontSize: "xxx-large" }}
							/>
						}
						subTitle='Agrega productos'
					/>
				),
			}}
		/>
	);
}
