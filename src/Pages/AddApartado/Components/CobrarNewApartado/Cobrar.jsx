import { useContext } from "react";
import { REGISTER_APARTADO, REGISTER_APARTADO_F3 } from "myGraphql/apartado";
import ModalCobrar from "Components/ModalCobrar/Container/ModalCobrar";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";
import useService from "Hooks/Service/useService";
import ShopListContext from "context/Shopping/ShopListContext";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

export default function Cobrar() {
	const {
		listaCompras,
		cliente,
		abono,
		setdataApartado,
		setimprimir,
		setdinero,
	} = useContext(NewAparadoContext);
	const { addProductShopList, setmodalCobrar } = useContext(ShopListContext);
	const { auth, isLoading } = useContext(AuthContext);

	const { register } = useService();

	const [mutateREGISTER_APARTADO] = useMutation(REGISTER_APARTADO);
	const [mutateREGISTER_APARTADO_F3] = useMutation(REGISTER_APARTADO_F3);

	const navigate = useNavigate();

	const saveAndPrint = async ({ keyF, inputs, cambio }) => {
		setdinero(inputs);
		if (keyF === "F1" || keyF === "F2") {
			if (cambio >= 0 && auth.name && isLoading === false) {
				const dataSend = {
					productos: listaCompras,
					cliente: cliente,
					total: parseFloat(abono),
					ventaEfectivo: parseFloat(inputs?.efectivo ?? 0),
					ventaTarjeta: parseFloat(inputs?.tarjeta ?? 0),
					ventaACuenta: parseFloat(inputs?.aCuenta ?? 0),
				};
				const dataReturn = await register({
					input: dataSend,
					mutate: mutateREGISTER_APARTADO,
					keyF,
				});
				if (dataReturn) {
					if (keyF === "F1") {
						setdataApartado(dataReturn.registerApartado);
						setimprimir(true);
						setmodalCobrar(false);
					} else if (keyF === "F2") {
						setmodalCobrar(false);
						navigate("/");
					}
				}
			}
		}

		if (keyF === "F3") {
			if (auth.name && isLoading === false) {
				const dataSend = {
					productos: listaCompras,
					cliente: cliente,
				};
				const dataReturn = await register({
					input: dataSend,
					mutate: mutateREGISTER_APARTADO_F3,
					keyF,
				});
				if (keyF === "F3") {
					const { registerApartadoF3 } = dataReturn;
					addProductShopList({
						nombre: registerApartadoF3.cliente,
						precio: parseFloat(abono),
						apartado: registerApartadoF3.folio,
						refApartado: registerApartadoF3.id,
						f3: true,
					});
					setmodalCobrar(false);
					navigate("/");
				}
			}
		}
	};

	return <ModalCobrar saveAndPrint={saveAndPrint} />;
}
