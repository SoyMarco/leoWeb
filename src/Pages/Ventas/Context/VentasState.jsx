/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import useBack from "../Services/useBack";
import VentasContext from "./context";

export default function VentasState({ children }) {
	const [imprimir, setimprimir] = useState(false);
	const [modalProductos, setmodalProductos] = useState(false);
	const allBack = useBack();

	return (
		<VentasContext.Provider
			value={{
				...allBack,
				setmodalProductos,
				setimprimir,
				imprimir,
				modalProductos,
			}}
		>
			{children}
		</VentasContext.Provider>
	);
}
