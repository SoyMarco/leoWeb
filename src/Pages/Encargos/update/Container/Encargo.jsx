import { useContext } from "react";
import ImprimirEncargo from "../Components/ImprimirEncargo/ImprimirEncargo";
import ModalCalendar from "../Components/ModalCalendar/ModalCalendar";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import CardEncargo from "../Components/CardEncargo/CardEncargo";
import CobrarEncargo from "../Components/Cobrar/CobrarEncargo";
import { Button, Result } from "antd";
import "./Encargo.css";

export default function Encargo() {
	const {
		dataEncargo,
		titleWeb,
		modalCalendar,
		modalCobrar,
		cancelEntrega,
		btnLoading,
		modalReimprimir,
		pasarAFecha,
	} = useContext(ReadEncargoContext);

	return (
		<>
			<title>{titleWeb}</title>

			{/* ENCARGO ENTREGADO */}
			{dataEncargo?.entregado[0]?.status && (
				<Result
					status='warning'
					title={`Este encargo se entregó el día ${pasarAFecha(
						dataEncargo?.entregado[0]?.fecha,
						"LLLL"
					)}, por ${dataEncargo?.entregado[0]?.vendedor?.toUpperCase()}`}
					extra={
						<Button
							type='primary'
							key='console'
							loading={btnLoading}
							onClick={() => cancelEntrega()}
						>
							Quitar entrega
						</Button>
					}
				/>
			)}

			{modalCobrar && <CobrarEncargo />}

			{modalCalendar && <ModalCalendar />}

			{modalReimprimir && <ImprimirEncargo />}

			<CardEncargo />
		</>
	);
}
