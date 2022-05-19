import { useState, useRef, useContext } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { REGISTER_VENTA, VENTA_F3 } from "myGraphql/venta";
import { useParams, useNavigate } from "react-router-dom";
import { openNotification } from "Utils/openNotification";
import AuthContext from "context/Auth/AuthContext";
import aceptar from "assets/sonido/Aceptar.wav";
import {
	GET_ENCARGO_FOLIO,
	CANCEL_ENTREGA,
	EDIT_GUARDAR_ENCARGO,
} from "myGraphql/encargo";
import {
	BORRAR_EDITAR_ABONO,
	CANCELAR_PRODUCTO_APARTDO,
	ADD_ABONO,
	EDIT_VENCE_APARTADO,
} from "myGraphql/apartado";

export default function useBack() {
	const { auth } = useContext(AuthContext);
	const params = useParams();
	const urlFolio = parseInt(params.folio);
	const { data, loading, refetch } = useQuery(GET_ENCARGO_FOLIO, {
		variables: { folio: urlFolio },
		notifyOnNetworkStatusChange: true,
	});
	const [mutateEDIT_GUARDAR_ENCARGO] = useMutation(EDIT_GUARDAR_ENCARGO);
	const [mutateCANCEL_ENTREGA] = useMutation(CANCEL_ENTREGA);
	const [mutateBORRAR_EDITAR_ABONO] = useMutation(BORRAR_EDITAR_ABONO);
	const [mutateCANCELAR_PRODUCTO_APARTDO] = useMutation(
		CANCELAR_PRODUCTO_APARTDO
	);
	const [mutateREGISTER_VENTA] = useMutation(REGISTER_VENTA);
	const [mutateADD_ABONO] = useMutation(ADD_ABONO);
	const [mutateEDIT_VENCE_APARTADO] = useMutation(EDIT_VENCE_APARTADO);

	const audio = new Audio(aceptar);
	const navigate = useNavigate();
	const client = useApolloClient();

	const [dataApartadoImprimir, setdataApartadoImprimir] = useState([]);
	const [btnLoading, setbtnLoading] = useState();
	const [dataEncargo, setdataEncargo] = useState(undefined);
	const [cambio, setcambio] = useState(0);
	const [abono, setabono] = useState({ abono: null });
	const [modalCobrar, setmodalCobrar] = useState(false);
	const inputAbono = useRef();
	const [totalTotal, settotalTotal] = useState(0);
	const [modalCalendar, setmodalCalendar] = useState(false);
	const [totalAbonos, settotalAbonos] = useState(0);
	const [dinero, setdinero] = useState({
		aCuenta: 0,
		tarjeta: 0,
		efectivo: 0,
	});
	const [newFecha, setnewFecha] = useState(null);

	const initialState = () => {
		refetch();
		setmodalCobrar(false);
		setabono({ abono: null });
		inputAbono.current.select();
	};
	const calculateRestaria = () => {
		let addAbono = 0;
		if (parseInt(abono.abono) > 0) {
			addAbono = parseInt(abono.abono);
		}

		return parseInt(totalTotal - (totalAbonos + addAbono)) ?? 0;
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
	const borrarAbono = async (record, borrarEditar) => {
		setbtnLoading(true);
		try {
			if (record._id) {
				const { dataBEA } = await mutateBORRAR_EDITAR_ABONO({
					// Parameters
					variables: {
						input: {
							_id: record._id,
							abono: 0,
							borrarEditar: borrarEditar,
							idVenta: record.idVenta,
							statusVenta: true,
						},
					},
				});
				if (dataBEA) {
					openNotification("success", `Abono borrado`);
					setbtnLoading(false);
					refetch();
				}
			}
		} catch (error) {
			setbtnLoading(false);
		}
	};
	const borrarEntregarProduct = async (item, borrarEntregar) => {
		if (btnLoading === false) {
			setbtnLoading(true);
			let status = true;
			if (item.entregado[0] && item.entregado[0].status) {
				status = !item.entregado[0].status;
			}
			try {
				if (item._id) {
					const { dataCPA } = await mutateCANCELAR_PRODUCTO_APARTDO({
						// Parameters
						variables: {
							input: {
								_id: item._id,
								status: status,
								borrarEntregar: borrarEntregar,
							},
						},
					});
					if (dataCPA) {
						if (borrarEntregar === "borrar") {
							openNotification("success", `Articulo borrado con exito`);
						} else if (borrarEntregar === "entregar") {
							openNotification("success", `Articulo modificado con exito`);
						}
						refetch();
						setTimeout(() => {
							setbtnLoading(false);
						}, 1000);
					}
				}
			} catch (error) {
				setbtnLoading(false);
			}
		}
	};
	//Guardar y/o Imprimir APARTADO CON GraphQL
	const savePrintAbono = async (keyF, dataVenta) => {
		if (cambio >= 0) {
			setbtnLoading(true);

			try {
				const { dataAA } = await mutateADD_ABONO({
					variables: {
						input: {
							id: dataEncargo.id,
							abono: parseFloat(totalTotal),
							resta: parseFloat(calculateRestaria()),
							idVenta: dataVenta.id,
							folioVenta: dataVenta.folio,
						},
					},
				});
				if (dataAA) {
					if (keyF === "F1") {
						setdataApartadoImprimir(dataAA.addAbono);
					} else if (keyF === "F2") {
						openNotification("success", "Apartado guardado con exito");
						initialState();
					}
					audio.play();
				}
			} catch (error) {
				setbtnLoading(false);
			}
		}
	};
	//Guardar y/o Imprimir VENTA CON GraphQL
	const savePrintNewV = async (keyF) => {
		if (btnLoading === false) {
			let efectivo = parseFloat(dinero.efectivo);
			let tarjeta = parseFloat(dinero.tarjeta);
			let aCuenta = parseFloat(dinero.aCuenta);
			let total = parseFloat(totalTotal);

			if (cambio >= 0) {
				setbtnLoading(true);
				let listaComprasNew = {
					apartado: dataEncargo.folio,
					cantidad: 1,
					idArray: dataEncargo.folio,
					key: dataEncargo.key,
					nombre: "APARTADO",
					precio: total,
					refApartado: dataEncargo.id,
					totalArticulo: total,
				};
				let ventaF123 = {
					productos: listaComprasNew,
					vendedor: auth.name,
					folio: 1,
					total: total,
					efectivo: efectivo,
					tarjeta: tarjeta,
					aCuenta: aCuenta,
					pagoCon: 0,
					referencia: dataEncargo.id,
					notas: "APARTADO",
				};
				if (keyF === "F3") {
					let queryF3 = client.readQuery({
						query: VENTA_F3,
					});
					if (!queryF3) {
						queryF3 = { ventaF3: [ventaF123] };
					} else {
						let arrayNew = [];
						for (let i = 0; i < queryF3.ventaF3.length; i++) {
							const element = queryF3.ventaF3[i];
							arrayNew.push(element);
						}
						arrayNew.push(ventaF123);

						queryF3 = { ventaF3: arrayNew };
					}

					client.writeQuery({
						query: VENTA_F3,
						data: queryF3,
						variables: {
							id: 5,
						},
					});

					navigate("/");
				} else {
					try {
						const { dataRV } = await mutateREGISTER_VENTA({
							variables: {
								input: ventaF123,
							},
						});
						if (dataRV) {
							savePrintAbono(keyF, dataRV.registerVenta);
						}
					} catch (error) {
						setbtnLoading(false);
					}
				}
			}
		}
	};
	const cambiarFecha = async () => {
		setbtnLoading(true);
		try {
			if (dataEncargo.id) {
				const { dataEditVA } = await mutateEDIT_VENCE_APARTADO({
					// Parameters
					variables: {
						input: {
							id: dataEncargo.id,
							vence: newFecha.toString(),
						},
					},
				});
				if (dataEditVA) {
					openNotification("success", `Fecha modificada con exito`);
					refetch();
					setbtnLoading(false);
					setmodalCalendar(false);
				}
			}
		} catch (error) {
			setbtnLoading(false);
		}
	};
	return {
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
		setabono,
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
	};
}
