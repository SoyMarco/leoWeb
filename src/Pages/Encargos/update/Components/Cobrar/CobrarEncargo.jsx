import React, { useState, useEffect, useContext } from "react";
import { Modal, Input, Form, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import ImprimirApartado from "../ImprimirEncargo/ImprimirEncargo";
import { keyBlock } from "Utils";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";

const CobrarApartado = () => {
	const {
		modalCobrar,
		cerrarCobrar,
		initialState,
		calculateRestaria,
		btnLoading,
		savePrintNewV,
		abono,
		dataApartadoImprimir,
		cobrarEfectivo,
		OnValuesChange,
		cambio,
		form,
	} = useContext(ReadEncargoContext);
	const totalTotal = abono?.abono;

	const [imprimir, setimprimir] = useState(false);

	useEffect(() => {
		if (dataApartadoImprimir?.folio > 0) {
			setimprimir(true);
		}
	}, [dataApartadoImprimir]);

	const pressKeyPrecio = (e) => {
		// Enter
		if (e.keyCode === 13) {
			savePrintNewV("F1");
		}

		// E
		if (e.keyCode === 69) {
			cobrarEfectivo.current.select();
		}
		// A
		if (e.keyCode === 65) {
			document.querySelector("#cobraraCuenta").select();
		}
		// T
		if (e.keyCode === 84) {
			document.querySelector("#cobrarTarjeta").select();
		}

		// 	F1
		if (e.keyCode === 112) {
			savePrintNewV("F1");
		}
		// F2
		if (e.keyCode === 113) {
			savePrintNewV("F2");
		}
		// F3
		if (e.keyCode === 114) {
			savePrintNewV("F3");
		}
	};

	const keyBlockCobrar = (e) => {
		let dataForm = form.getFieldsValue();
		if (totalTotal === dataForm.efectivo) {
			cobrarEfectivo.current.select();
		}
		keyBlock(e);
	};
	return (
		<>
			{/* {imprimir ? ( */}
			<ImprimirApartado
				imprimir={imprimir}
				setimprimir={setimprimir}
				totalTotal={totalTotal}
				// listaCompras={listaCompras}
				initialState={initialState}
				calculateRestaria={calculateRestaria}
				dataApartado={dataApartadoImprimir}
				// auth={auth}
				// dinero={dinero}
				cambio={cambio}
			/>
			{/* ) : null} */}
			<Modal
				style={{ top: 25 }}
				title={
					<>
						<FaMoneyBillWave style={{ marginRight: "10px" }} />
						Cobrar
					</>
				}
				visible={modalCobrar}
				onCancel={() => cerrarCobrar()}
				footer={[
					<Row justify='space-around'>
						<Button
							style={
								cambio < 0
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
							// loading={loading}
							// disabled={cambio < 0}
							onClick={() => savePrintNewV("F1")}
							icon={<PrinterFilled />}
							loading={btnLoading}
						>
							Imprimir F1
						</Button>
						<Button
							style={
								cambio < 0
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
							// disabled={cambio < 0}
							onClick={() => savePrintNewV("F2")}
							icon={<SaveFilled />}
							loading={btnLoading}
						>
							Guardar F2
						</Button>
					</Row>,
				]}
			>
				<div key='div1' style={{ textAlignLast: "center" }}>
					<h1
						style={{
							fontWeight: "bold",
							fontSize: "36px",
							color: "#00000099",
							margin: 0,
						}}
					>
						Total: ${totalTotal}
					</h1>
				</div>
				<div key='div2' style={{ textAlignLast: "right" }}>
					<Form form={form} onValuesChange={OnValuesChange}>
						<Form.Item
							label='Efectivo'
							name='efectivo'
							key='1'
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className='labelCobrar'
						>
							<Input
								ref={cobrarEfectivo}
								id='cobrarEfectivo'
								className='inputCobrar'
								type='number'
								prefix={<FaMoneyBillWave style={{ color: "gray" }} />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlockCobrar}
							></Input>
						</Form.Item>
						<Form.Item
							label='Tarjeta'
							name='tarjeta'
							key='2'
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className='labelCobrar'
						>
							<Input
								id='cobrarTarjeta'
								className='inputCobrar'
								type='number'
								prefix={<FaCreditCard style={{ color: "gray" }} />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
							></Input>
						</Form.Item>
						<Form.Item
							label='A cuenta'
							name='aCuenta'
							key='3'
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className='labelCobrar'
						>
							<Input
								id='cobraraCuenta'
								className='inputCobrar'
								type='number'
								prefix={<FaStoreAlt style={{ color: "gray" }} />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
							></Input>
						</Form.Item>
					</Form>
				</div>
				<div key='div3' style={{ textAlignLast: "center" }}>
					<h1
						style={
							cambio >= 0
								? {
										fontWeight: "bold",
										fontSize: "40px",
										color: "#35B009",
										margin: "-20px 0 0 0",
								  }
								: {
										fontWeight: "bold",
										fontSize: "40px",
										color: "red",
										margin: "-20px 0 0 0",
								  }
						}
					>
						{cambio >= 0 ? `Cambio: $${cambio}` : `Faltan: $${cambio}`}
					</h1>
				</div>
			</Modal>
		</>
	);
};

export default CobrarApartado;
