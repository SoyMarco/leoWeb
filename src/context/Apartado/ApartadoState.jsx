import { useState, useRef, useEffect, useContext } from "react";
import ShopListContext from "context/Shopping/ShopListContext";
import ApartadoContext from "./ApartadoContext";
import moment from "moment";

const ApartadoState = (props) => {
	const { setmodalCobrar, modalCobrar } = useContext(ShopListContext);

	const inputAbono = useRef();

	const [dataApartado, setdataApartado] = useState(null);
	const [abono, setabono] = useState({ abono: null });
	const [totalTotal, settotalTotal] = useState(0);
	const [totalAbonos, settotalAbonos] = useState(0);
	const [productos, setproductos] = useState([]);
	const [totalProductos, settotalProductos] = useState(0);
	const [abonos, setabonos] = useState([]);
	const [loader, setloader] = useState(false);
	const [statusApartado, setstatusApartado] = useState(false);
	const [titleWeb, settitleWeb] = useState("Apartado");
	const [venceEn, setvenceEn] = useState(null);
	const [colorVence, setcolorVence] = useState(
		"linear-gradient(#2196F3,#0000E6)"
	);
	const [imprimir, setimprimir] = useState(false);
	const [dataApartadoImprimir, setdataApartadoImprimir] = useState([]);
	const [modalCalendar, setmodalCalendar] = useState(false);
	const [cambioM, setcambio] = useState(0);
	const [inputsM, setinputs] = useState(0);
	const [modalAddProduct, setmodalAddProduct] = useState(false);

	useEffect(() => {
		if (modalCobrar === false && dataApartado) {
			inputAbono.current.select();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalCobrar]);

	useEffect(() => {
		if (dataApartado) {
			const {
				productos: productosGet,
				abonos: abonosGet,
				cliente,
				cancelado,
			} = dataApartado;

			let listaAbonos = [];
			for (const item of abonosGet) {
				if (item.cancel !== true) {
					listaAbonos.push(item);
				}
			}
			setabonos(listaAbonos);

			const listaProductos = productosGet.map((item) => {
				return { ...item, key: item._id };
			});
			setproductos(listaProductos);

			settitleWeb(cliente);
			const cancel = cancelado[0]?.status ?? true;
			setstatusApartado(cancel);

			//Otros
			fechaVenceEn();
			inputAbono.current.select();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataApartado]);
	useEffect(() => {
		if (dataApartadoImprimir?.folio > 0) {
			setimprimir(true);
		}
	}, [dataApartadoImprimir]);
	const fechaVenceEn = () => {
		const fecha = moment.unix(dataApartado.vence / 1000).fromNow();
		if (dataApartado.vence > Date.now()) {
			setvenceEn(`Vence ${fecha}`);
			//Color azul
			setcolorVence("linear-gradient(#2196F3,#0000E6)");
		} else {
			setvenceEn(`Venció ${fecha}`);
			//Color rojo
			setcolorVence("linear-gradient(#F53636,#D32F2F,#8B0000)");
		}
		return fecha;
	};

	useEffect(() => {
		let sum = 0;
		let sumProd = 0;
		for (const iterator of productos) {
			sum += iterator.totalArticulo;
			sumProd += iterator.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);

		let sumAbo = 0;

		for (const abn of abonos) {
			if (abn?.cancel?.status !== true) {
				sumAbo += abn.abono;
			}
		}
		settotalAbonos(sumAbo);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productos]);

	const calculateRestaria = () => {
		let addAbono = 0;
		if (parseInt(abono.abono) > 0) {
			addAbono = parseInt(abono.abono);
		}
		let restaría = 0;
		restaría = parseInt(totalTotal - (totalAbonos + addAbono)) ?? 0;
		return restaría;
	};
	const pasarAFecha = (item, L = "LLLL") => {
		return moment.unix(item / 1000).format(L);
	};

	const initialState = (data) => {
		setdataApartado(data.addAbono);
		setmodalCobrar(false);
		setabono({ abono: null });
		inputAbono.current.select();
	};

	return (
		<ApartadoContext.Provider
			value={{
				dataApartado,
				setdataApartado,
				inputAbono,
				calculateRestaria,
				abono,
				setabono,
				initialState,
				productos,
				setproductos,
				totalProductos,
				totalTotal,
				totalAbonos,
				abonos,
				setabonos,
				loader,
				setloader,
				statusApartado,
				setstatusApartado,
				titleWeb,
				settitleWeb,
				venceEn,
				setvenceEn,
				colorVence,
				setcolorVence,
				dataApartadoImprimir,
				setdataApartadoImprimir,
				imprimir,
				setimprimir,
				pasarAFecha,
				modalCalendar,
				setmodalCalendar,
				inputsM,
				setinputs,
				cambioM,
				setmodalCobrar,
				setcambio,
				modalAddProduct,
				setmodalAddProduct,
			}}
		>
			{props.children}
		</ApartadoContext.Provider>
	);
};

export default ApartadoState;
