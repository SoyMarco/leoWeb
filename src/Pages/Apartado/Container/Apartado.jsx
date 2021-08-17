import React, { useEffect, useState } from "react";
import { TablaProductos, TablaAbonos } from "../Components";
import { Row, Divider, notification } from "antd";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useHistory, useParams, withRouter } from "react-router-dom";
import { GET_PRODUCTOS_FOLIO } from "graphql/apartado";
import { RiWifiOffLine } from "react-icons/ri";

export default function Apartado(props) {
	const params = useParams();
	let urlFolio = parseInt(params.folio);

	let { data, loading, error, refetch } = useQuery(GET_PRODUCTOS_FOLIO, {
		variables: { folio: urlFolio },
	});
	const [stateRecord, setstateRecord] = useState(null);
	const [loader, setloader] = useState(false);
	const [filter, setfilter] = useState([]);
	const [productos, setproductos] = useState([]);
	const [abonos, setabonos] = useState([]);

	const [totalProductos, settotalProductos] = useState(0);
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);

	useEffect(() => {
		let propsFolio = 0;
		let urlFolio = parseInt(params.folio);
		propsFolio = props?.location?.apartado?.folio;

		if (propsFolio === urlFolio) {
			let apartado = props?.location?.apartado;
			/* Si hay props */
			setproductos(apartado.productos);
			setabonos(apartado.abonos);
		} else {
			console.log("params", params);
		}
	}, [props?.location?.apartado?.folio]);
	useEffect(() => {
		if (data) {
			console.log(data);

			let { productos, abonos } = data?.getProductosFolio[0];

			let listaAbonos = abonos.map((item) => {
				return { ...item, key: item.idArray };
			});
			setabonos(listaAbonos);

			let listaProductos = productos.map((item) => {
				return { ...item, key: item.idArray };
			});
			setproductos(listaProductos);
		}
	}, [data]);
	useEffect(() => {
		// selectLastRow();
		let sum = 0;
		let sumProd = 0;
		for (let i = 0; i < productos.length; i++) {
			sum += productos[i].totalArticulo;
			sumProd += productos[i].cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);

		let sumAbo = 0;
		for (let i = 0; i < abonos.length; i++) {
			sumAbo += abonos[i].abono;
		}
		settotalAbonos(sumAbo);
	}, [productos]);

	if (error) {
		notification.open({
			message: "Error de conexión",
			description: "Intentalo más tarde",
			icon: <RiWifiOffLine style={{ color: "red" }} />,
		});
	}
	return (
		<>
			<Row>
				<TablaProductos
					productos={productos}
					loading={loading}
					loader={loader}
					setloader={setloader}
					refetch={refetch}
					setstateRecord={setstateRecord}
					stateRecord={stateRecord}
				/>
				<TablaAbonos
					abonos={abonos}
					loading={loading}
					loader={loader}
					setloader={setloader}
				/>
			</Row>
		</>
	);
}
