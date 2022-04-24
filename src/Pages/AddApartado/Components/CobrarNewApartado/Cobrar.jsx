import React, { useEffect, useContext } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_APARTADO, REGISTER_APARTADO_F3 } from "myGraphql/apartado";
import AuthContext from "context/Auth/AuthContext";
import ShopListContext from "context/Shopping/ShopListContext";
import { useNavigate } from "react-router-dom";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";

import ModalCobrar from "Components/ModalCobrar/Container/ModalCobrar";
import useService from "Components/ModalCobrar/Service/useService";

export default function Cobrar() {
	const {
		listaCompras,
		cliente,
		abono,
		setdataApartado,
		setmodalCobrar,
		setimprimir,
		setdinero,
	} = useContext(NewAparadoContext);
	const { addProductShopList } = useContext(ShopListContext);
	const { auth, isLoading } = useContext(AuthContext);

	const { dataReturn, register, keyFunc } = useService();

	const [mutateREGISTER_APARTADO] = useMutation(REGISTER_APARTADO);
	const [mutateREGISTER_APARTADO_F3] = useMutation(REGISTER_APARTADO_F3);

	const navigate = useNavigate();

	useEffect(() => {
		if (dataReturn) {
			if (keyFunc === "F1") {
				setdataApartado(dataReturn.registerApartado);
				setimprimir(true);
				setmodalCobrar(false);
			} else if (keyFunc === "F2") {
				navigate("/");
			}

			if (keyFunc === "F3") {
				const { registerApartadoF3 } = dataReturn;
				addProductShopList({
					nombre: registerApartadoF3.cliente,
					precio: parseFloat(abono),
					apartado: registerApartadoF3.folio,
					refApartado: registerApartadoF3.id,
					f3: true,
				});
				navigate("/");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataReturn]);

	const saveAndPrint = ({ keyF, inputs, cambio }) => {
		setdinero(inputs);
		if (keyF === "F1" || keyF === "F2") {
			if (cambio >= 0 && auth.name && isLoading === false) {
				const dataSend = {
					productos: listaCompras,
					cliente: cliente,
					total: parseFloat(abono),
					ventaEfectivo: parseFloat(inputs.efectivo),
					ventaTarjeta: parseFloat(inputs.tarjeta),
					ventaACuenta: parseFloat(inputs.aCuenta),
				};
				register({
					input: dataSend,
					mutate: mutateREGISTER_APARTADO,
					keyF,
				});
			}
		}

		if (keyF === "F3") {
			if (auth.name && isLoading === false) {
				const dataSend = {
					productos: listaCompras,
					cliente: cliente,
				};
				register({
					input: dataSend,
					mutate: mutateREGISTER_APARTADO_F3,
					keyF,
				});
			}
		}
	};

	return <ModalCobrar saveAndPrint={saveAndPrint} totalTotal={abono} />;
}
