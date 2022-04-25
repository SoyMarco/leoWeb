import React, { useState, useEffect, useRef } from "react";
import NewAparadoContext from "./NewAparadoContext";

const NewAparadoState = (props) => {
	const [cliente, setcliente] = useState("");
	const [abono, setabono] = useState(0);
	const [imprimir, setimprimir] = useState(false);
	const [dataApartado, setdataApartado] = useState(null);
	const [listaCompras, setlistaCompras] = useState([]);
	const [dinero, setdinero] = useState({
		aCuenta: 0,
		tarjeta: 0,
		efectivo: 0,
	});
	const [cambio, setcambio] = useState(0);
	const [restaria, setrestaria] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const [titulo2, settitulo2] = useState("Productos");
	const [totalProductos, settotalProductos] = useState(0);
	const [current, setCurrent] = useState(0);

	let fechaVence = new Date();
	fechaVence.setMonth(fechaVence.getMonth() + 1);
	const inputAbono = useRef();

	useEffect(() => {
		setrestaria(totalTotal - abono);
	}, [abono, totalTotal]);

	useEffect(() => {
		let sum = 0;
		let sumProd = 0;
		for (const articulo of listaCompras) {
			sum += articulo.totalArticulo;
			sumProd += articulo.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);
		settitulo2(`Productos: ${listaCompras.length}`);
	}, [listaCompras]);

	useEffect(() => {
		if (current === 2) {
			inputAbono.current.select();
		}
	}, [current]);

	const next = () => {
		setCurrent(current + 1);
	};
	const prev = () => {
		setCurrent(current - 1);
	};
	const hasDataApartado = () => {
		if (dataApartado) {
			return dataApartado;
		}
		return {
			cliente: cliente,
			vence: fechaVence,
			productos: listaCompras,
			abonos: [{ abono: abono, createAt: new Date() }],
		};
	};
	return (
		<NewAparadoContext.Provider
			value={{
				cliente,
				setcliente,
				abono,
				setabono,
				imprimir,
				setimprimir,
				listaCompras,
				setlistaCompras,
				dinero,
				setdinero,
				dataApartado: hasDataApartado(),
				setdataApartado,
				cambio,
				setcambio,
				restaria,
				setrestaria,
				totalTotal,
				settotalTotal,
				titulo2,
				settitulo2,
				totalProductos,
				settotalProductos,
				current,
				setCurrent,
				next,
				prev,
				inputAbono,
			}}
		>
			{props.children}
		</NewAparadoContext.Provider>
	);
};

export default NewAparadoState;
