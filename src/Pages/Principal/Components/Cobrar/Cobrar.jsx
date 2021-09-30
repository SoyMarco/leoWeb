/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Form, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import Imprimir from "../Imprimir/Imprimir";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { keyBlock } from "Utils";
import { useMutation } from "@apollo/client";
import { REGISTER_VENTA } from "graphql/venta";
import useAuth from "hooks/useAuth";
import aceptar from "assets/sonido/Aceptar.wav";

// import "./cobrar.css";

const Cobrar = ({
	modalCobrar,
	setmodalCobrar,
	totalTotal,
	listaCompras,
	initialState,
}) => {
	const [mutateREGISTER_VENTA] = useMutation(REGISTER_VENTA);
	const [form] = Form.useForm();
	const [cambio, setcambio] = useState(0);
	const [imprimir, setimprimir] = useState(false);
	const [btnLoading, setbtnLoading] = useState(false);
	const [folio, setfolio] = useState(0);
	const [dinero, setdinero] = useState({
		aCuenta: 0,
		tarjeta: 0,
		efectivo: 0,
	});
	const cobrarEfectivo = useRef();
	const { auth, logout } = useAuth();
	const audio = new Audio(aceptar);

	useEffect(() => {
		cobrarEfectivo.current.select();
	}, []);
	useEffect(() => {
		if (modalCobrar === true) {
			form.setFieldsValue({ efectivo: totalTotal });
			OnValuesChange();
		}
	}, [modalCobrar]);

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
		if (btnLoading === false) {
			let efectivo = parseFloat(dinero.efectivo);
			let tarjeta = parseFloat(dinero.tarjeta);
			let aCuenta = parseFloat(dinero.aCuenta);
			let total = parseFloat(totalTotal);

			if (cambio >= 0) {
				setbtnLoading(true);
				let listaComprasNew = listaCompras.map((item) => {
					return {
						apartado: item.apartado,
						cantidad: item.cantidad,
						idArray: item.key,
						nombre: item.nombre,
						precio: item.precio,
						refApartado: item.refApartado,
						totalArticulo: item.totalArticulo,
					};
				});

				try {
					const { data } = await mutateREGISTER_VENTA({
						variables: {
							input: {
								productos: listaComprasNew,
								vendedor: auth.name,
								folio: 1,
								total: total,
								efectivo: efectivo,
								tarjeta: tarjeta,
								aCuenta: aCuenta,
								pagoCon: 0,
								referencia: "",
								notas: "",
							},
						},
					});
					if (data) {
						if (keyF === "F1") {
							setfolio(data.registerVenta.folio);
							setimprimir(true);
						} else if (keyF === "F2") {
							openNotification("success", "Venta guardada con exito");
							initialState();
						}
						audio.play();
					}
				} catch (error) {
					setbtnLoading(false);
					ErrorConection(logout);
				}
			}
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
			<Imprimir
				imprimir={imprimir}
				totalTotal={totalTotal}
				cambio={cambio}
				setimprimir={setimprimir}
				dinero={dinero}
				listaCompras={listaCompras}
				setmodalCobrar={setmodalCobrar}
				folio={folio}
				auth={auth}
				initialState={initialState}
				key='keyImprimir'
			/>
			<Modal
				key='keyModal'
				style={{ top: 25 }}
				title={
					<>
						<FaMoneyBillWave style={{ marginRight: "10px" }} />
						Cobrar
					</>
				}
				visible={modalCobrar}
				onCancel={() => setmodalCobrar(!modalCobrar)}
				footer={[
					<Row justify='space-around' key='keyRowBtns'>
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
							key='keybtnf1'
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
							key='keybtnf2'
						>
							Guardar F2
						</Button>
					</Row>,
				]}
			>
				<div key='div1' style={{ textAlignLast: "center" }}>
					<h1
						key='div1h1'
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
					<Form form={form} onValuesChange={OnValuesChange} key='formPrincipal'>
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
							style={{ fontWeight: "bold", fontSize: "24px" }}
						>
							<Input
								ref={cobrarEfectivo}
								id='cobrarEfectivo'
								type='number'
								prefix={<FaMoneyBillWave style={{ color: "gray" }} />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlockCobrar}
								key='keyInputEfectivo'
								style={{ width: 400 }}
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
								key='keyInputTarjeta'
								style={{ width: 400 }}
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
								key='keyInputACuenta'
								style={{ width: 400 }}
							></Input>
						</Form.Item>
					</Form>
				</div>
				<div key='div3' style={{ textAlignLast: "center" }}>
					<h1
						key='keyh1Cambio'
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
