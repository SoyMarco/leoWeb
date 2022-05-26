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
	const { addProductShopList, totalTotal, setmodalCobrar } =
		useContext(ShopListContext);
	const {
		dataEncargo,
		initialState,
		setcambio,
		setinputs,
		newAbono,
		restaria,
		setmodalReimprimir,
		setdataEncargo,
		setnewAbono,
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
				initialState();
				navigate("/");
				return;
			}
			const input = {
				id: dataEncargo.id,
				abono: newAbono,
				resta: restaria,
				ventaEfectivo: inputs?.efectivo ?? 0,
				ventaTarjeta: inputs?.tarjeta ?? 0,
				ventaACuenta: inputs?.aCuenta ?? 0,
				folioEncargo: dataEncargo.folio,
				idEncargo: dataEncargo.id,
				nombreCliente: dataEncargo.cliente,
			};
			const data = await register({
				input,
				mutate: mutateADD_ABONO_ENCARGO,
				keyF,
			});
			if (data) {
				console.log("daaaaaaaaaa@@@@", data);
				const { addAbonoEncargo } = data;
				setnewAbono(null);
				setdataEncargo(addAbonoEncargo);
				setmodalCobrar(false);
				if (keyF === "F1") {
					setmodalReimprimir(true);
					return;
				}
			}
		}
	};
	return <ModalCobrar saveAndPrint={saveAndPrint} />;
}
