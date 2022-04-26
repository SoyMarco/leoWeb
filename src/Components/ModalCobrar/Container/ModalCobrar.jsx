/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useContext } from "react";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import ShopListContext from "context/Shopping/ShopListContext";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import AuthContext from "context/Auth/AuthContext";
import { Modal, Input, Button, Row } from "antd";
import { keyBlock } from "Utils";
import "./cobrar.css";

export default function ModalCobrar({ saveAndPrint }) {
	const { timeLogout, isLoading } = useContext(AuthContext);
	const { totalTotal, setmodalCobrar } = useContext(ShopListContext);
	const [cambio, setcambio] = useState(0);
	const [inputs, setinputs] = useState({
		efectivo: null,
		tarjeta: null,
		aCuenta: null,
	});

	const cobrarEfectivo = useRef();

	useEffect(() => {
		setinputs({ ...inputs, efectivo: totalTotal });
		setTimeout(() => {
			cobrarEfectivo.current.select();
		}, 50);
		timeLogout();
	}, []);

	useEffect(() => {
		OnValuesChange();
	}, [inputs]);

	const pressKeyPrecio = (e) => {
		// Enter
		if (e.keyCode === 13) {
			saveAndPrint({ keyF: "F1", inputs, cambio });
		}
		// E
		if (e.keyCode === 69) {
			if (inputs.aCuenta === totalTotal || inputs.tarjeta === totalTotal) {
				setinputs({ efectivo: totalTotal });
			}
			cobrarEfectivo.current.select();
		}
		// A
		if (e.keyCode === 65) {
			if (inputs.efectivo === totalTotal || inputs.tarjeta === totalTotal) {
				setinputs({ aCuenta: totalTotal });
			}
			document.querySelector("#aCuenta").select();
		}
		// T
		if (e.keyCode === 84) {
			if (inputs.efectivo === totalTotal || inputs.aCuenta === totalTotal) {
				setinputs({ tarjeta: totalTotal });
			}
			document.querySelector("#tarjeta").select();
		}

		// 	F1
		if (e.keyCode === 112) {
			saveAndPrint({ keyF: "F1", inputs, cambio });
		}
		// F2
		if (e.keyCode === 113) {
			saveAndPrint({ keyF: "F2", inputs, cambio });
		}
		// F3
		if (e.keyCode === 114) {
			saveAndPrint({ keyF: "F3", inputs, cambio });
		}
	};

	const onChangeInput = (e) => {
		const key = e.target.id;
		let value = Math.round(e.target.value * 100) / 100;
		value = value > 0 ? value : null;
		setinputs({ ...inputs, [key]: value });
	};

	const OnValuesChange = () => {
		const efectivo = parseFloat(inputs.efectivo ?? 0);
		const tarjeta = parseFloat(inputs.tarjeta ?? 0);
		const aCuenta = parseFloat(inputs.aCuenta ?? 0);
		const total = parseFloat(totalTotal);
		const sumaTodo = efectivo + tarjeta + aCuenta;
		const resultado = sumaTodo - total;

		setcambio(resultado);
	};

	return (
		<Modal
			key='keyModal'
			style={{ top: 25 }}
			className='ModalCobrarPrincipal'
			title={
				<>
					<FaMoneyBillWave style={{ marginRight: "10px" }} />
					Cobrar
				</>
			}
			visible={true}
			onCancel={() => setmodalCobrar((e) => !e)}
			footer={false}
		>
			<div key='div1' style={{ textAlignLast: "center" }}>
				<h1
					key='div1h1'
					style={{
						fontWeight: "bold",
						fontSize: "36px",
						color: "green",
						margin: 0,
					}}
				>
					Total: ${totalTotal}
				</h1>
			</div>
			<Input
				placeholder='Efectivo'
				ref={cobrarEfectivo}
				autoFocus={true}
				type='number'
				prefix={<FaMoneyBillWave />}
				onKeyUp={(e) => pressKeyPrecio(e)}
				onKeyDown={(e) => keyBlock(e)}
				onChange={(e) => onChangeInput(e)}
				className='InputModalCobrar'
				id='efectivo'
				value={inputs.efectivo}
			></Input>

			<Input
				placeholder='Tarjeta'
				type='number'
				prefix={<FaCreditCard />}
				onKeyUp={pressKeyPrecio}
				onKeyDown={keyBlock}
				id='tarjeta'
				className='InputModalCobrar'
				onChange={(e) => onChangeInput(e)}
				value={inputs.tarjeta}
			></Input>

			<Input
				placeholder='A cuenta'
				type='number'
				prefix={<FaStoreAlt />}
				onKeyUp={pressKeyPrecio}
				onKeyDown={keyBlock}
				id='aCuenta'
				className='InputModalCobrar'
				onChange={(e) => onChangeInput(e)}
				value={inputs.aCuenta}
			></Input>
			<div key='div3' style={{ textAlignLast: "center" }}>
				<h1
					key='keyh1Cambio'
					style={{
						fontWeight: "bold",
						fontSize: "40px",
						color: cambio >= 0 ? "#35B009" : "red",
						margin: "-10px 0 0 0",
					}}
				>
					{cambio >= 0 ? `Cambio: $${cambio}` : `Faltan: $${cambio}`}
				</h1>
			</div>
			<Row justify='space-around' key='keyRowBtns'>
				<Button
					style={{
						background:
							cambio < 0 ? "grey" : "linear-gradient(#32A632,#005800)",
						color: "white",
						fontWeight: "bold",
						width: 230,
					}}
					shape='round'
					size='large'
					onClick={() => saveAndPrint({ keyF: "F1", inputs, cambio })}
					icon={<PrinterFilled />}
					loading={isLoading}
					key='keybtnf1'
				>
					Imprimir F1
				</Button>
				<Button
					style={{
						background:
							cambio < 0 ? "grey" : "linear-gradient(#3232A6,#000058)",
						color: "white",
						fontWeight: "bold",
						width: 230,
					}}
					shape='round'
					size='large'
					onClick={() => saveAndPrint({ keyF: "F2", inputs, cambio })}
					icon={<SaveFilled />}
					loading={isLoading}
					key='keybtnf2'
				>
					Guardar F2
				</Button>
			</Row>
		</Modal>
	);
}
