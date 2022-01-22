import React, { useState, useEffect, useContext } from "react";
import { openNotification } from "Utils/openNotification";
import { CANCELAR_VENTA } from "myGraphql/venta";
import { useMutation } from "@apollo/client";
import ErrorConection from "Utils/ErrorConection";
import AuthContext from "context/Auth/AuthContext";

export default function Services(item) {
	const [mutateCANCELAR_VENTA] = useMutation(CANCELAR_VENTA);
	const { timeLogout } = useContext(AuthContext);

	const algo = {
		mutateCANCELAR_VENTA: async () => {
			console.log("cancelVenta", item);
			if (loader === true) {
				setloader(true);
				try {
					const { data } = await mutateCANCELAR_VENTA({
						variables: {
							input: {
								id: item.id,
								status: item.cancelado,
							},
						},
					});
					if (data) {
						openNotification(
							"success",
							`Venta ${item.cancelado ? "recuperada" : "cancelada"} con exito`
						);
						setloader(false);
						refetchCorte(data.cancelarVenta);
					}
				} catch (error) {
					setloader(false);
					ErrorConection(timeLogout);
				}
			}
		},
	};
	return <div>hola</div>;
}
