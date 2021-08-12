/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import Imprimir from "../Imprimir/Imprimir";
import { openNotification } from "../../../Utils/openNotification";
import { keyBlock } from "../../../Utils";
import { useQuery, gql, useMutation } from "@apollo/client";
import { LOGIN } from "../../../graphql/user";
import "./cobrar.css";

const Cobrar = ({
	modalCobrar,
	setmodalCobrar,
	totalTotal,
	listaCompras,
	initialState,
}) => {
	const [mutateLOGIN, { data: dataLOGIN, loading, error }] = useMutation(LOGIN);
	const [form] = Form.useForm();
	const [cambio, setcambio] = useState(0);
	const [imprimir, setimprimir] = useState(false);
	const [btnLoading, setbtnLoading] = useState(false);
	const [dinero, setdinero] = useState({
		aCuenta: 0,
		tarjeta: 0,
		efectivo: 0,
	});
	if (dataLOGIN) {
		console.log(dataLOGIN);
	}
	useEffect(() => {
		if (modalCobrar === true) {
			form.setFieldsValue({ efectivo: totalTotal });
			OnValuesChange();
			document.querySelector("#cobrarEfectivo").select();
		}
	}, [modalCobrar]);

	const imprimirVenta = () => {
		if (cambio >= 0) {
			setimprimir(true);
		}
	};

	const pressKeyPrecio = (e) => {
		// Enter
		if (e.keyCode === 13) {
			imprimirVenta();
		}
		// E
		if (e.keyCode === 69) {
			document.querySelector("#cobrarEfectivo").select();
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
			document.querySelector("#cobrarTarjeta").select();
		}
	};

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

	//Guardar y/o Imprimir VENTA CON GraphQL
	const savePrintNewV = async (keyF) => {
		console.log("mutateLOGIN");
		mutateLOGIN({
			variables: {
				input: {
					name: "marco",
					password: "123456",
				},
			},
		});
		/* 	await guardarVenta();
			// if (keyF === "F1") {
			// 	folio = await dataVenta.registerVenta.folio;
			// 	await abrirImprimir();
			// 	btnLoading = false;
			// } else if (keyF === "F2") {
			openNotification("success", "Venta guardada con exito");
			initialState();
			// }
		}; */
	};
	const guardarVenta = async () => {
		// let efectivo = parseFloat(dinero.efectivo);
		// let tarjeta = parseFloat(dinero.tarjeta);
		// let aCuenta = parseFloat(dinero.aCuenta);
		// let total = parseFloat(totalTotal);
		if (cambio >= 0) {
			setbtnLoading(true);
			// const { data, loading, error } = await $apollo.mutate({
			// 	// Query Mutation
			// 	mutation: gql`
			// 		mutation registerVenta($input: VentaInput) {
			// 			registerVenta(input: $input) {
			// 				id
			// 				folio
			// 			}
			// 		}
			// 	`,
			// 	// Parameters
			// 	variables: {
			// 		input: {
			// 			productos: productos,
			// 			vendedor: $store.state.usuario.name,
			// 			folio: 1,
			// 			total: total,
			// 			efectivo: efectivo,
			// 			tarjeta: tarjeta,
			// 			aCuenta: aCuenta,
			// 			pagoCon: 0,
			// 			referencia: "",
			// 			notas: "",
			// 		},
			// 	},
			// });
			// if (data) {
			// 	console.log(data);
			// 	dataVenta = await data;
			// }
		}
	};

	return (
		<>
			{imprimir ? (
				<Imprimir
					imprimir={imprimir}
					totalTotal={totalTotal}
					cambio={cambio}
					setimprimir={setimprimir}
					dinero={dinero}
					listaCompras={listaCompras}
					setmodalCobrar={setmodalCobrar}
				/>
			) : null}
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
								background: "linear-gradient(#32A632,#005800)",
								color: "white",
								fontWeight: "bold",
								width: 230,
							}}
							// loading={loading}
							// disabled={cambio < 0}
							onClick={() => imprimirVenta()}
							icon={<PrinterFilled />}
							loading={btnLoading}
						>
							Imprimir F1
						</Button>
						<Button
							style={{
								background: "linear-gradient(#3232A6,#000058)",
								color: "white",
								fontWeight: "bold",
								width: 230,
							}}
							// loading={loading}
							// disabled={cambio < 0}
							onClick={() => imprimirVenta()}
							icon={<SaveFilled />}
							loading={btnLoading}
						>
							Guardar F2
						</Button>
					</Row>,
				]}
			>
				<div style={{ textAlignLast: "center" }}>
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
				<div style={{ textAlignLast: "right" }}>
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
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
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
								id="cobrarTarjeta"
								className="inputCobrar"
								type="number"
								prefix={<FaCreditCard />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
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
								id="cobraraCuenta"
								className="inputCobrar"
								type="number"
								prefix={<FaStoreAlt />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
							></Input>
						</Form.Item>
					</Form>
				</div>
				<div style={{ textAlignLast: "center" }}>
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

export default Cobrar;
