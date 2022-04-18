import { useEffect } from "react";
import { Table, Result } from "antd";
import SchemaPerfumes from "./SchemaPerfumes";
import { GiDelicatePerfume } from "react-icons/gi";
import { useQuery } from "@apollo/client";
import { GET_ALL_PERFUME } from "myGraphql/perfume";

const TablaPerfumes = () => {
	let { data, refetch } = useQuery(GET_ALL_PERFUME, {
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Table
			columns={SchemaPerfumes()}
			dataSource={data?.getAllPerfumes}
			pagination={false}
			bordered
			scroll={{ y: 450 }}
			style={{
				height: "480px",
				borderRadius: "10px",
				boxShadow: "10px 6px 20px 5px #8b8b8b, -6px 0px 20px #ffffff",
				margin: "5px 10px",
				background: "#f0f2f5",
			}}
			size='small'
			locale={{
				emptyText: (
					<Result
						icon={
							<GiDelicatePerfume
								style={{ color: "darkBlue", fontSize: "xxx-large" }}
							/>
						}
						subTitle='No encuentro perfumes agregados'
					/>
				),
			}}
		/>
	);
};
export default TablaPerfumes;
