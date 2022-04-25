import { useContext, useState } from "react";
import ModalCobrar from "Components/ModalCobrar/Container/ModalCobrar";
import ImprimirApartado from "../ImprimirApartado/ImprimirApartado";
import useService from "Components/ModalCobrar/Service/useService";
import ApartadoContext from "context/Apartado/ApartadoContext";
import ShopListContext from "context/Shopping/ShopListContext";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { ADD_ABONO } from "myGraphql/apartado";
import { useMutation } from "@apollo/client";

export default function Cobrar() {
	const [mutateADD_ABONO] = useMutation(ADD_ABONO);

	const { isLoading } = useContext(AuthContext);
	const { addProductShopList } = useContext(ShopListContext);
	const {
		dataApartado,
		totalTotal,
		calculateRestaria,
		setdataApartadoImprimir,
		initialState,
		imprimir,
		setimprimir,
		dataApartadoImprimir,
		abono,
	} = useContext(ApartadoContext);

	const [cambioM, setcambio] = useState(0);
	const [inputsM, setinputs] = useState(0);

	const { register } = useService();
	const navigate = useNavigate();

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
				return;
			}

			const dataSend = {
				id: dataApartado.id,
				abono: parseFloat(totalTotal),
				resta: parseFloat(calculateRestaria()),
				ventaEfectivo: parseFloat(inputs.efectivo),
				ventaTarjeta: parseFloat(inputs.tarjeta),
				ventaACuenta: parseFloat(inputs.aCuenta),
				folioApartado: dataApartado.folio,
				idApartado: dataApartado.id,
				nombreCliente: dataApartado.cliente,
				keyF: keyF,
			};

			const data = await register({
				input: dataSend,
				mutate: mutateADD_ABONO,
				keyF,
			});
			if (data) {
				if (keyF === "F1") {
					setdataApartadoImprimir(data.addAbono);
				} else if (keyF === "F2") {
					initialState(data);
				}
			}
		}
	};
	return (
		<>
			<ModalCobrar saveAndPrint={saveAndPrint} />
			{imprimir && (
				<ImprimirApartado
					imprimir={imprimir}
					setimprimir={setimprimir}
					dataApartado={dataApartadoImprimir ?? dataApartado}
					dinero={inputsM}
					cambio={cambioM}
					totalTotal={abono.abono}
				/>
			)}
		</>
	);
}
