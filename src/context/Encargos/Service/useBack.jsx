import { useState, useContext, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { REGISTER_VENTA, VENTA_F3 } from "myGraphql/venta";
import { useParams, useNavigate } from "react-router-dom";
import { openNotification } from "Utils/openNotification";
import AuthContext from "context/Auth/AuthContext";
import useService from "Hooks/Service/useService";
import aceptar from "assets/sonido/Aceptar.wav";
import {
	GET_ENCARGO_FOLIO,
	CANCEL_ENTREGA,
	EDIT_GUARDAR_ENCARGO,
	EDIT_PRODUCTO_ENCARGO,
	ADD_PRODUCTO_ENCARGO,
	BORRAR_EDITAR_ABONO_ENCARGO,
} from "myGraphql/encargo";
import {
	CANCELAR_PRODUCTO_APARTDO,
	ADD_ABONO,
	EDIT_VENCE_APARTADO,
} from "myGraphql/apartado";

export default function useBack({ dataChange, dataEncargo }) {
	const params = useParams();
	const urlFolio = parseInt(params.folio);
	const { data, loading, refetch } = useQuery(GET_ENCARGO_FOLIO, {
		variables: { folio: urlFolio },
		notifyOnNetworkStatusChange: true,
	});
	const [mutateEDIT_GUARDAR_ENCARGO] = useMutation(EDIT_GUARDAR_ENCARGO);
	const [mutateCANCEL_ENTREGA] = useMutation(CANCEL_ENTREGA);
	const [mutateBORRAR_EDITAR_ABONO_ENCARGO] = useMutation(
		BORRAR_EDITAR_ABONO_ENCARGO
	);
	const [mutateCANCELAR_PRODUCTO_APARTDO] = useMutation(
		CANCELAR_PRODUCTO_APARTDO
	);
	const [mutateREGISTER_VENTA] = useMutation(REGISTER_VENTA);
	const [mutateADD_ABONO] = useMutation(ADD_ABONO);
	const [mutateEDIT_VENCE_APARTADO] = useMutation(EDIT_VENCE_APARTADO);
	const [mutateEDIT_PRODUCTO_ENCARGO] = useMutation(EDIT_PRODUCTO_ENCARGO);
	const [mutateADD_PRODUCTO_ENCARGO] = useMutation(ADD_PRODUCTO_ENCARGO);

	const { auth } = useContext(AuthContext);
	const { register } = useService();
	const audio = new Audio(aceptar);
	const navigate = useNavigate();
	const client = useApolloClient();

	const [dataApartadoImprimir, setdataApartadoImprimir] = useState([]);

	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (data?.getEncargoFolio) {
			dataChange(data?.getEncargoFolio);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const guardarEncargo = async () => {
		const dataEditGuardar = await register({
			input: {
				id: dataEncargo.id,
				status: !dataEncargo.guardado.status,
			},
			mutate: mutateEDIT_GUARDAR_ENCARGO,
			// keyF,
		});
		if (dataEditGuardar) {
			refetch();
			openNotification("success", `Se modificó con exito`);
		}
	};
	const cancelEntrega = async ({ keyF }) => {
		console.log(keyF);
		const status = dataEncargo?.entregado[0]?.status ?? false;
		const dataCancelEntrega = await register({
			input: {
				id: dataEncargo.id,
				status: status,
			},
			mutate: mutateCANCEL_ENTREGA,
			// keyF,
		});
		if (dataCancelEntrega) {
			openNotification(
				"success",
				`Encargo ${status ? "ENTREGADO" : "REACTIVADO"}`
			);
			refetch();
		}
	};
	const borrarAbono = async (record, borrarEditar) => {
		if (record) {
			const dataBEA = await register({
				mutate: mutateBORRAR_EDITAR_ABONO_ENCARGO,
				input: {
					abono: record.abono,
					borrarEditar: borrarEditar,
					idVenta: record.idVenta,
					idAbono: record._id,
					idApartado: dataEncargo.id,
					statusVenta: record.cancel,
				},
			});

			if (dataBEA) {
				openNotification("success", `Abono borrado`);
				refetch();
			}
		}
	};
	const borrarEntregarProduct = async (item, borrarEntregar) => {
		let status = true;
		if (item.entregado[0] && item.entregado[0].status) {
			status = !item.entregado[0].status;
		}
		const dataCPA = await register({
			input: {
				_id: item._id,
				status: status,
				borrarEntregar: borrarEntregar,
			},
			mutate: mutateCANCELAR_PRODUCTO_APARTDO,
			// keyF,
		});
		if (dataCPA) {
			if (borrarEntregar === "borrar") {
				openNotification("success", `Articulo borrado con exito`);
			} else if (borrarEntregar === "entregar") {
				openNotification("success", `Articulo modificado con exito`);
			}
			refetch();
		}
	};
	//Guardar y/o Imprimir APARTADO CON GraphQL
	const savePrintAbono = async ({
		keyF,
		dataVenta,
		totalTotal,
		calculateRestaria,
		initialState,
	}) => {
		const dataAA = await register({
			input: {
				id: dataEncargo.id,
				abono: parseFloat(totalTotal),
				resta: parseFloat(calculateRestaria()),
				idVenta: dataVenta.id,
				folioVenta: dataVenta.folio,
			},
			mutate: mutateADD_ABONO,
			// keyF,
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
	};
	//Guardar y/o Imprimir VENTA CON GraphQL
	const savePrintNewV = async ({ keyF, dinero, totalTotal, cambio }) => {
		let efectivo = parseFloat(dinero.efectivo);
		let tarjeta = parseFloat(dinero.tarjeta);
		let aCuenta = parseFloat(dinero.aCuenta);
		let total = parseFloat(totalTotal);

		if (cambio >= 0) {
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
					for (const iterator of queryF3.ventaF3) {
						arrayNew.push(iterator);
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
				const dataRV = await register({
					input: ventaF123,
					mutate: mutateREGISTER_VENTA,
					// keyF,
				});
				if (dataRV) {
					savePrintAbono({ keyF, dataRV: dataRV.registerVenta });
				}
			}
		}
	};
	const cambiarFecha = async ({ newFecha, setmodalCalendar }) => {
		if (dataEncargo.id) {
			const dataEditVA = await register({
				input: {
					id: dataEncargo.id,
					vence: newFecha.toString(),
				},
				mutate: mutateEDIT_VENCE_APARTADO,
				// keyF,
			});
			if (dataEditVA) {
				openNotification("success", `Fecha modificada con exito`);
				refetch();
				setmodalCalendar(false);
			}
		}
	};

	///////////////////////////////
	const updateProductosEncargo = async ({
		form,
		encargoSelect,
		closeModal,
	}) => {
		const newProducto = form.getFieldsValue();
		delete newProducto.cliente;
		newProducto.precio = parseInt(newProducto.precio);

		const newCantidad = parseInt(newProducto.cantidad);
		newProducto.cantidad = newCantidad > 0 ? newCantidad : 1;

		const input = {
			id: encargoSelect._id,
			producto: newProducto,
		};
		const dataEPE = await register({
			input,
			mutate: mutateEDIT_PRODUCTO_ENCARGO,
			// keyF,
		});
		if (dataEPE) {
			dataChange(dataEPE.editProductoEncargo);
			closeModal();
		}
	};
	const addProductosEncargo = async ({ form, closeModal }) => {
		const newProducto = form.getFieldsValue();
		delete newProducto.cliente;
		newProducto.precio = parseInt(newProducto.precio);

		const newCantidad = parseInt(newProducto.cantidad);
		newProducto.cantidad = newCantidad > 0 ? newCantidad : 1;
		const input = {
			id: dataEncargo.id,
			producto: newProducto,
		};
		const dataAPE = await register({
			input,
			mutate: mutateADD_PRODUCTO_ENCARGO,
			// keyF,
		});
		if (dataAPE) {
			dataChange(dataAPE.addProductoEncargo);
			closeModal();
		}
	};

	return {
		updateProductosEncargo,
		borrarEntregarProduct,
		addProductosEncargo,
		guardarEncargo,
		savePrintNewV,
		cancelEntrega,
		cambiarFecha,
		borrarAbono,
		refetch,
		loading,
		dataApartadoImprimir,
	};
}
