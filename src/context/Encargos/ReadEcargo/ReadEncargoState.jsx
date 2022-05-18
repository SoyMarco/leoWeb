import { useState, useEffect, useRef } from "react";

import ReadEncargoContext from "./context";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import {
	GET_ENCARGO_FOLIO,
	CANCEL_ENTREGA,
	EDIT_GUARDAR_ENCARGO,
} from "myGraphql/encargo";
import { openNotification } from "Utils/openNotification";

export default function ReadEncargoState({ children }) {
	const params = useParams();
	const urlFolio = parseInt(params.folio);

	const { data, loading, refetch } = useQuery(GET_ENCARGO_FOLIO, {
		variables: { folio: urlFolio },
		notifyOnNetworkStatusChange: true,
	});
	const [mutateEDIT_GUARDAR_ENCARGO] = useMutation(EDIT_GUARDAR_ENCARGO);
	const [mutateCANCEL_ENTREGA] = useMutation(CANCEL_ENTREGA);

	const inputAbono = useRef();

	const [dataEncargo, setdataEncargo] = useState(undefined);
	const [abonos, setabonos] = useState([]);
	const [productos, setproductos] = useState([]);
	const [titleWeb, settitleWeb] = useState("Encargo");
	const [statusEncargo, setstatusEncargo] = useState(false);
	const [abono, setabono] = useState({ abono: null });
	const [totalAbonos, settotalAbonos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const [totalProductos, settotalProductos] = useState(0);
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [btnLoading, setbtnLoading] = useState();
	const [loader, setloader] = useState(false);
	const [modalReimprimir, setmodalReimprimir] = useState(false);
	const [colorVence, setcolorVence] = useState(
		"linear-gradient(#2196F3,#0000E6)"
	);
	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (data?.getEncargoFolio[0]) {
			setdataEncargo(data?.getEncargoFolio[0]);
			const {
				productos: productosSet,
				abonos: abonoSet,
				cliente,
				guardado,
			} = data?.getEncargoFolio[0];
			console.log("@@@@@productosSet", productosSet);

			const listaAbonos = abonoSet.map((item) => {
				return { ...item, key: item._id };
			});
			setabonos(listaAbonos);

			setproductos(productosSet);

			settitleWeb(cliente);
			setstatusEncargo(guardado.status);
		}
	}, [data]);
	useEffect(() => {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productos]);
	useEffect(() => {
		if (dataEncargo?.vence) {
			fechaVenceEn();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataEncargo?.vence]);

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
	const calculateRestaria = () => {
		let addAbono = 0;
		if (parseInt(abono.abono) > 0) {
			addAbono = parseInt(abono.abono);
		}

		return parseInt(totalTotal - (totalAbonos + addAbono)) ?? 0;
	};
	const initialState = () => {
		refetch();
		setmodalCobrar();
		setabono({ abono: null });
		inputAbono.current.select();
	};
	const cerrarCobrar = () => {
		setmodalCobrar(false);
		inputAbono.current.select();
	};

	const guardarEncargo = async () => {
		setbtnLoading(true);
		try {
			if (dataEncargo?.id) {
				const { data: dataEditGuardar } = await mutateEDIT_GUARDAR_ENCARGO({
					// Parameters
					variables: {
						input: {
							id: dataEncargo.id,
							status: !dataEncargo.guardado.status,
						},
					},
				});
				if (dataEditGuardar) {
					refetch();
					openNotification("success", `Se modificó con exito`);
					setbtnLoading(false);
				}
			}
		} catch (err) {
			console.log("error", err);
			setbtnLoading(false);
		}
	};
	const cancelEntrega = async () => {
		setbtnLoading(true);
		let status = dataEncargo?.entregado[0]?.status ?? false;
		try {
			if (dataEncargo.id) {
				let { data: dataCancelEntrega } = await mutateCANCEL_ENTREGA({
					// Parameters
					variables: {
						input: {
							id: dataEncargo.id,
							status: status,
						},
					},
				});
				if (dataCancelEntrega) {
					openNotification(
						"success",
						`Encargo ${status ? "ENTREGADO" : "REACTIVADO"}`
					);
					refetch();
					setbtnLoading(false);
				}
			}
		} catch (err) {
			setbtnLoading(false);
		}
	};
	const pasarAFecha = (item, L) => {
		return moment.unix(item / 1000).format(L);
	};
	return (
		<ReadEncargoContext.Provider
			value={{
				dataEncargo,
				setdataEncargo,
				abonos,
				productos,
				titleWeb,
				statusEncargo,
				refetch,
				loading,
				calculateRestaria,
				totalProductos,
				totalTotal,
				inputAbono,
				abono,
				totalAbonos,
				modalCobrar,
				setmodalCobrar,
				cerrarCobrar,
				initialState,
				guardarEncargo,
				cancelEntrega,
				btnLoading,
				loader,
				setloader,
				modalReimprimir,
				setmodalReimprimir,
				pasarAFecha,
				colorVence,
			}}
		>
			{children}
		</ReadEncargoContext.Provider>
	);
}
