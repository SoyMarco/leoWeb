import React, { useState, useContext } from "react";
import { SaveFilled } from "@ant-design/icons";
import { Row, Button, Modal, Calendar, ConfigProvider } from "antd";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import moment from "moment";
import "moment/locale/es-us";
import locale from "antd/lib/locale/es_ES";
import { useMutation } from "@apollo/client";
import { EDIT_VENCE_APARTADO } from "graphql/apartado";
import "./modalCalendar.css";
import AuthContext from "context/Auth/AuthContext";

export default function ModalCalendar({
	setmodalCalendar,
	modalCalendar,
	refetch,
	dataApartado,
}) {
	const { timeLogout } = useContext(AuthContext);
	const [mutateEDIT_VENCE_APARTADO] = useMutation(EDIT_VENCE_APARTADO);
	const [btnLoading, setbtnLoading] = useState(false);
	const [newFecha, setnewFecha] = useState(null);

	const cambiarFecha = async () => {
		setbtnLoading(true);
		try {
			if (dataApartado.id) {
				const { data } = await mutateEDIT_VENCE_APARTADO({
					// Parameters
					variables: {
						input: {
							id: dataApartado.id,
							vence: newFecha.toString(),
						},
					},
				});
				if (data) {
					openNotification("success", `Fecha modificada con exito`);
					refetch();
					setbtnLoading(false);
					setmodalCalendar(false);
				}
			}
		} catch (error) {
			setbtnLoading(false);
			ErrorConection(timeLogout);
		}
	};
	const selectFecha = (value, dateString) => {
		setnewFecha(value.unix() * 1000);
	};
	const pasarAFechaLL = (item) => {
		return moment.unix(item / 1000).format("LL");
	};
	const selectVence = () => {
		let fechhhh = moment.unix(dataApartado?.vence / 1000).format("YYYY-MM-DD");
		fechhhh = moment(fechhhh);
		return fechhhh;
	};
	const fechaVenceEn = () => {
		let fecha = moment.unix(dataApartado.vence / 1000).fromNow();
		if (dataApartado.vence > Date.now()) {
			fecha = `Vence ${fecha}`;
		} else {
			fecha = `Venció ${fecha}`;
		}
		return fecha;
	};

	return (
		<Modal
			style={{ top: 25 }}
			title='Cambiar fecha'
			visible={modalCalendar}
			// onOk={() => cambiarFecha()}
			onCancel={() => setmodalCalendar(false)}
			footer={[
				<Row justify='space-around'>
					<Button
						style={{
							//Boton Rojo
							background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
							color: "white",
							fontWeight: "bold",
							width: 230,
						}}
						shape='round'
						// loading={loading}
						// disabled={cambio < 0}
						onClick={() => setmodalCalendar(false)}
						// icon={<PrinterFilled />}
						loading={btnLoading}
					>
						Cancelar
					</Button>
					<Button
						style={
							newFecha
								? {
										//Boton Verde
										background: "linear-gradient(#32A632,#005800)",
										color: "white",
										fontWeight: "bold",
										width: 230,
								  }
								: {
										background: "grey",
										color: "white",
										fontWeight: "bold",
										width: 230,
								  }
						}
						shape='round'
						disabled={!newFecha}
						onClick={() => cambiarFecha()}
						icon={<SaveFilled />}
						loading={btnLoading}
					>
						{`Guardar (Enter)`}
					</Button>
				</Row>,
			]}
		>
			{dataApartado && (
				<h2 style={{ color: "black" }}>{`${fechaVenceEn()}, ${pasarAFechaLL(
					dataApartado.vence
				)}`}</h2>
			)}
			{newFecha && (
				<h2 style={{ color: "limegreen" }}>{`Nuevo vencimiento: ${pasarAFechaLL(
					newFecha
				)}`}</h2>
			)}

			<ConfigProvider locale={locale}>
				<Calendar
					fullscreen={false}
					onSelect={selectFecha}
					defaultValue={selectVence()}
				/>
			</ConfigProvider>
		</Modal>
	);
}
