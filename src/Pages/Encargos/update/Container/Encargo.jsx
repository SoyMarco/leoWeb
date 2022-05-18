import { useState, useContext } from "react";
import ImprimirEncargo from "../Components/ImprimirEncargo/ImprimirEncargo";
import ModalCalendar from "../Components/ModalCalendar/ModalCalendar";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import CardEncargo from "../Components/CardEncargo/CardEncargo";
import CobrarEncargo from "../Components/Cobrar/CobrarEncargo";
import AuthContext from "context/Auth/AuthContext";
import { Button, Result } from "antd";
import "./Encargo.css";

export default function Encargo() {
	const { auth } = useContext(AuthContext);
	const {
		dataEncargo,
		titleWeb,
		refetch,
		inputAbono,
		abono,
		modalCobrar,
		setmodalCobrar,
		cerrarCobrar,
		initialState,
		calculateRestaria,
		cancelEntrega,
		btnLoading,
		modalReimprimir,
		setmodalReimprimir,
		pasarAFecha,
	} = useContext(ReadEncargoContext);

	const [modalCalendar, setmodalCalendar] = useState(false);

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
			{/* MODAL ENCARGO */}
			{modalCobrar ? (
				<CobrarEncargo
					modalCobrar={modalCobrar}
					setmodalCobrar={setmodalCobrar}
					cerrarCobrar={cerrarCobrar}
					totalTotal={abono.abono}
					listaCompras={dataEncargo}
					initialState={initialState}
					calculateRestaria={calculateRestaria}
					dataEncargo={dataEncargo}
					inputAbono={inputAbono}
				></CobrarEncargo>
			) : null}
			{/* MODAL CALENDARIO */}
			{modalCalendar && (
				<ModalCalendar
					setmodalCalendar={setmodalCalendar}
					modalCalendar={modalCalendar}
					refetch={refetch}
					dataEncargo={dataEncargo}
				/>
			)}
			{/* MODAL REIMPRIMIR */}
			{modalReimprimir ? (
				<ImprimirEncargo
					imprimir={modalReimprimir}
					setimprimir={setmodalReimprimir}
					totalTotal={abono.abono}
					listaCompras={dataEncargo}
					initialState={initialState}
					calculateRestaria={calculateRestaria}
					dataEncargo={dataEncargo}
					auth={auth}
				/>
			) : null}
			<CardEncargo />
		</>
	);
}
