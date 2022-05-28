import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
	GET_PRODUCTOS_FOLIO,
	CANCELAR_APARTADO,
	CANCELAR_PRODUCTO_APARTDO,
	BORRAR_EDITAR_ABONO,
	EDIT_VENCE_APARTADO,
	ADD_PRODUCTO,
	ADD_ABONO,
} from "myGraphql/apartado";
import useService from "Hooks/Service/useService";
import { openNotification } from "Utils/openNotification";
import ShopListContext from "context/Shopping/ShopListContext";

export default function useBack({
	dataApartado,
	setdataApartado,
	statusApartado,
	initialState,
	calculateRestaria,
	setdataApartadoImprimir,
}) {
	const { addProductShopList, totalTotal } = useContext(ShopListContext);

	const params = useParams();
	const urlFolio = parseInt(params.folio);
	const navigate = useNavigate();

	const { data, loading, refetch } = useQuery(GET_PRODUCTOS_FOLIO, {
		variables: { folio: urlFolio },
		notifyOnNetworkStatusChange: true,
	});

	const [mutateCANCELAR_APARTADO] = useMutation(CANCELAR_APARTADO);
	const [mutateCANCELAR_PRODUCTO_APARTDO] = useMutation(
		CANCELAR_PRODUCTO_APARTDO
	);
	const [mutateBORRAR_EDITAR_ABONO] = useMutation(BORRAR_EDITAR_ABONO);
	const [mutateEDIT_VENCE_APARTADO] = useMutation(EDIT_VENCE_APARTADO);
	const [mutateADD_PRODUCTO] = useMutation(ADD_PRODUCTO);
	const [mutateADD_ABONO] = useMutation(ADD_ABONO);

	const { register, isLoading } = useService();

	const [newFecha, setnewFecha] = useState(null);
	const [modalCalendar, setmodalCalendar] = useState(false);
	const [nombre, setnombre] = useState("");
	const [precio, setprecio] = useState(0);
	const [modalAddProduct, setmodalAddProduct] = useState(false);
	const [cambioM, setcambio] = useState(0);
	const [inputsM, setinputs] = useState(0);

	useEffect(() => {
		console.log("algo1@@@@", data);
		if (data) {
			setdataApartado(data?.getProductosFolio);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const cancelarApartado = async () => {
		const dataCA = await register({
			mutate: mutateCANCELAR_APARTADO,
			input: {
				id: dataApartado.id,
				status: !statusApartado,
			},
		});
		if (dataCA) {
			openNotification(
				"success",
				`Apartado ${statusApartado ? "CANCELADO" : "REACTIVADO"}`
			);
		}
	};

	const borrarEntregarProduct = async (item, borrarEntregar) => {
		if (isLoading === false) {
			const isEntregado = item.entregado[0];
			let status = true;
			if (isEntregado && isEntregado.status) {
				status = !isEntregado.status;
			}
			const dataCPA = await register({
				mutate: mutateCANCELAR_PRODUCTO_APARTDO,
				input: {
					_id: item._id,
					status: status,
					borrarEntregar: borrarEntregar,
				},
			});

			if (dataCPA) {
				if (borrarEntregar === "borrar") {
					openNotification("success", `Articulo borrado con exito`);
					return;
				}
				openNotification("success", `Articulo modificado con exito`);
			}
		}
	};

	const borrarAbono = async (record, borrarEditar) => {
		if (record) {
			const dataBEA = await register({
				mutate: mutateBORRAR_EDITAR_ABONO,
				input: {
					abono: record.abono,
					borrarEditar: borrarEditar,
					idVenta: record.idVenta,
					idAbono: record._id,
					idApartado: dataApartado.id,
					statusVenta: record.cancel,
				},
			});

			if (dataBEA) openNotification("success", `Abono borrado`);
		}
	};

	const cambiarFecha = async () => {
		if (dataApartado.id) {
			const dataEVA = await register({
				mutate: mutateEDIT_VENCE_APARTADO,
				input: {
					id: dataApartado.id,
					vence: newFecha.toString(),
				},
			});
			if (dataEVA) {
				openNotification("success", `Fecha modificada con exito`);
				setmodalCalendar(false);
			}
		}
	};

	const addProducto = async () => {
		const idApartado = dataApartado.id;
		if (isLoading === false && idApartado) {
			const dataAddProd = await register({
				mutate: mutateADD_PRODUCTO,
				input: {
					id: idApartado,
					nombre: nombre,
					precio: parseFloat(precio),
				},
			});
			if (dataAddProd) {
				openNotification("success", `Agregaste "${nombre}"`);
				setmodalAddProduct(false);
			}
		}
	};

	const saveAndPrint = async ({ keyF, inputs, cambio }) => {
		setcambio(cambio);
		setinputs(inputs);
		if (cambio >= 0 && isLoading === false) {
			if (keyF === "F3") {
				addProductShopList({
					nombre: dataApartado.cliente,
					precio: parseFloat(totalTotal),
					apartado: dataApartado.folio,
					refApartado: dataApartado.id,
					f3: true,
				});
				navigate("/");
				initialState([]);

				return;
			}

			const dataSend = {
				id: dataApartado.id,
				abono: parseFloat(totalTotal),
				resta: parseFloat(calculateRestaria()),
				ventaEfectivo: parseFloat(inputs?.efectivo ?? 0),
				ventaTarjeta: parseFloat(inputs?.tarjeta ?? 0),
				ventaACuenta: parseFloat(inputs?.aCuenta ?? 0),
				folioApartado: dataApartado.folio,
				idApartado: dataApartado.id,
				nombreCliente: dataApartado.cliente,
				keyF: keyF,
			};

			const dataAA = await register({
				input: dataSend,
				mutate: mutateADD_ABONO,
				// keyF,
			});
			if (dataAA) {
				openNotification(
					"success",
					`Agregaste $${totalTotal} a ${dataApartado.cliente}`
				);
				if (keyF === "F1") {
					setdataApartadoImprimir(dataAA.addAbono);
				} else if (keyF === "F2") {
					initialState();
				}
			}
		}
	};
	return {
		refetch,
		isLoading,
		loading,
		newFecha,
		modalCalendar,
		addProducto,
		setmodalCalendar,
		borrarAbono,
		setnewFecha,
		cancelarApartado,
		cambiarFecha,
		borrarEntregarProduct,
		nombre,
		setnombre,
		precio,
		setprecio,
		modalAddProduct,
		setmodalAddProduct,
		saveAndPrint,
		cambioM,
		inputsM,
	};
}
