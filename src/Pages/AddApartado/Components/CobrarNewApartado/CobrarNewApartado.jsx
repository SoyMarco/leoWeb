import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Input, Form, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import ImprimirApartado from "../ImprimirApartado/ImprimirNewApartado";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { keyBlock } from "Utils";
import { useMutation } from "@apollo/client";
import { REGISTER_APARTADO, REGISTER_APARTADO_F3 } from "myGraphql/apartado";
import AuthContext from "context/Auth/AuthContext";
import aceptar from "assets/sonido/Aceptar.wav";
import ShopListContext from "context/Shopping/ShopListContext";
import { useNavigate } from "react-router-dom";

const CobrarNewApartado = ({
	modalCobrar,
	cerrarCobrar,
	totalTotal,
	listaCompras,
	initialState,
	calculateRestaria,
	inputAbono,
	cliente,
}) => {
	const { addProductShopList } = useContext(ShopListContext);
	const { auth, timeLogout } = useContext(AuthContext);
	const [mutateREGISTER_APARTADO] = useMutation(REGISTER_APARTADO);
	const [mutateREGISTER_APARTADO_F3] = useMutation(REGISTER_APARTADO_F3);
	const [form] = Form.useForm();
	const [cambio, setcambio] = useState(0);
	const [imprimir, setimprimir] = useState(false);
	const [btnLoading, setbtnLoading] = useState(false);
	const [dataApartado, setdataApartado] = useState([]);
	const [dinero, setdinero] = useState({
		aCuenta: 0,
		tarjeta: 0,
		efectivo: 0,
	});
	let navigate = useNavigate();

	const audio = new Audio(aceptar);
	const inputEfectivo = useRef();
	useEffect(() => {
		if (modalCobrar === true) {
			form.setFieldsValue({ efectivo: totalTotal });
			OnValuesChange();
			inputEfectivo.current.select();
		} else if (modalCobrar === false) {
			inputAbono.current.select();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalCobrar]);
	const pressKeyPrecio = (e) => {
		// Enter
		if (e.keyCode === 13) {
			savePrintAbono("F1");
		}
		// 	F1
		if (e.keyCode === 112) {
			savePrintAbono("F1");
		}
		// F2
		if (e.keyCode === 113) {
			savePrintAbono("F2");
		}
		// F3
		if (e.keyCode === 114) {
			registrarApartadoF3();
		}

		// E
		if (e.keyCode === 69) {
			inputEfectivo.current.select();
		}
		// A
		if (e.keyCode === 65) {
			document.querySelector("#cobraraCuenta").select();
		}
		// T
		if (e.keyCode === 84) {
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
	const savePrintAbono = async (keyF) => {
		if (cambio >= 0 && auth.name && btnLoading === false) {
			setbtnLoading(true);
			let ventaEfectivo = parseFloat(dinero.efectivo);
			let ventaTarjeta = parseFloat(dinero.tarjeta);
			let ventaACuenta = parseFloat(dinero.aCuenta);
			try {
				const { data } = await mutateREGISTER_APARTADO({
					variables: {
						input: {
							productos: listaCompras,
							cliente: cliente,
							total: parseFloat(totalTotal),
							ventaEfectivo: ventaEfectivo,
							ventaTarjeta: ventaTarjeta,
							ventaACuenta: ventaACuenta,
						},
					},
				});
				if (data) {
					if (keyF === "F1") {
						setdataApartado(await data.registerApartado);
						setimprimir(true);
					} else if (keyF === "F2") {
						openNotification("success", "Apartado guardado con exito");
						initialState();
						audio.play();
					}
					setbtnLoading(false);
				}
			} catch (error) {
				setbtnLoading(false);
				ErrorConection(timeLogout);
			}
		}
	};

	const registrarApartadoF3 = async () => {
		if (auth.name && btnLoading === false) {
			setbtnLoading(true);
			try {
				const { data } = await mutateREGISTER_APARTADO_F3({
					variables: {
						input: {
							productos: listaCompras,
							cliente: cliente,
						},
					},
				});
				if (data) {
					let { registerApartadoF3 } = data;
					addProductShopList({
						nombre: registerApartadoF3.cliente,
						precio: parseFloat(totalTotal),
						apartado: registerApartadoF3.folio,
						refApartado: registerApartadoF3.id,
						f3: true,
					});
					navigate("/");
					initialState();

					setbtnLoading(false);
				}
			} catch (error) {
				setbtnLoading(false);
				ErrorConection(timeLogout);
			}
		}
	};
	return (
		<>
			<ImprimirApartado
				imprimir={imprimir}
				setimprimir={setimprimir}
				totalTotal={totalTotal}
				listaCompras={listaCompras}
				initialState={initialState}
				calculateRestaria={calculateRestaria}
				dataApartado={dataApartado}
				auth={auth}
				dinero={dinero}
				cambio={cambio}
			/>
			<Modal
				key='modalCobrarNewApatado'
				style={{ top: 25 }}
				title={
					<>
						<FaMoneyBillWave
							style={{ marginRight: "10px" }}
							key='iconCobrarCobrarNewApatado'
						/>
						Cobrar
					</>
				}
				visible={modalCobrar}
				onCancel={() => cerrarCobrar()}
				footer={[
					<Row justify='space-around' key='RowCobrarNewApatado'>
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
							onClick={() => savePrintAbono("F1")}
							icon={<PrinterFilled key='iconF1CobrarNewApatado' />}
							loading={btnLoading}
							key='btnF1'
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
							onClick={() => savePrintAbono("F2")}
							icon={<SaveFilled key='iconF2CobrarNewApatado' />}
							loading={btnLoading}
							key='btnF2'
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
						key='h1CobrarCobrarNewApatado'
					>
						Abono: ${totalTotal}
					</h1>
				</div>
				<div key='div2' style={{ textAlignLast: "right" }}>
					<Form form={form} onValuesChange={OnValuesChange}>
						<Form.Item
							label='Efectivo'
							name='efectivo'
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className='labelCobrar'
							key='formItem1'
						>
							<Input
								id='cobrarEfectivo'
								className='inputCobrar'
								ref={inputEfectivo}
								autoFocus
								type='number'
								prefix={<FaMoneyBillWave style={{ color: "gray" }} />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
								key='inputEfectivoCobrarNewApatado'
							></Input>
						</Form.Item>
						<Form.Item
							label='Tarjeta'
							name='tarjeta'
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className='labelCobrar'
							key='formItem2'
						>
							<Input
								id='cobrarTarjeta'
								className='inputCobrar'
								type='number'
								prefix={<FaCreditCard style={{ color: "gray" }} />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
								key='inputTarjetaCobrarNewApatado'
							></Input>
						</Form.Item>
						<Form.Item
							label='A cuenta'
							name='aCuenta'
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className='labelCobrar'
							key='formItem3'
						>
							<Input
								id='cobraraCuenta'
								className='inputCobrar'
								type='number'
								prefix={<FaStoreAlt style={{ color: "gray" }} />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
								key='inputACuentaCobrarNewApatado'
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
						key='h1CambioNewApatado'
					>
						{cambio >= 0 ? `Cambio: $${cambio}` : `Faltan: $${cambio}`}
					</h1>
				</div>
			</Modal>
		</>
	);
};

export default CobrarNewApartado;
