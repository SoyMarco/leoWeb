/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
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

	const { dataReturn, register, keyFunc } = useService();

	const [mutateREGISTER_VENTA] = useMutation(REGISTER_VENTA);
	const { refetch: refetchTotalVentasDia } = useQuery(GET_TOTAL_VENTAS_DIA);

	const [cambioM, setcambio] = useState(0);
	const [inputsM, setinputs] = useState(0);
	const [folio, setfolio] = useState(0);

	useEffect(() => {
		if (dataReturn) {
			//Actualizar % barra
			refetchTotalVentasDia();

			if (keyFunc === "F1") {
				setfolio(dataReturn.registerVenta.folio);
				setimprimir(true);
			}
			if (keyFunc === "F2") {
				initialState();
			}
		}
	}, [dataReturn]);

	//Guardar y/o Imprimir VENTA CON GraphQL
	const saveAndPrint = ({ keyF, inputs, cambio }) => {
		if (
			isLoading === false &&
			cambio >= 0 &&
			(keyF === "F1" || keyF === "F2")
		) {
			setcambio(cambio);
			setinputs(inputs);
			const dataSend = createDateSend(inputs);

			register({ input: dataSend, mutate: mutateREGISTER_VENTA, keyF });
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
			<ModalCobrar saveAndPrint={saveAndPrint} totalTotal={totalTotal} />
		</>
	);
};

export default Cobrar;
