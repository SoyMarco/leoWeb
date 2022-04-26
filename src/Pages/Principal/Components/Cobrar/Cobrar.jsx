import { useState, useContext } from "react";
import ModalCobrar from "Components/ModalCobrar/Container/ModalCobrar";
import { REGISTER_VENTA, GET_TOTAL_VENTAS_DIA } from "myGraphql/venta";
import useService from "Components/ModalCobrar/Service/useService";
import ShopListContext from "context/Shopping/ShopListContext";
import { useMutation, useQuery } from "@apollo/client";
import AuthContext from "context/Auth/AuthContext";
import Imprimir from "../Imprimir/Imprimir";

const Cobrar = () => {
	const { shopList, totalTotal, initialState, imprimir, setimprimir } =
		useContext(ShopListContext);
	const { auth, isLoading } = useContext(AuthContext);

	const { register } = useService();

	const [mutateREGISTER_VENTA] = useMutation(REGISTER_VENTA);
	const { refetch: refetchTotalVentasDia } = useQuery(GET_TOTAL_VENTAS_DIA);

	const [cambioM, setcambio] = useState(0);
	const [inputsM, setinputs] = useState(0);
	const [folio, setfolio] = useState(0);

	//Guardar y/o Imprimir VENTA CON GraphQL
	const saveAndPrint = async ({ keyF, inputs, cambio }) => {
		if (
			isLoading === false &&
			cambio >= 0 &&
			(keyF === "F1" || keyF === "F2")
		) {
			setcambio(cambio);
			setinputs(inputs);

			const dataSend = createDateSend(inputs);
			const data = await register({
				input: dataSend,
				mutate: mutateREGISTER_VENTA,
				keyF,
			});
			if (data) {
				refetchTotalVentasDia(); //Actualizar % barra
				if (keyF === "F1") {
					setfolio(data.registerVenta.folio);
					setimprimir(true);
				}
				if (keyF === "F2") {
					initialState();
				}
			}
		}
	};

	const createDateSend = (inputs) => {
		const listaComprasNew = shopList.map((item) => ({
			apartado: item.apartado,
			cantidad: item.cantidad,
			idArray: item.key,
			key: item.key,
			nombre: item.nombre,
			precio: item.precio,
			refApartado: item.refApartado,
			totalArticulo: item.totalArticulo,
			idF3: item.idF3,
		}));
		return {
			productos: listaComprasNew,
			vendedor: auth.name,
			folio: 1,
			total: parseFloat(totalTotal),
			efectivo: parseFloat(inputs.efectivo ?? 0),
			tarjeta: parseFloat(inputs.tarjeta ?? 0),
			aCuenta: parseFloat(inputs.aCuenta ?? 0),
			pagoCon: 0,
			referencia: "",
			notas: "",
		};
	};

	return (
		<>
			{imprimir && <Imprimir cambio={cambioM} dinero={inputsM} folio={folio} />}
			{/* <ModalCobrar saveAndPrint={saveAndPrint} /> */}
		</>
	);
};

export default Cobrar;
