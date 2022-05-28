import { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { openNotification } from "Utils/openNotification";
import useService from "Hooks/Service/useService";
import {
	GET_ENCARGO_FOLIO,
	CANCEL_ENTREGA,
	EDIT_GUARDAR_ENCARGO,
	EDIT_PRODUCTO_ENCARGO,
	ADD_PRODUCTO_ENCARGO,
	BORRAR_EDITAR_ABONO_ENCARGO,
} from "myGraphql/encargo";
import { CANCELAR_PRODUCTO_APARTDO } from "myGraphql/apartado";

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
	const [mutateEDIT_PRODUCTO_ENCARGO] = useMutation(EDIT_PRODUCTO_ENCARGO);
	const [mutateADD_PRODUCTO_ENCARGO] = useMutation(ADD_PRODUCTO_ENCARGO);

	const { register, isLoading } = useService();

	// para imprimir apartados
	// const [dataApartadoImprimir, setdataApartadoImprimir] = useState([]);

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
			closeModal();
		}
	};

	return {
		updateProductosEncargo,
		borrarEntregarProduct,
		addProductosEncargo,
		guardarEncargo,
		cancelEntrega,
		borrarAbono,
		refetch,
		loading,
		isLoading,
		// dataApartadoImprimir,
	};
}
