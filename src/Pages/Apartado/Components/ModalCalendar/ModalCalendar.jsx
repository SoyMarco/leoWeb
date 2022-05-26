import { useState, useContext } from "react";
import { Row, Button, Modal, Calendar, ConfigProvider } from "antd";
import useService from "Hooks/Service/useService";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { openNotification } from "Utils/openNotification";
import { EDIT_VENCE_APARTADO } from "myGraphql/apartado";
import { SaveFilled } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import locale from "antd/lib/locale/es_ES";
import "./modalCalendar.css";
import "moment/locale/es-us";
import moment from "moment";

export default function ModalCalendar({ refetch }) {
	const { setmodalCalendar, modalCalendar, dataApartado } =
		useContext(ApartadoContext);
	const { register } = useService();
	const [mutateEDIT_VENCE_APARTADO] = useMutation(EDIT_VENCE_APARTADO);

	const [btnLoading, setbtnLoading] = useState(false);
	const [newFecha, setnewFecha] = useState(null);

	const cambiarFecha = async () => {
		if (dataApartado.id) {
			const data = await register({
				mutate: mutateEDIT_VENCE_APARTADO,
				input: {
					id: dataApartado.id,
					vence: newFecha.toString(),
				},
			});
			if (data) {
				refetch();
				openNotification("success", `Fecha modificada con exito`);
				setbtnLoading(false);
				setmodalCalendar(false);
			}
		}
	};
	const selectFecha = (value) => {
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
			onCancel={() => setmodalCalendar(false)}
			footer={[
				<Row justify='space-around' key='newGuardarRow'>
					<Button
						style={{
							//Boton Rojo
							background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
							color: "white",
							fontWeight: "bold",
							width: 230,
						}}
						shape='round'
						onClick={() => setmodalCalendar(false)}
						loading={btnLoading}
						key='newRojoBtn'
					>
						Cancelar
					</Button>
					<Button
						style={
							newFecha
								? {
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
						key='newGuardarBtn'
					>
						{`Guardar (Enter)`}
					</Button>
				</Row>,
			]}
		>
			{dataApartado && (
				<h2
					key='newApartadoH2'
					style={{ color: "black" }}
				>{`${fechaVenceEn()}, ${pasarAFechaLL(dataApartado.vence)}`}</h2>
			)}
			{newFecha && (
				<h2
					key='newFechaH2'
					style={{ color: "limegreen" }}
				>{`Nuevo vencimiento: ${pasarAFechaLL(newFecha)}`}</h2>
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
