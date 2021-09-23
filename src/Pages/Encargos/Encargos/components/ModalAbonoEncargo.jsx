import React, { useEffect, useRef } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { Modal, Row, Button, Input } from "antd";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import { keyBlock } from "Utils";

export default function ModalAbonoEncargo({
	modalAbono,
	setmodalAbono,
	setabono,
	abono,
	loader,
	guardarEncargo,
	setimprimirEncargo,
}) {
	const refInputAbono = useRef();
	useEffect(() => {
		if (modalAbono === true) {
			refInputAbono.current.select();
		}
	}, [modalAbono]);

	const pressKeyPrecio = (e) => {
		if (abono > 0) {
			// Enter
			if (e.keyCode === 13) {
				setimprimirEncargo(true);
			}
			// 	F1
			if (e.keyCode === 112) {
				setimprimirEncargo(true);
			}
			// F2
			if (e.keyCode === 113) {
				guardarEncargo();
			}
		}
	};
	return (
		<Modal
			key='modalEncargoKey'
			visible={modalAbono}
			onCancel={() => setmodalAbono(false)}
			style={{ top: 85 }}
			title={
				<>
					<FaMoneyBillWave style={{ marginRight: "10px" }} />
					Abono de encargo
				</>
			}
			footer={[
				<Row justify='space-around' key='rowFooterEncargo'>
					<Button
						style={
							abono < 1
								? {
										background: "grey",
										color: "white",
										fontWeight: "bold",
										width: 230,
								  }
								: {
										background: "linear-gradient(#32A632,#005800)",
										color: "white",
										fontWeight: "bold",
										width: 230,
								  }
						}
						key='btn1encargo'
						shape='round'
						disabled={abono < 1}
						icon={<PrinterFilled />}
						loading={loader}
						onClick={() => setimprimirEncargo(true)}
					>
						Imprimir (F1)
					</Button>
					<Button
						style={
							abono < 1
								? {
										background: "grey",
										color: "white",
										fontWeight: "bold",
										width: 230,
								  }
								: {
										background: "linear-gradient(#3232A6,#000058)",
										color: "white",
										fontWeight: "bold",
										width: 230,
								  }
						}
						key='btn2encargo'
						shape='round'
						disabled={abono < 1}
						icon={<SaveFilled />}
						loading={loader}
						onClick={() => guardarEncargo()}
					>
						Guardar (F2)
					</Button>
				</Row>,
			]}
		>
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
			></Input>
		</Modal>
	);
}
