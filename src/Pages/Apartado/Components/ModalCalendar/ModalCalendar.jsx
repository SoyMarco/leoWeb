import { useContext } from "react";
import { Row, Button, Modal, Calendar, ConfigProvider } from "antd";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { SaveFilled } from "@ant-design/icons";
import locale from "antd/lib/locale/es_ES";
import "./modalCalendar.css";
import "moment/locale/es-us";
import moment from "moment";

export default function ModalCalendar() {
	const {
		setmodalCalendar,
		modalCalendar,
		dataApartado,
		setnewFecha,
		newFecha,
		cambiarFecha,
		isLoading,
		pasarAFecha,
	} = useContext(ApartadoContext);

	const selectFecha = (value) => {
		setnewFecha(value.unix() * 1000);
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
						loading={isLoading}
						key='newRojoBtn'
					>
						Cancelar
					</Button>
					<Button
						style={{
							background: newFecha
								? "linear-gradient(#32A632,#005800)"
								: "grey",
							color: "white",
							fontWeight: "bold",
							width: 230,
						}}
						shape='round'
						disabled={!newFecha}
						onClick={() => cambiarFecha()}
						icon={<SaveFilled />}
						loading={isLoading}
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
				>{`${fechaVenceEn()}, ${pasarAFecha(dataApartado.vence, "LL")}`}</h2>
			)}
			{newFecha && (
				<h2
					key='newFechaH2'
					style={{ color: "limegreen" }}
				>{`Nuevo vencimiento: ${pasarAFecha(newFecha, "LL")}`}</h2>
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
