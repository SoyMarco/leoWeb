import React, { useEffect, useState } from "react";
import { Row, Select, ConfigProvider, Result } from "antd";
import "./buscarApartados.css";
import { useQuery } from "@apollo/client";
import { GET_APARTADOS_BUSCADOR } from "graphql/apartado";
import moment from "moment";
import { useHistory } from "react-router-dom";

export default function BuscadorApartados() {
	let { data, loading, refetch } = useQuery(GET_APARTADOS_BUSCADOR);
	const [urlFolio, seturlFolio] = useState(0);
	// const [clienteName, setclienteName] = useState(null);
	const { Option } = Select;
	const history = useHistory();

	useEffect(() => {
		if (urlFolio > 1) {
			history.push(`/apartado/${urlFolio}`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlFolio]);

	const pasarAFechaVence = (item) => {
		let fecha = moment.unix(item / 1000).format("LL");
		return fecha;
	};
	const selectItem = (e) => {
		seturlFolio(e);
	};
	const onFocus = (e) => {
		refetch();
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
		} else {
			fecha = `Venció ${fecha}`;
		}
		// this.vence = fecha;
		return fecha;
	};
	return (
		<>
			<ConfigProvider renderEmpty={customizeRenderEmpty}>
				<Select
					id='buscarApartadoInput'
					loading={loading}
					showSearch
					placeholder='Busca Apartados'
					optionFilterProp='children'
					onSelect={(e) => selectItem(e)}
					onKeyUp={pressKeyBuscador}
					// onSearch={(e) => setclienteName(e.toUpperCase())}
					onFocus={onFocus}
					filterOption={(input, option) =>
						option.children[0].key.indexOf(input) >= 0 ||
						option.children[1].key.toLowerCase().indexOf(input.toLowerCase()) >=
							0
					}
					style={{
						width: 400,
						fontWeight: "bold",
						textAlignLast: "center",
						fontSize: "20px",
					}}
					// value={clienteName}
				>
					{data?.getApartados.map((item) => {
						return (
							<Option
								value={item.folio}
								key={item.id}
								style={{ borderBottom: "solid gray" }}
							>
								<Row justify='space-between' key={item.folio}>
									<h3
										style={
											item?.entregado[0]?.status === true ||
											item?.cancelado[0]?.status === false
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
										Folio: {item.folio}
									</h3>
								</Row>
								<h4
									key={item.cliente}
									style={
										item?.entregado[0]?.status === true ||
										item?.cancelado[0]?.status === false
											? { color: "red" }
											: null
									}
								>
									<b>{fechaVenceEn(item)}</b>, {pasarAFechaVence(item.vence)}
								</h4>
							</Option>
						);
					})}
				</Select>
			</ConfigProvider>
		</>
	);
}
