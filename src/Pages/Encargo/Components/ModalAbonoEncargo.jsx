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
}) {
	const refInputAbono = useRef();
	useEffect(() => {
		if (modalAbono === true) {
			refInputAbono.current.select();
		}
	}, [modalAbono]);
	const savePrint = (keyF) => {
		if (keyF === "F1") {
		}
		if (keyF === "F2") {
			guardarEncargo();
		}
	};
	const pressKeyPrecio = (e) => {
		if (abono > 0) {
			// Enter
			if (e.keyCode === 13) {
				savePrint("F1");
			}
			// 	F1
			if (e.keyCode === 112) {
				savePrint("F1");
			}
			// F2
			if (e.keyCode === 113) {
				savePrint("F2");
			}
		}
	};
	return (
		<Modal
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
				<Row justify='space-around'>
					<Button
						style={
							abono < 0
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
						shape='round'
						// onClick={() => savePrint("F1")}
						icon={<PrinterFilled />}
						loading={loader}
					>
						Imprimir (F1)
					</Button>
					<Button
						style={
							abono < 0
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
						shape='round'
						// loading={loading}
						// disabled={abono < 0}
						// onClick={() => savePrint("F2")}
						icon={<SaveFilled />}
						loading={loader}
					>
						Guardar (F2)
					</Button>
				</Row>,
			]}
		>
			<h3>Abono:</h3>
			<Input
				id='abonoEncargo'
				className='inputCobrar'
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
