import { useEffect, useState, useContext } from "react";
import { Row, Select, ConfigProvider, Result } from "antd";
import { GET_APARTADOS_BUSCADOR } from "myGraphql/apartado";
import AuthContext from "context/Auth/AuthContext";
import ErrorConection from "Utils/ErrorConection";
import { SyncOutlined } from "@ant-design/icons";
import { GET_ENCARGOS } from "myGraphql/encargo";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "./buscarApartados.css";
import moment from "moment";

const BuscadorApartados = () => {
	const { timeLogout } = useContext(AuthContext);
	const {
		data: dataApartados,
		loading,
		error: errorApartados,
		refetch,
	} = useQuery(GET_APARTADOS_BUSCADOR);
	const {
		data: dataEncargos,
		loading: loadingEncargos,
		error: errorEncargos,
		refetch: refetchEncargos,
	} = useQuery(GET_ENCARGOS);

	if (errorEncargos || errorApartados) {
		ErrorConection(timeLogout);
	}

	const [listaBusqueda, setlistaBusqueda] = useState([]);
	const [first, setfirst] = useState(undefined);
	const [urlFolio, seturlFolio] = useState({ folio: 0, tipo: "" });
	const { Option } = Select;
	const navigate = useNavigate();

	useEffect(() => {
		if (dataApartados && dataEncargos) {
			const { getApartados } = dataApartados;
			const { getEncargos } = dataEncargos;

			const listaApartadosMap = getApartados.map((item) => {
				return { ...item, tipo: "apartado" };
			});

			const listaEncargosMap = getEncargos.map((item) => {
				return { ...item, tipo: "encargo" };
			});

			setlistaBusqueda([...listaApartadosMap, ...listaEncargosMap]);
		}
	}, [dataApartados, dataEncargos]);
	useEffect(() => {
		if (urlFolio?.folio > 0) {
			navigate(`/${urlFolio.tipo}/${urlFolio.folio}`);
		}
		setfirst(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlFolio]);

	const pasarAFechaVence = (item) => {
		if (item?.vence) {
			return moment.unix(item.vence / 1000).format("LL");
		}
		return moment.unix(item.createAt / 1000).format("LL");
	};
	const selectItem = (folio, item) => {
		setfirst(folio);
		seturlFolio({ folio: folio, tipo: item?.children[2]?.key });
	};
	const onFocus = () => {
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
			navigate("/");
			document?.querySelector("#inputPrecio")?.select();
		}
	};
	const fechaVenceEn = (item) => {
		let fecha = moment.unix(item.vence / 1000).fromNow();
		if (item.vence > Date.now()) {
			fecha = `Vence ${fecha}`;
		} else if (item.vence < Date.now()) {
			fecha = `Venció ${fecha}`;
		} else {
			fecha = moment.unix(item.createAt / 1000).fromNow();
			fecha = `Encargó ${fecha}`;
		}
		return fecha;
	};
	return (
		<ConfigProvider renderEmpty={customizeRenderEmpty}>
			<Select
				value={first}
				allowClear={true}
				id='buscarApartadoInput'
				loading={loading || loadingEncargos}
				showSearch
				placeholder={
					loading || loadingEncargos ? (
						<SyncOutlined style={{ fontSize: 25 }} spin={true} />
					) : (
						"Buscar"
					)
				}
				optionFilterProp='children'
				onSelect={(folio, item) => selectItem(folio, item)}
				onKeyUp={pressKeyBuscador}
				// onSearch={(e) => setclienteName(e.toUpperCase())}
				onFocus={onFocus}
				filterOption={(input, option) =>
					option.children[0].key.indexOf(input) >= 0 ||
					option.children[1].key.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
				style={{
					width: "100%",
					fontWeight: "bold",
					textAlignLast: "center",
					fontSize: "20px",
				}}
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
	);
};
export default BuscadorApartados;
