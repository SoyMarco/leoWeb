/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useContext, useMemo } from "react";
import ShopListContext from "context/Shopping/ShopListContext";
import { openNotification } from "Utils/openNotification";
import AuthContext from "context/Auth/AuthContext";
import logoLeo from "Pages/Principal/Utils/images";
import { useReactToPrint } from "react-to-print";
import "moment/locale/es-us";
import moment from "moment";
import { Row } from "antd";
import "./imprimir.css";

const Imprimir = ({ cambio, dinero, folio }) => {
	const { auth } = useContext(AuthContext);

	const { imprimir, totalTotal, initialState, shopList } =
		useContext(ShopListContext);

	const { aCuenta, tarjeta, efectivo } = dinero;
	const imprimirVenta = useRef();

	useEffect(() => {
		if (imprimir === true) {
			handlePrint();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imprimir]);

	const afterPrint = () => {
		initialState();
		openNotification("success", "Venta guardada con exito");
	};
	const tabla = useMemo(
		() =>
			shopList.map((item) => (
				<table key={`tableProcutVenta${item.key}`} className='productos'>
					<tbody>
						<tr>
							<td>
								{item.apartado > 0 ? `APARTADO ${item.apartado}` : item.nombre}
							</td>
							<td>
								<h3 className={item.cantidad > 1 ? null : "finalTicket"}>
									${item.precio}
								</h3>
							</td>
						</tr>
						{item.cantidad > 1 && (
							<tr>
								<td>X{item.cantidad}</td>
								<td>
									<h3 className='finalTicket'>${item.totalArticulo}</h3>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			)),
		[shopList]
	);
	const handlePrint = useReactToPrint({
		content: () => imprimirVenta.current,
		onAfterPrint: () => afterPrint(),
	});
	return (
		<div style={{ visibility: "hidden" }}>
			<div
				id='tickets'
				className='ticket'
				name='tickets'
				ref={imprimirVenta}
				style={{ width: "229px" }}
			>
				{/*  LOGO LEO  */}
				<img src={logoLeo} />
				{/* <!-- FECHA --> */}
				<br />
				<span style={{ paddingLeft: "0px" }}>ROPA Y ACCESORIOS</span>
				<br />
				<span>
					{moment().format("lll")} <br />
				</span>
				{/* <!-- VENDEDOR --> */}
				<span>{`Vendedor: ${auth.name.toUpperCase()}`}</span>
				<br />

				{/* <!-- TICKET --> */}
				<span>
					{`Ticket: ${folio}`}
					<br />
				</span>

				{/* <!-- TABLA DE PRODUCTOS --> */}
				<h3 className='subtituloTicketApartado'>
					<u> Productos</u>
				</h3>
				{tabla}
				{/* <!-- FIN TABLA DE PRODUCTOS --> */}

				{/* <!-- TOTAL --> */}
				<Row className='finalTicket'>
					<h3>Total:</h3>
					<h2>${totalTotal}</h2>
				</Row>
				{/* <!-- EFECTIVO --> */}
				{efectivo > 0 ? (
					<Row className='finalTicket'>
						<h3>Efectivo:</h3>
						<h2>${efectivo}</h2>
					</Row>
				) : null}
				{/* <!-- TARJETA --> */}
				{tarjeta ? (
					<Row className='finalTicket'>
						<h3>Tarjeta:</h3>
						<h2>${tarjeta}</h2>
					</Row>
				) : null}
				{/* <!-- A CUENTA --> */}
				{aCuenta ? (
					<Row className='finalTicket'>
						<h3>A cueta:</h3>
						<h2>${aCuenta}</h2>
					</Row>
				) : null}
				{/* <!-- CAMBIO --> */}
				<Row className='cambio'>
					<h3>Cambio: </h3>
					<h2>${cambio}</h2>
				</Row>
			</div>
		</div>
	);
};
export default Imprimir;
