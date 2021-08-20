import React, { useEffect, useState } from "react";
import { SaveFilled } from "@ant-design/icons";
import { GiLargeDress } from "react-icons/gi";
import { FaMoneyBillWave } from "react-icons/fa";
import { keyBlock } from "Utils";
import {
	Row,
	Button,
	Modal,
	Input,
	Form,
	Calendar,
	ConfigProvider,
} from "antd";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
import moment from "moment";
import "moment/locale/es-us";
import locale from "antd/lib/locale/es_ES";
import { useMutation } from "@apollo/client";
import { EDIT_VENCE_APARTADO } from "graphql/apartado";
import "./modalCalendar.css";
export default function ModalCalendar({
	setmodalCalendar,
	modalCalendar,
	refetch,
	dataApartado,
}) {
	const [mutateEDIT_VENCE_APARTADO] = useMutation(EDIT_VENCE_APARTADO);
	const { logout } = useAuth();
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
			ErrorConection(logout);
		}
	};
	const selectFecha = (value, dateString) => {
		console.log("selectFecha", value.unix(), "@@@@@@@", dateString);
		setnewFecha(value.unix() * 1000);
	};
	const pasarAFechaLL = (item) => {
		let fecha = moment.unix(item / 1000).format("LL");
		return fecha;
	};
	const selectVence = () => {
		let fechhhh = moment.unix(dataApartado?.vence / 1000).format("YYYY-MM-DD");
		fechhhh = moment(fechhhh);
		return fechhhh;
	};
	const fechaVenceEn = () => {
		var fecha = moment.unix(dataApartado.vence / 1000).fromNow();
		if (dataApartado.vence > Date.now()) {
			fecha = `Vence ${fecha}`;
			// this.colorVence = "#000058";
		} else {
			fecha = `Venció ${fecha}`;
			// this.colorVence = "red";
		}
		// this.vence = fecha;
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
