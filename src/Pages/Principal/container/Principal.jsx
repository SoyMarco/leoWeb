/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import BarraMayorVenta from "../Components/BarraMayorVenta/BarraMayorVenta";
import TablaPrincipal from "../Components/TablaPrincipal/TablaPrincipal";
import Encabezado from "../Components/Encabezado/Encabezado";
import { useHistory, useLocation } from "react-router-dom";
import Cobrar from "../Components/Cobrar/Cobrar";
import { useApolloClient } from "@apollo/client";
import { FIRST_LOGIN } from "graphql/user";
import { Card } from "antd";
import "./principal.css";

function Principal() {
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
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [precio, setprecio] = useState({
		precio: null,
	});
	const [idArticulo, setidArticulo] = useState(0);
	const [listaCompras, setlistaCompras] = useState([]);
	const [totalTotal, settotalTotal] = useState(0);
	const [totalProductos, settotalProductos] = useState(0);
	const [stateRecord, setstateRecord] = useState(null);

	const initialState = () => {
		setmodalCobrar(false);
		setselectedRowKeys(0);
		setprecio({
			precio: null,
		});
		setidArticulo(0);
		setlistaCompras([]);
		settotalTotal(0);
		settotalProductos(0);
		setstateRecord(null);
	};
	useEffect(() => {
		var detectorPantalla = window.screen.width;
		if (detectorPantalla < 600) {
			history.push(`mobile/venta`);
		}
		selectInputPrecio();
	}, []);
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
		selectLastRow();
	}, [listaCompras.length]);

	useEffect(() => {
		if (modalCobrar === false) {
			document.querySelector("#inputPrecio").select();
		}
	}, [modalCobrar]);

	useEffect(() => {
		let sum = 0;
		let sumProd = 0;

		for (const itemComprar of listaCompras) {
			sum += itemComprar?.totalArticulo;
			sumProd += itemComprar?.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);
	}, [listaCompras]);

	useEffect(() => {
		setstateRecord({ key: selectedRowKeys[0] });
	}, [selectedRowKeys]);

	const selectInputPrecio = () => {
		setprecio({
			precio: null,
		});
		document.querySelector("#inputPrecio").select();
	};

	const handlePrecio = (e) => {
		setprecio({
			precio: e.target.value,
		});
	};
	const selectLastRow = () => {
		let ultimoArray = listaCompras.length;
		if (ultimoArray) {
			setselectedRowKeys([listaCompras[ultimoArray - 1].key]);
		}
	};
	const eliminarProducto = (item) => {
		let i = listaCompras.indexOf(item);
		if (i !== -1) {
			let key = listaCompras.splice(i, 1);
			setlistaCompras(listaCompras.filter((item2) => item2.key !== key));
			selectLastRow();
		} else if (item.key > 0) {
			let key = item.key;
			setlistaCompras(listaCompras.filter((item2) => item2.key !== key));
			selectLastRow();
		}
	};
	const addArticulo = (record) => {
		if (listaCompras.length > 0) {
			const currentShopList = [...listaCompras];
			const shopItem = currentShopList.find((item) => item.key === record.key);
			shopItem.cantidad = shopItem.cantidad + 1;
			shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
			const newShopList = [...currentShopList];
			setlistaCompras(newShopList);
		}
	};
	const removeArticulo = (record) => {
		if (listaCompras.length > 0) {
			const currentShopList = [...listaCompras];
			const shopItem = currentShopList.find((item) => item.key === record.key);

			if (shopItem.cantidad > 1) {
				shopItem.cantidad = shopItem.cantidad - 1;
				shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
				const newShopList = [...currentShopList];
				setlistaCompras(newShopList);
			} else if (shopItem.cantidad === 1) {
				eliminarProducto(record);
			}
		}
	};

	return (
		<>
			<title>{titleWeb}</title>

			<Card
				actions={[
					<h1
						style={{
							color: "darkblue",
							fontSize: "xx-large",
							fontWeight: "bold",
							marginTop: "-5px",
						}}
					>
						{totalProductos ? `Productos: ${totalProductos}` : null}
					</h1>,
					<></>,
					<h1
						style={{
							color: "green",
							fontSize: "65px",
							fontWeight: "bold",
							marginTop: "-20px",
							marginBottom: 0,
						}}
					>
						{totalProductos ? `$ ${totalTotal}` : null}
					</h1>,
				]}
				style={{ zIndex: 1 }}
			>
				<Encabezado
					precio={precio}
					setprecio={setprecio}
					handlePrecio={handlePrecio}
					setlistaCompras={setlistaCompras}
					listaCompras={listaCompras}
					setidArticulo={setidArticulo}
					idArticulo={idArticulo}
					setmodalCobrar={setmodalCobrar}
					selectedRowKeys={selectedRowKeys}
					setselectedRowKeys={setselectedRowKeys}
					removeArticulo={removeArticulo}
					addArticulo={addArticulo}
					stateRecord={stateRecord}
				/>

				<TablaPrincipal
					listaCompras={listaCompras}
					removeArticulo={removeArticulo}
					addArticulo={addArticulo}
					eliminarProducto={eliminarProducto}
					selectInputPrecio={selectInputPrecio}
					setselectedRowKeys={setselectedRowKeys}
					setstateRecord={setstateRecord}
					selectedRowKeys={selectedRowKeys}
				/>
			</Card>

			<BarraMayorVenta />

			{modalCobrar ? (
				<Cobrar
					modalCobrar={modalCobrar}
					setmodalCobrar={setmodalCobrar}
					totalTotal={totalTotal}
					listaCompras={listaCompras}
					initialState={initialState}
				></Cobrar>
			) : null}
		</>
	);
}

export default Principal;
