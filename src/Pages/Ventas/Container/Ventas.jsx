import { useContext, useEffect } from "react";
import { TablaProductos, TablaVentas, ImprimirVenta } from "../Components";
import VentasContext from "Pages/Ventas/Context/context";
import "./ventas.css";

export default function Ventas() {
	const { refetch, imprimir } = useContext(VentasContext);

	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<h1 className='tituloVentas'>Ventas</h1>
			<TablaVentas />

			<TablaProductos />
			{imprimir && <ImprimirVenta />}
		</>
	);
}
