import { useContext, useEffect, useRef } from "react";
import EncargoContext from "context/NewEncargo/context";
import { FaMoneyBillWave } from "react-icons/fa";
import { Input } from "antd";
import { keyBlock } from "Utils";
import ShopListContext from "context/Shopping/ShopListContext";

export default function ModalAbonoEncargo() {
	const { guardarEncargo, abono, setabono, setmodalAbono } =
		useContext(EncargoContext);
	const { settotalTotal, setmodalCobrar } = useContext(ShopListContext);

	const refInputAbono = useRef();

	useEffect(() => {
		refInputAbono.current.select();
	}, []);

	const pressKeyPrecio = (e) => {
		if (abono > 0) {
			// Enter
			if (e.keyCode === 13) {
				settotalTotal(abono);
				setmodalCobrar(true);
			}
			// 	F1
			if (e.keyCode === 112) {
				guardarEncargo({ keyF: "F1" });
			}
			// F2
			if (e.keyCode === 113) {
				guardarEncargo({ keyF: "F2" });
			}
		}
		// ESC
		if (e.keyCode === 27) {
			setmodalAbono(false);
			setabono(0);
		}
	};
	return (
		<>
			<h3 key='h3Abono'>Abono:</h3>
			<Input
				id='abonoEncargo'
				className='inputCobrar'
				key="'abonoEncargo'"
				ref={refInputAbono}
				autoFocus
				type='number'
				prefix={<FaMoneyBillWave style={{ color: "gray" }} />}
				onKeyUp={pressKeyPrecio}
				onKeyDown={keyBlock}
				onChange={(e) => setabono(Math.round(e.target.value * 100) / 100)}
				value={abono}
				style={{ marginBottom: "60px" }}
			/>
		</>
	);
}
