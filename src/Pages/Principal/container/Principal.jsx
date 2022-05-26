/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import BarraMayorVenta from "../Components/BarraMayorVenta/BarraMayorVenta";
import TablaPrincipal from "../Components/TablaPrincipal/TablaPrincipal";
import Encabezado from "../Components/Encabezado/Encabezado";
import { useNavigate, useLocation } from "react-router-dom";
import Cobrar from "../Components/Cobrar/Cobrar";
import { Card, Row } from "antd";
import ShopListContext from "context/Shopping/ShopListContext";
import "./principal.css";
import AuthContext from "context/Auth/AuthContext";

const Principal = () => {
	const { firstLogin } = useContext(AuthContext);
	const { totalTotal, totalProductos, modalCobrar, calcularTotales } =
		useContext(ShopListContext);

	const navigate = useNavigate();
	const Location = useLocation();

	const [titleWeb, settitleWeb] = useState("Leo Web");

	useEffect(() => {
		if (firstLogin) {
			return navigate(`/caja`);
		}

		const detectorPantalla = window.screen.width;
		if (detectorPantalla < 600) {
			return navigate(`mobile/venta`);
		}
		calcularTotales();
		//selectInputPrecio
		document.querySelector("#inputPrecio").select();
	}, []);

	/* Cambiar titulo de pagina */
	useEffect(() => {
		if (Location.pathname === "/") {
			settitleWeb(`CUENTA: $${totalTotal}`);
		} else {
			const title = Location.pathname.toUpperCase().replace(/^./, "");
			settitleWeb(title);
		}
	}, [Location, totalTotal]);

	useEffect(() => {
		if (modalCobrar === false) {
			document.querySelector("#inputPrecio").select();
		}
	}, [modalCobrar]);

	return (
		<>
			<title>{titleWeb}</title>

			<Card style={{ zIndex: 1 }}>
				<Encabezado />
				<TablaPrincipal />
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

			{modalCobrar && <Cobrar />}
		</>
	);
};

export default Principal;
