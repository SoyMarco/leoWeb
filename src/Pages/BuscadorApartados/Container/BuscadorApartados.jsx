import React, { useEffect, useState } from "react";
import { Row, Select, ConfigProvider, Result } from "antd";
import "./buscarApartados.css";
import { useQuery } from "@apollo/client";
import { GET_APARTADOS_BUSCADOR } from "graphql/apartado";
import { GET_ENCARGOS } from "graphql/encargo";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { SyncOutlined } from "@ant-design/icons";

export default function BuscadorApartados() {
	let {
		data: dataApartados,
		loading,
		refetch,
	} = useQuery(GET_APARTADOS_BUSCADOR);
	let {
		data: dataEncargos,
		loading: loadingEncargos,
		refetch: refetchEncargos,
	} = useQuery(GET_ENCARGOS);

	const [listaBusqueda, setlistaBusqueda] = useState([]);
	const [urlFolio, seturlFolio] = useState({ folio: 0, tipo: "" });
	// const [clienteName, setclienteName] = useState(null);
	const { Option } = Select;
	const history = useHistory();
	useEffect(() => {
		if (dataApartados && dataEncargos) {
			let listaBusquedaMap = [];
			let { getApartados } = dataApartados;
			let listaApartadosMap = getApartados.map((item) => {
				return { ...item, tipo: "apartado" };
			});

			let { getEncargos } = dataEncargos;
			let listaEncargosMap = getEncargos.map((item) => {
				return { ...item, tipo: "encargo" };
			});

			listaBusquedaMap.push(...listaApartadosMap);
			listaBusquedaMap.push(...listaEncargosMap);

			setlistaBusqueda(listaBusquedaMap);
		}
	}, [dataApartados, dataEncargos]);
	useEffect(() => {
		if (urlFolio?.folio > 0) {
			history.push(`/${urlFolio.tipo}/${urlFolio.folio}`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlFolio]);

	const pasarAFechaVence = (item) => {
		let fecha = "Sin fecha";
		if (item?.vence) {
			fecha = moment.unix(item.vence / 1000).format("LL");
		} else {
			fecha = moment.unix(item.createAt / 1000).format("LL");
		}
		return fecha;
	};
	const selectItem = (folio, item) => {
		console.log(folio, item);
		seturlFolio({ folio: folio, tipo: item?.children[2]?.key });
	};
	const onFocus = (e) => {
		refetch();
		refetchEncargos();
	};
	const customizeRenderEmpty = () => (
		<div style={{ textAlign: "center" }}>
			<Result status='warning' title='No tengo esos datos' />
		</div>
	);
	const pressKeyBuscador = (e) => {
		if (e.keyCode === 27) {
			history.push("/");
			document?.querySelector("#inputPrecio")?.select();
		}
	};
	const fechaVenceEn = (item) => {
		var fecha = moment.unix(item.vence / 1000).fromNow();
		if (item.vence > Date.now()) {
			fecha = `Vence ${fecha}`;
		} else if (item.vence < Date.now()) {
			fecha = `Venció ${fecha}`;
		} else {
			fecha = moment.unix(item.createAt / 1000).fromNow();
			fecha = `Encargó ${fecha}`;
		}
		// this.vence = fecha;
		return fecha;
	};
	return (
		<>
			<ConfigProvider renderEmpty={customizeRenderEmpty}>
				<Select
					id='buscarApartadoInput'
					loading={loading || loadingEncargos}
					showSearch
					placeholder={
						loading || loadingEncargos ? (
							<SyncOutlined style={{ fontSize: 25 }} spin={true} />
						) : (
							"Busca Apartados y Encargos"
						)
					}
					optionFilterProp='children'
					onSelect={(folio, item) => selectItem(folio, item)}
					onKeyUp={pressKeyBuscador}
					// onSearch={(e) => setclienteName(e.toUpperCase())}
					onFocus={onFocus}
					filterOption={(input, option) =>
						option.children[0].key.indexOf(input) >= 0 ||
						option.children[1].key.toLowerCase().indexOf(input.toLowerCase()) >=
							0
					}
					onMouseOver={() =>
						document.querySelector("#buscarApartadoInput").select()
					}
					style={{
						width: 400,
						fontWeight: "bold",
						textAlignLast: "center",
						fontSize: "20px",
					}}
					// value={clienteName}
				>
					{listaBusqueda?.map((item) => {
						return (
							<Option
								value={item.folio}
								key={item.id}
								style={{ borderBottom: "solid #6893b4" }}
							>
								<Row justify='space-between' key={item.folio}>
									<h3
										style={
											item?.entregado[0]?.status === true ||
											item?.cancelado[0]?.status === false ||
											item?.cancelado?.status === true ||
											item?.entregado?.status === true
												? { color: "red" }
												: null
										}
									>
										{item.cliente}
									</h3>

									<h3
										style={
											item?.entregado[0]?.status === true ||
											item?.cancelado[0]?.status === false
												? { color: "red" }
												: null
										}
									>
										{item?.tipo?.toUpperCase()}: {item.folio}
									</h3>
								</Row>
								<h4
									key={item.cliente}
									style={
										item?.entregado[0]?.status === true ||
										item?.cancelado[0]?.status === false ||
										item?.entregado?.status === true ||
										item?.cancelado?.status === true
											? { color: "red" }
											: null
									}
								>
									<b>{fechaVenceEn(item)}</b>, {pasarAFechaVence(item)}
								</h4>
								<div key={item.tipo}></div>
							</Option>
						);
					})}
				</Select>
			</ConfigProvider>
		</>
	);
}
