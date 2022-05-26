import { useContext } from "react";
import VentasContext from "Pages/Ventas/Context/context";
import { MdLocalGroceryStore } from "react-icons/md";
import useVentas from "./Schema/useVentas";
import { Table, Result } from "antd";

export default function TablaVentas() {
	const { getVentas, setstateRecord, setmodalProductos, loading } =
		useContext(VentasContext);

	const { columnsVentas } = useVentas();

	const click = (record) => {
		setstateRecord(record);
	};

	return (
		<Table
			rowKey={(record) => record.id}
			columns={columnsVentas}
			dataSource={getVentas}
			pagination={false}
			bordered
			loading={loading}
			size='small'
			scroll={{ y: 435 }}
			style={{
				height: "475px",
				borderRadius: "10px",
				boxShadow: "6px 6px 20px #8b8b8b, -6px -6px 20px #ffffff",
				margin: "10px",
			}}
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
	);
}
