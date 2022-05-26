import { useState, useEffect } from "react";
import {
	GET_CORTE,
	CANCELAR_VENTA,
	CANCELAR_PRODUCTO_VENTA,
} from "myGraphql/venta";
import { useQuery, useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import useService from "Hooks/Service/useService";

export default function useBack() {
	const {
		data: getCorteData,
		loading,
		refetch,
	} = useQuery(GET_CORTE, {
		notifyOnNetworkStatusChange: true,
	});
	const [mutateCANCELAR_VENTA, { loading: loadCancelVenta }] =
		useMutation(CANCELAR_VENTA);
	const [mutateCANCELAR_PRODUCTO_VENTA, { loading: loadCPV }] = useMutation(
		CANCELAR_PRODUCTO_VENTA
	);
	const { register, isLoading } = useService();

	const [stateRecord, setstateRecord] = useState(null);

	useEffect(() => {
		if (getCorteData?.getCorte?.ventas) {
			const {
				getCorte: { ventas },
			} = getCorteData;
			const recordUpdate = ventas.find((item) => item.id === stateRecord?.id);
			setstateRecord(recordUpdate ?? []);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getCorteData]);

	const cancelVenta = async (item) => {
		const dataCV = await register({
			input: {
				id: item?.id ?? stateRecord.id,
				status: item?.cancelado ?? stateRecord.cancelado,
			},
			mutate: mutateCANCELAR_VENTA,
			// keyF,
		});
		if (dataCV) {
			refetch();
			openNotification(
				"success",
				`Venta ${stateRecord.cancelado ? "recuperada" : "cancelada"} con exito`
			);
		}
	};
	const cancelarProductoVenta = async (record) => {
		const dataCPV = await register({
			input: {
				refApartado: record.refApartado,
				apartado: record.apartado,
				idVenta: stateRecord.id,
				idArticulo: record._id,
				status: record.cancelado,
				totalArticulo: record.totalArticulo,
			},
			mutate: mutateCANCELAR_PRODUCTO_VENTA,
			// keyF,
		});
		if (dataCPV) {
			openNotification("success", `Venta modificada`);
		}
	};

	return {
		getVentas: getCorteData?.getCorte?.ventas,
		refetch,
		cancelVenta,
		stateRecord,
		setstateRecord,
		isLoading,
		loadCancelVenta,
		loading,
		loadCPV,
		cancelarProductoVenta,
	};
}
