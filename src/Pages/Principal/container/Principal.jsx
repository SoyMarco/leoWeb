/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import BarraMayorVenta from "../Components/BarraMayorVenta/BarraMayorVenta";
import TablaPrincipal from "../Components/TablaPrincipal/TablaPrincipal";
import Encabezado from "../Components/Encabezado/Encabezado";
import { useHistory, useLocation } from "react-router-dom";
import Cobrar from "../Components/Cobrar/Cobrar";
import { useApolloClient } from "@apollo/client";
import { FIRST_LOGIN } from "graphql/user";
import { Card, Row } from "antd";
import ShopListContext from "context/Shopping/ShopListContext";
import "./principal.css";

function Principal() {
	const { shopList, clearShopList, selectedRowKeys, setselectedRowKeys } =
		useContext(ShopListContext);
	const client = useApolloClient();
	const history = useHistory();
	let firstLogin = client.readQuery({
		query: FIRST_LOGIN,
	});
	if (firstLogin?.firstLogin?.screenWidth > 600) {
		history.push("/caja");
		client.writeQuery({
			query: FIRST_LOGIN,
			data: { firstLogin: null },
		});
	}
	const Location = useLocation();
	const [titleWeb, settitleWeb] = useState("Leo Web");
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [totalTotal, settotalTotal] = useState(0);
	const [totalProductos, settotalProductos] = useState(0);
	const [stateRecord, setstateRecord] = useState(null);

	const initialState = () => {
		setselectedRowKeys(0);
		clearShopList();
		settotalTotal(0);
		settotalProductos(0);
		setstateRecord(null);
	};
	useEffect(() => {
		let detectorPantalla = window.screen.width;
		if (detectorPantalla < 600) {
			history.push(`mobile/venta`);
		}
		//selectInputPrecio
		document.querySelector("#inputPrecio").select();
	}, []);

	useEffect(() => {
		selectLastRow();
		if (shopList.length === 0) {
			setmodalCobrar(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shopList.length]);

	const selectLastRow = () => {
		let ultimoArray = shopList.length;
		if (ultimoArray) {
			setselectedRowKeys([shopList[ultimoArray - 1].key]);
		}
	};
	/* Cambiar titulo de pagina */
	useEffect(() => {
		if (Location.pathname === "/") {
			settitleWeb(`CUENTA: $${totalTotal}`);
		} else {
			let title = Location.pathname;
			title = title.toUpperCase();
			title = title.replace(/^./, "");
			settitleWeb(title);
		}
	}, [Location, totalTotal]);

	useEffect(() => {
		if (modalCobrar === false) {
			document.querySelector("#inputPrecio").select();
		}
	}, [modalCobrar]);

	useEffect(() => {
		let sum = 0;
		let sumProd = 0;

		for (const itemComprar of shopList) {
			sum += itemComprar?.totalArticulo;
			sumProd += itemComprar?.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);
	}, [shopList]);

	useEffect(() => {
		setstateRecord({ key: selectedRowKeys[0] });
	}, [selectedRowKeys]);

	return (
		<>
			<title>{titleWeb}</title>

			<Card actions={[]} style={{ zIndex: 1 }}>
				<Encabezado setmodalCobrar={setmodalCobrar} stateRecord={stateRecord} />

				<TablaPrincipal setstateRecord={setstateRecord} />

				<Row align='space-around'>
					<h1 className='numeroProductos'>
						{totalProductos ? `Productos: ${totalProductos}` : null}
					</h1>
					<h1 className='totalProductos'>
						{totalProductos ? `$ ${totalTotal}` : null}
					</h1>
				</Row>
			</Card>

			<BarraMayorVenta />

			{modalCobrar ? (
				<Cobrar
					modalCobrar={modalCobrar}
					setmodalCobrar={setmodalCobrar}
					totalTotal={totalTotal}
					initialState={initialState}
				></Cobrar>
			) : null}
		</>
	);
}

export default Principal;
