import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import Imprimir from "../Imprimir/Imprimir";
import "./cobrar.css";

const Cobrar = ({ modalCobrar, setmodalCobrar, totalTotal, listaCompras }) => {
	const [form] = Form.useForm();
	const [cambio, setcambio] = useState(0);
	const [imprimir, setimprimir] = useState(false);
	const [dinero, setdinero] = useState({
		aCuenta: 0,
		tarjeta: 0,
		efectivo: 0,
	});
	useEffect(() => {
		if (modalCobrar === true) {
			OnValuesChange();
			document.querySelector("#cobrarEfectivo").select();
		}
	}, [modalCobrar]);

	const OnValuesChange = () => {
		let valores = form.getFieldsValue();
		if (!valores.efectivo) {
			valores.efectivo = 0;
		}
		if (!valores.tarjeta) {
			valores.tarjeta = 0;
		}
		if (!valores.aCuenta) {
			valores.aCuenta = 0;
		}
		let efectivo = parseFloat(valores.efectivo);
		let tarjeta = parseFloat(valores.tarjeta);
		let aCuenta = parseFloat(valores.aCuenta);
		let total = parseFloat(totalTotal);
		var sumaTodo = efectivo + tarjeta + aCuenta;
		var resultado = sumaTodo - total;

		setdinero({
			aCuenta: aCuenta,
			tarjeta: tarjeta,
			efectivo: efectivo,
		});
		setcambio(resultado);
	};
	return (
		<>
			<Imprimir
				imprimir={imprimir}
				totalTotal={totalTotal}
				cambio={cambio}
				setimprimir={setimprimir}
				dinero={dinero}
				listaCompras={listaCompras}
				setmodalCobrar={setmodalCobrar}
			/>
			<Modal
				style={{ top: 25 }}
				title={
					<>
						<FaMoneyBillWave style={{ "margin-right": "10px" }} />
						Cobrar
					</>
				}
				visible={modalCobrar}
				onCancel={() => setmodalCobrar(!modalCobrar)}
				footer={[
					<Row justify="space-around">
						<Button
							style={{
								background: "linear-gradient(#3232A6,#000058)",
								color: "white",
								"font-weight": "bold",
								width: 230,
							}}
							// loading={loading}
							// disabled={cambio < 0}
							onClick={() => setimprimir(!imprimir)}
							icon={<SaveFilled />}
						>
							Guardar
						</Button>

						<Button
							style={{
								background: "linear-gradient(#32A632,#005800)",
								color: "white",
								"font-weight": "bold",
								width: 230,
							}}
							// loading={loading}
							// disabled={cambio < 0}
							onClick={() => setimprimir(!imprimir)}
							icon={<PrinterFilled />}
						>
							Imprimir
						</Button>
					</Row>,
				]}
			>
				<div style={{ "text-align-last": "center" }}>
					<h1
						style={{
							"font-weight": "bold",
							"font-size": "36px",
							color: "#00000099",
							margin: 0,
						}}
					>
						Total: ${totalTotal}
					</h1>
				</div>
				<div style={{ "text-align-last": "right" }}>
					<Form form={form} onValuesChange={OnValuesChange}>
						<Form.Item
							label="Efectivo"
							name="efectivo"
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className="labelCobrar"
						>
							<Input
								id="cobrarEfectivo"
								className="inputCobrar"
								type="number"
								prefix={<FaMoneyBillWave />}
							></Input>
						</Form.Item>
						<Form.Item
							label="Tarjeta"
							name="tarjeta"
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className="labelCobrar"
						>
							<Input
								className="inputCobrar"
								type="number"
								prefix={<FaCreditCard />}
							></Input>
						</Form.Item>
						<Form.Item
							label="A cuenta"
							name="aCuenta"
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className="labelCobrar"
						>
							<Input
								className="inputCobrar"
								type="number"
								prefix={<FaStoreAlt />}
							></Input>
						</Form.Item>
					</Form>
				</div>
				<div style={{ "text-align-last": "center" }}>
					<h1
						style={
							cambio >= 0
								? {
										"font-weight": "bold",
										"font-size": "40px",
										color: "#35B009",
										margin: "-20px 0 0 0",
								  }
								: {
										"font-weight": "bold",
										"font-size": "40px",
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

export default Cobrar;
