import { useEffect, useContext } from "react";
import ApartadoEntregado from "../Components/ApartadoEntregado/ApartadoEntregado";
import ModalCalendar from "Pages/Apartado/Components/ModalCalendar/ModalCalendar";
import ImprimirApartado from "../Components/ImprimirApartado/ImprimirApartado";
import CardApartado from "../Components/CardApartado/CardApartado";
import ShopListContext from "context/Shopping/ShopListContext";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { GET_PRODUCTOS_FOLIO } from "myGraphql/apartado";
import AuthContext from "context/Auth/AuthContext";
import ErrorConection from "Utils/ErrorConection";
import Cobrar from "../Components/Cobrar/Cobrar";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import ErrorPage from "Pages/Error/Error";
import { Skeleton } from "antd";
import "./apartados.css";

export default function Apartado() {
	const { timeLogout } = useContext(AuthContext);
	const {
		dataApartado,
		setdataApartado,
		titleWeb,
		statusApartado,
		modalCalendar,
		imprimir,
		setimprimir,
		dataApartadoImprimir,
		abono,
		inputsM,
		cambioM,
	} = useContext(ApartadoContext);
	const { modalCobrar } = useContext(ShopListContext);

	const params = useParams();
	const urlFolio = parseInt(params.folio);

	const {
		data: getApartadoFolio,
		loading,
		error,
		refetch,
	} = useQuery(GET_PRODUCTOS_FOLIO, {
		variables: { folio: urlFolio },
		notifyOnNetworkStatusChange: true,
	});
	if (error) {
		ErrorConection(timeLogout);
	}

	useEffect(() => {
		refetch();
		timeLogout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (getApartadoFolio) {
			setdataApartado(getApartadoFolio?.getProductosFolio);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getApartadoFolio]);

	const renderLoading = () => {
		if (dataApartado?.id) {
			return <CardApartado refetch={refetch} loading={loading} />;
		} else if (loading) {
			return <Skeleton active />;
		}
		return <ErrorPage />;
	};
	return (
		<>
			<title>{titleWeb}</title>

			{!statusApartado && dataApartado && (
				<ApartadoEntregado refetch={refetch} />
			)}
			{renderLoading()}
			{modalCobrar && <Cobrar />}
			{modalCalendar && <ModalCalendar refetch={refetch} />}
			{console.log("princial", dataApartadoImprimir, dataApartado)}
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
