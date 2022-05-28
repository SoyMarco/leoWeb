/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useMemo } from "react";
import ApartadoEntregado from "../Components/ApartadoEntregado/ApartadoEntregado";
import ModalCalendar from "Pages/Apartado/Components/ModalCalendar/ModalCalendar";
import ImprimirApartado from "../Components/ImprimirApartado/ImprimirApartado";
import CardApartado from "../Components/CardApartado/CardApartado";
import ShopListContext from "context/Shopping/ShopListContext";
import ApartadoContext from "context/Apartado/ApartadoContext";
import AuthContext from "context/Auth/AuthContext";
import Cobrar from "../Components/Cobrar/Cobrar";

import ErrorPage from "Pages/Error/Error";
import { Skeleton } from "antd";
import "./apartados.css";

export default function Apartado() {
	const { modalCobrar } = useContext(ShopListContext);
	const { timeLogout } = useContext(AuthContext);
	const {
		dataApartado,
		titleWeb,
		modalCalendar,
		imprimir,
		setimprimir,
		abono,
		inputsM,
		cambioM,
		refetch,
		loading,
	} = useContext(ApartadoContext);

	useEffect(() => {
		refetch();
		timeLogout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const contentApartado = useMemo(() => {
		if (dataApartado?.id) {
			return <CardApartado />;
		} else if (loading) {
			return <Skeleton active />;
		}
		return <ErrorPage />;
	}, [dataApartado]);
	return (
		<>
			<title>{titleWeb}</title>

			{dataApartado?.entregado[0]?.status && <ApartadoEntregado />}

			{contentApartado}
			{modalCalendar && <ModalCalendar />}

			{modalCobrar && <Cobrar />}
			{imprimir && (
				<ImprimirApartado
					imprimir={imprimir}
					setimprimir={setimprimir}
					dataApartado={dataApartado}
					dinero={inputsM}
					cambio={cambioM}
					totalTotal={abono.abono}
				/>
			)}
		</>
	);
}
