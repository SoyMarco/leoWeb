import { useContext } from "react";
import { SaveFilled } from "@ant-design/icons";
import { Row, Button, Modal, Calendar, ConfigProvider } from "antd";
import moment from "moment";
import "moment/locale/es-us";
import locale from "antd/lib/locale/es_ES";
import "./modalCalendar.css";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";

export default function ModalCalendar() {
	const {
		setmodalCalendar,
		modalCalendar,
		btnLoading,
		dataEncargo,
		cambiarFecha,
		selectFecha,
		newFecha,
	} = useContext(ReadEncargoContext);

	const pasarAFechaLL = (item) => {
		return moment.unix(item / 1000).format("LL");
	};
	const selectVence = () => {
		let fechhhh = moment.unix(dataEncargo?.vence / 1000).format("YYYY-MM-DD");
		fechhhh = moment(fechhhh);
		return fechhhh;
	};
	const fechaVenceEn = () => {
		let fecha = moment.unix(dataEncargo.vence / 1000).fromNow();
		if (dataEncargo.vence > Date.now()) {
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
			{dataEncargo && (
				<h2 style={{ color: "black" }}>{`${fechaVenceEn()}, ${pasarAFechaLL(
					dataEncargo.vence
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
