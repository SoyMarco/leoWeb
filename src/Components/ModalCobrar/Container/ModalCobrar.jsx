import { useState, useRef } from "react";
import { Modal, Input, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import { keyBlock } from "Utils";

export default function ModalCobrar({
	saveAndPrint,
	totalTotal,
	isOpen,
	setIsOpen,
}) {
	const cobrarEfectivo = useRef();

	const [btnLoading, setbtnLoading] = useState(false);
	const [cambio, setcambio] = useState(0);
	const [inputs, setinputs] = useState({
		efectivo: null,
		tarjeta: null,
		aCuenta: null,
	});

	const pressKeyPrecio = (e) => {
		// Enter
		if (e.keyCode === 13) {
			saveAndPrint("F1");
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
			saveAndPrint("F1");
		}
		// F2
		if (e.keyCode === 113) {
			saveAndPrint("F2");
		}
	};

	const onChangeInput = (e) => {
		const key = e.target.id;
		let value = Math.round(e.target.value * 100) / 100;
		value = value > 0 ? value : null;
		setinputs({ ...inputs, [key]: value });
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
			visible={isOpen}
			onCancel={() => setIsOpen(!isOpen)}
		>
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
					onClick={() => saveAndPrint("F1")}
					icon={<PrinterFilled />}
					loading={btnLoading}
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
					onClick={() => saveAndPrint("F2")}
					icon={<SaveFilled />}
					loading={btnLoading}
					key='keybtnf2'
				>
					Guardar F2
				</Button>
			</Row>
		</Modal>
	);
}
