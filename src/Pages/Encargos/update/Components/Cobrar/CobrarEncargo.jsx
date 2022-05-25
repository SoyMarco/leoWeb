import { useContext } from "react";
import ModalCobrar from "Components/ModalCobrar/Container/ModalCobrar";
import useService from "Hooks/Service/useService";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import ShopListContext from "context/Shopping/ShopListContext";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_ABONO_ENCARGO } from "myGraphql/encargo";

export default function Cobrar() {
	const [mutateADD_ABONO_ENCARGO] = useMutation(ADD_ABONO_ENCARGO);

	const { isLoading } = useContext(AuthContext);
	const { addProductShopList, totalTotal } = useContext(ShopListContext);
	const {
		dataEncargo,
		initialState,
		setcambio,
		setinputs,
		newAbono,
		restaria,
	} = useContext(ReadEncargoContext);

	const { register } = useService();
	const navigate = useNavigate();

	const saveAndPrint = async ({ keyF, inputs, cambio }) => {
		setcambio(cambio);
		setinputs(inputs);
		if (cambio >= 0 && isLoading === false) {
			if (keyF === "F3") {
				addProductShopList({
					nombre: dataEncargo.cliente,
					precio: parseFloat(totalTotal),
					apartado: dataEncargo.folio,
					refApartado: dataEncargo.id,
					f3: true,
				});
				navigate("/");
				initialState();
				return;
			}
			const input = {
				id: dataEncargo.id,
				abono: newAbono,
				resta: restaria,
				ventaEfectivo: inputs.efectivo,
				ventaTarjeta: inputs.tarjeta,
				ventaACuenta: inputs.aCuenta,
				folioEncargo: dataEncargo.folio,
				idEncargo: 1,
				nombreCliente: 1,
			};
			const data = await register({
				input,
				mutate: mutateADD_ABONO_ENCARGO,
				keyF,
			});
			if (data) {
				console.log(data);
				// keys fs
				// if (keyF === "F1") {
				// 	setdataImprimir(data.addAbono);
				// } else if (keyF === "F2") {
				// 	initialState();
				// }
			}
		}
	};
	return <ModalCobrar saveAndPrint={saveAndPrint} />;
}
