/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "context/Auth/AuthContext";
import ReadEncargoContext from "./context";
import moment from "moment";
import { Form } from "antd";
import useBack from "../Service/useBack";
import { useNavigate } from "react-router-dom";
import ShopListContext from "context/Shopping/ShopListContext";

export default function ReadEncargoState({ children }) {
	const { isLoading } = useContext(AuthContext);
	const { settotalTotal, setmodalCobrar, modalCobrar } =
		useContext(ShopListContext);

	const [cantidadProductos, setcantidadProductos] = useState(0);
	const [abonos, setabonos] = useState([]);
	const [productos, setproductos] = useState([]);
	const [restaria, setrestaria] = useState(0);
	const [resta, setresta] = useState(0);
	const [titleWeb, settitleWeb] = useState("Encargo");
	const [statusEncargo, setstatusEncargo] = useState(false);
	const [modalReimprimir, setmodalReimprimir] = useState(false);
	const [dataEncargo, setdataEncargo] = useState(undefined);
	const [newAbono, setnewAbono] = useState(null);
	const [totalProductos, settotalProductos] = useState(0);
	const [modalCalendar, setmodalCalendar] = useState(false);
	const [totalAbonos, settotalAbonos] = useState(0);
	const [encargoSelect, setencargoSelect] = useState(undefined);
	const [newFecha, setnewFecha] = useState(null);
	const [openModal, setopenModal] = useState(false);
	const [cambio, setcambio] = useState(0);
	const [inputs, setinputs] = useState({});
	const [dataImprimir, setdataImprimir] = useState(false);
	const [colorVence, setcolorVence] = useState(
		"linear-gradient(#2196F3,#0000E6)"
	);

	const inputAbono = useRef();
	const cobrarEfectivo = useRef();
	const [form] = Form.useForm();
	const navigate = useNavigate();

	const selectFecha = (value) => {
		setnewFecha(value.unix() * 1000);
	};

	const dataChange = (newData) => {
		const {
			productos: productosSet,
			abonos: abonoSet,
			cliente,
			guardado,
			vence,
		} = newData;

		setabonos(abonoSet);
		setproductos(productosSet);
		setdataEncargo(newData);
		fechaVenceEn(vence);
		settitleWeb(cliente);
		setstatusEncargo(guardado?.status);
	};
	useEffect(() => {
		operacionesPrincipales();
	}, [productos, abonos]);

	useEffect(() => {
		calcularRestaria();
	}, [newAbono, resta]);

	const operacionesPrincipales = () => {
		let sum = 0;
		let sumProd = 0;
		for (let iterator of productos) {
			sum += iterator.precio * iterator.cantidad ?? 0;
			sumProd += iterator.cantidad;
		}
		settotalProductos(sum);
		setcantidadProductos(sumProd);

		let sumAbo = 0;
		for (let iterator of abonos) {
			sumAbo += iterator.abono;
		}
		settotalAbonos(sumAbo);

		setresta(parseInt(sum - sumAbo) ?? 0);
	};
	const calcularRestaria = () => {
		const addAbono = parseInt(newAbono > 0 ? newAbono : 0);
		setrestaria(resta - addAbono);
	};

	const fechaVenceEn = (vence) => {
		if (vence > Date.now()) {
			//Color azul
			setcolorVence("linear-gradient(#2196F3,#0000E6)");
		} else {
			//Color rojo
			setcolorVence("linear-gradient(#F53636,#D32F2F,#8B0000)");
		}
	};

	const cerrarCobrar = () => {
		setmodalCobrar(false);
		inputAbono.current.select();
	};

	const pasarAFecha = (item, L) => {
		return moment.unix(item / 1000).format(L);
	};
	const initialState = () => {
		refetch();
		setmodalCobrar(false);
		setnewAbono(null);
		inputAbono.current.select();
	};
	const closeModal = () => {
		setencargoSelect(false);
		setopenModal(false);
		form.resetFields();
		inputAbono.current.select();
	};
	const onFinish = () => {
		if (openModal === "UPDATE") {
			allBACK.updateProductosEncargo({ form, encargoSelect, closeModal });
			return;
		}
		allBACK.addProductosEncargo({ form, closeModal });
	};
	const pressEnter = () => {
		if (newAbono > 0 && restaria >= 0) {
			settotalTotal(newAbono);
			setmodalCobrar(true);
		}
	};
	const pressKeyAbono = (e) => {
		if (e.keyCode === 13) {
			pressEnter();
		}
		// ESC
		if (e.keyCode === 27) {
			if (newAbono > 0) {
				setnewAbono(null);
			} else {
				navigate("/");
			}
		}
		// Reimprimir
		if (e.keyCode === 112) {
			setdataImprimir(dataEncargo);
		}
		// F2
		if (e.keyCode === 123) {
			pressEnter();
		}
		// F6 abrir ventana
		if (e.keyCode === 117) {
			document.getElementById("linkNewWindow").click();
		}
		// Cuenta
		if (e.keyCode === 67) {
			navigate("/");
		}
	};
	const { refetch, ...allBACK } = useBack({ dataChange, dataEncargo });
	return (
		<ReadEncargoContext.Provider
			value={{
				dataEncargo,
				setdataEncargo,
				totalProductos,
				totalAbonos,
				resta,
				restaria,
				inputAbono,
				newAbono,
				setnewAbono,
				modalCobrar,
				setmodalCobrar,
				initialState,
				modalCalendar,
				setmodalCalendar,
				newFecha,
				abonos,
				productos,
				titleWeb,
				statusEncargo,
				cantidadProductos,
				colorVence,
				cerrarCobrar,
				modalReimprimir,
				setmodalReimprimir,
				pasarAFecha,
				cobrarEfectivo,
				form,
				selectFecha,
				encargoSelect,
				setencargoSelect,
				openModal,
				setopenModal,
				dataChange,
				closeModal,
				onFinish,
				pressKeyAbono,
				isLoading,
				cambio,
				setcambio,
				inputs,
				setinputs,
				dataImprimir,
				setdataImprimir,
				...allBACK,
			}}
		>
			{children}
		</ReadEncargoContext.Provider>
	);
}
