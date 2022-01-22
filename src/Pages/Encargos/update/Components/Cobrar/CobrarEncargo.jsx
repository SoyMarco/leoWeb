import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Input, Form, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import ImprimirApartado from "../ImprimirEncargo/ImprimirEncargo";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { keyBlock } from "Utils";
import { useMutation, useApolloClient } from "@apollo/client";
import { ADD_ABONO } from "myGraphql/apartado";
import { REGISTER_VENTA, VENTA_F3 } from "myGraphql/venta";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import aceptar from "assets/sonido/Aceptar.wav";

const CobrarApartado = ({
	modalCobrar,
	cerrarCobrar,
	totalTotal,
	listaCompras,
	initialState,
	calculateRestaria,
	inputAbono,
	dataApartado,
}) => {
	const { auth, timeLogout } = useContext(AuthContext);
	let navigate = useNavigate();
	const client = useApolloClient();
	const [mutateREGISTER_VENTA] = useMutation(REGISTER_VENTA);
	const [mutateADD_ABONO] = useMutation(ADD_ABONO);
	const [form] = Form.useForm();
	const [cambio, setcambio] = useState(0);
	const [imprimir, setimprimir] = useState(false);
	const [btnLoading, setbtnLoading] = useState(false);
	const [dataApartadoImprimir, setdataApartadoImprimir] = useState([]);
	const [dinero, setdinero] = useState({
		aCuenta: 0,
		tarjeta: 0,
		efectivo: 0,
	});
	const audio = new Audio(aceptar);

	const cobrarEfectivo = useRef();
	useEffect(() => {
		if (dataApartadoImprimir?.folio > 0) {
			setimprimir(true);
		}
	}, [dataApartadoImprimir]);
	useEffect(() => {
		if (modalCobrar === true) {
			form.setFieldsValue({ efectivo: totalTotal });
			OnValuesChange();
			cobrarEfectivo.current.select();
		} else if (modalCobrar === false) {
			inputAbono.current.select();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			savePrintNewV("F3");
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
		let sumaTodo = efectivo + tarjeta + aCuenta;
		let resultado = sumaTodo - total;

		setdinero({
			aCuenta: aCuenta,
			tarjeta: tarjeta,
			efectivo: efectivo,
		});
		setcambio(resultado);
	};

	//Guardar y/o Imprimir APARTADO CON GraphQL
	const savePrintAbono = async (keyF, dataVenta) => {
		if (cambio >= 0) {
			setbtnLoading(true);

			try {
				const { data } = await mutateADD_ABONO({
					variables: {
						input: {
							id: listaCompras.id,
							abono: parseFloat(totalTotal),
							resta: parseFloat(calculateRestaria()),
							idVenta: dataVenta.id,
							folioVenta: dataVenta.folio,
						},
					},
				});
				if (data) {
					if (keyF === "F1") {
						setdataApartadoImprimir(data.addAbono);
					} else if (keyF === "F2") {
						openNotification("success", "Apartado guardado con exito");
						initialState();
					}
					audio.play();
				}
			} catch (error) {
				setbtnLoading(false);
				ErrorConection(timeLogout);
			}
		}
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
				let listaComprasNew = {
					apartado: dataApartado.folio,
					cantidad: 1,
					idArray: dataApartado.folio,
					key: dataApartado.key,
					nombre: "APARTADO",
					precio: total,
					refApartado: dataApartado.id,
					totalArticulo: total,
				};
				let ventaF123 = {
					productos: listaComprasNew,
					vendedor: auth.name,
					folio: 1,
					total: total,
					efectivo: efectivo,
					tarjeta: tarjeta,
					aCuenta: aCuenta,
					pagoCon: 0,
					referencia: dataApartado.id,
					notas: "APARTADO",
				};
				if (keyF === "F3") {
					let queryF3 = client.readQuery({
						query: VENTA_F3,
					});
					if (!queryF3) {
						queryF3 = { ventaF3: [ventaF123] };
					} else {
						let arrayNew = [];
						for (let i = 0; i < queryF3.ventaF3.length; i++) {
							const element = queryF3.ventaF3[i];
							arrayNew.push(element);
						}
						arrayNew.push(ventaF123);

						queryF3 = { ventaF3: arrayNew };
					}

					client.writeQuery({
						query: VENTA_F3,
						data: queryF3,
						variables: {
							id: 5,
						},
					});

					navigate("/");
				} else {
					try {
						const { data } = await mutateREGISTER_VENTA({
							variables: {
								input: ventaF123,
							},
						});
						if (data) {
							savePrintAbono(keyF, data.registerVenta);
						}
					} catch (error) {
						ErrorConection(timeLogout);
						setbtnLoading(false);
					}
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
			{/* {imprimir ? ( */}
			<ImprimirApartado
				imprimir={imprimir}
				setimprimir={setimprimir}
				totalTotal={totalTotal}
				listaCompras={listaCompras}
				initialState={initialState}
				calculateRestaria={calculateRestaria}
				dataApartado={dataApartadoImprimir}
				auth={auth}
				dinero={dinero}
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
