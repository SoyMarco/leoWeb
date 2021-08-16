import React, { useEffect, useState } from "react";
import { TablaProductos, TablaApartados } from "../Components";
import { Row, notification } from "antd";
import { useQuery } from "@apollo/client";
import { GET_APARTADOS } from "graphql/apartado";
import { RiWifiOffLine } from "react-icons/ri";

export default function Apartados() {
	let { data, loading, error, refetch } = useQuery(GET_APARTADOS);
	const [stateRecord, setstateRecord] = useState(null);
	const [getApartados, setgetApartados] = useState([]);
	const [loader, setloader] = useState(false);

	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		notification.open({
			message: "Error de conexión",
			description: "Intentalo más tarde",
			icon: <RiWifiOffLine style={{ color: "red" }} />,
		});
	}
	useEffect(() => {
		if (data) {
			console.log(data);
			let { getApartados } = data;
			let listaApartados = getApartados.map((item) => {
				return { ...item, key: item.folio };
			});
			setgetApartados(listaApartados);
		}
	}, [data]);
	return (
		<>
			<Row>
				<TablaApartados
					getApartados={getApartados}
					loading={loading}
					loader={loader}
					setloader={setloader}
					refetch={refetch}
					setstateRecord={setstateRecord}
					stateRecord={stateRecord}
				/>
				<TablaProductos stateRecord={stateRecord} loading={loading} />
			</Row>
		</>
	);
}
