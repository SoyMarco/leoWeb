import React, { useEffect, useState } from "react";
import { TablaProductos, TablaAbonos } from "../Components";
import { Row, Divider, notification } from "antd";
import { useQuery, gql, useMutation } from "@apollo/client";
import { GET_APARTADOS } from "graphql/apartado";
import { RiWifiOffLine } from "react-icons/ri";

export default function Apartado() {
	let { data, loading, error, refetch } = useQuery(GET_APARTADOS);
	const [stateRecord, setstateRecord] = useState(null);
	const [getApartados, setgetApartados] = useState([]);
	const [loader, setloader] = useState(false);

	const [filter, setfilter] = useState([]);

	useEffect(() => {}, []);

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
				<TablaProductos
					getApartados={getApartados}
					loading={loading}
					loader={loader}
					setloader={setloader}
					refetch={refetch}
					setstateRecord={setstateRecord}
					stateRecord={stateRecord}
				/>
				<TablaAbonos stateRecord={stateRecord} loading={loading} />
			</Row>
		</>
	);
}
