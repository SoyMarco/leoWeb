import { useState, useEffect, useRef } from "react";
import ReadEncargoContext from "./context";
import moment from "moment";
import { Form } from "antd";
import useBack from "../Service/useBack";

export default function ReadEncargoState({ children }) {
	const {
		guardarEncargo,
		cancelEntrega,
		borrarAbono,
		borrarEntregarProduct,
		savePrintNewV,
		cambiarFecha,
		data,
		loading,
		refetch,
		btnLoading,
		dataApartadoImprimir,
		dataEncargo,
		setdataEncargo,
		cambio,
		setcambio,
		initialState,
		abono,
		modalCobrar,
		setmodalCobrar,
		inputAbono,
		totalTotal,
		settotalTotal,
		calculateRestaria,
		totalAbonos,
		settotalAbonos,
		dinero,
		setdinero,
		newFecha,
		setnewFecha,
		modalCalendar,
		setmodalCalendar,
	} = useBack();

	const [totalProductos, settotalProductos] = useState(0);
	const [abonos, setabonos] = useState([]);
	const [productos, setproductos] = useState([]);
	const [titleWeb, settitleWeb] = useState("Encargo");
	const [statusEncargo, setstatusEncargo] = useState(false);
	const [modalReimprimir, setmodalReimprimir] = useState(false);
	const [colorVence, setcolorVence] = useState(
		"linear-gradient(#2196F3,#0000E6)"
	);

	const [form] = Form.useForm();
	const cobrarEfectivo = useRef();

	useEffect(() => {
		if (data?.getEncargoFolio[0]) {
			dataChange(data?.getEncargoFolio[0]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	useEffect(() => {
		if (modalCobrar === true) {
			form.setFieldsValue({ efectivo: totalTotal });
			OnValuesChange();
			cobrarEfectivo.current.select();
		} else if (modalCobrar === false) {
			inputAbono.current.select();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalCobrar]);

	const selectFecha = (value) => {
		setnewFecha(value.unix() * 1000);
	};

	const OnValuesChange = () => {
		let valores = form.getFieldsValue();
		if (!valores.efectivo) {
			valores.efectivo = 0;
		}
		if (!valores.tarjeta) {
			valores.tarjeta = 0;
		}
		if (!valores.aCuenta) {
			valores.aCuenta = 0;
		}
		let efectivo = parseFloat(valores.efectivo);
		let tarjeta = parseFloat(valores.tarjeta);
		let aCuenta = parseFloat(valores.aCuenta);
		let total = parseFloat(totalTotal);
		let sumaTodo = efectivo + tarjeta + aCuenta;
		let resultado = sumaTodo - total;

		setdinero({
			aCuenta: aCuenta,
			tarjeta: tarjeta,
			efectivo: efectivo,
		});
		setcambio(resultado);
	};

	const dataChange = (newData) => {
		setdataEncargo(newData);
		if (newData?.vence) {
			fechaVenceEn();
		}
		const {
			productos: productosSet,
			abonos: abonoSet,
			cliente,
			guardado,
		} = newData;

		const listaAbonos = abonoSet.map((item) => {
			return { ...item, key: item._id };
		});
		setabonos(listaAbonos);
		setproductos(productosSet);
		settitleWeb(cliente);
		setstatusEncargo(guardado.status);

		let sum = 0;
		let sumProd = 0;
		for (let iterator of productos) {
			sum += iterator.totalArticulo ?? 0;
			sumProd += iterator.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);

		let sumAbo = 0;
		for (let iterator of abonos) {
			sumAbo += iterator.abono;
		}
		settotalAbonos(sumAbo);
	};

	const fechaVenceEn = () => {
		let fecha = moment.unix(dataEncargo.vence / 1000).fromNow();
		if (dataEncargo.vence > Date.now()) {
			//Color azul
			setcolorVence("linear-gradient(#2196F3,#0000E6)");
		} else {
			//Color rojo
			setcolorVence("linear-gradient(#F53636,#D32F2F,#8B0000)");
		}
		return fecha;
	};

	const cerrarCobrar = () => {
		setmodalCobrar(false);
		inputAbono.current.select();
	};

	const pasarAFecha = (item, L) => {
		return moment.unix(item / 1000).format(L);
	};

	return (
		<ReadEncargoContext.Provider
			value={{
				dataEncargo,
				totalTotal,
				totalAbonos,
				refetch,
				loading,
				calculateRestaria,
				inputAbono,
				abono,
				modalCobrar,
				setmodalCobrar,
				initialState,
				guardarEncargo,
				cancelEntrega,
				btnLoading,
				borrarAbono,
				borrarEntregarProduct,
				savePrintNewV,
				dataApartadoImprimir,
				cambio,
				dinero,
				modalCalendar,
				setmodalCalendar,
				cambiarFecha,
				newFecha,
				abonos,
				productos,
				titleWeb,
				statusEncargo,
				totalProductos,
				colorVence,
				cerrarCobrar,
				modalReimprimir,
				setmodalReimprimir,
				pasarAFecha,
				cobrarEfectivo,
				OnValuesChange,
				form,
				selectFecha,
			}}
		>
			{children}
		</ReadEncargoContext.Provider>
	);
}
