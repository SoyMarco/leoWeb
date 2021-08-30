import React, { useEffect, useState } from "react";
import { Row, Select, ConfigProvider, Result } from "antd";
import "./buscarApartados.css";
import { useQuery } from "@apollo/client";
import { GET_APARTADOS_BUSCADOR } from "graphql/apartado";
import { GET_HEROKU_DESPIERTO } from "graphql/venta";
import moment from "moment";
import { useHistory } from "react-router-dom";

export default function BuscadorApartados() {
	let { data, loading, refetch } = useQuery(GET_APARTADOS_BUSCADOR);
	let { startPolling, stopPolling } = useQuery(GET_HEROKU_DESPIERTO);
	const [urlFolio, seturlFolio] = useState(0);
	// const [valueSearch, setvalueSearch] = useState("");
	const { Option } = Select;
	const history = useHistory();

	useEffect(() => {
		startPolling(300000);
		return () => {
			stopPolling();
		};
	}, [startPolling, stopPolling]);

	useEffect(() => {
		console.log(urlFolio);
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
	// const changeValue = (e) => {
	// 	// setvalueSearch(e);
	// };
	const onFocus = (e) => {
		refetch();
	};
	const customizeRenderEmpty = () => (
		<div style={{ textAlign: "center" }}>
			<Result status='warning' title='No tengo esos datos' />
		</div>
	);
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
					// onSearch={changeValue}
					onFocus={onFocus}
					filterOption={(input, option) =>
						option.children[0].key.indexOf(input) >= 0 ||
						option.children[1].key.toLowerCase().indexOf(input.toLowerCase()) >=
							0
					}
					style={{ width: 350, fontWeight: "bold" }}
				>
					{data?.getApartados.map((item) => {
						return (
							<Option value={item.folio}>
								<Row justify='space-between' key={item.folio}>
									<h3>{item.cliente}</h3>

									<h3>Folio:{item.folio}</h3>
								</Row>
								<h5 key={item.cliente}>
									Vence: {pasarAFechaVence(item.vence)}
								</h5>
							</Option>
						);
					})}
				</Select>
			</ConfigProvider>
		</>
	);
}
