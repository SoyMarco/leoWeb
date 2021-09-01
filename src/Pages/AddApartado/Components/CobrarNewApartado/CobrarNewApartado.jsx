import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import ImprimirApartado from "../ImprimirApartado/ImprimirNewApartado";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { keyBlock } from "Utils";
import { useMutation } from "@apollo/client";
import { REGISTER_APARTADO, GET_FOLIO_MAX_APARTADO } from "graphql/apartado";
import { REGISTER_VENTA } from "graphql/venta";
import useAuth from "hooks/useAuth";

// import "./cobrar.css";

const CobrarNewApartado = ({
	modalCobrar,
	setmodalCobrar,
	cerrarCobrar,
	totalTotal,
	listaCompras,
	initialState,
	calculateRestaria,
	inputAbono,
	cliente,
}) => {
	let [mutateGET_FOLIO_MAX_APARTADO] = useMutation(GET_FOLIO_MAX_APARTADO);
	const { auth, logout } = useAuth();

	const [mutateREGISTER_VENTA] = useMutation(REGISTER_VENTA);
	const [mutateREGISTER_APARTADO] = useMutation(REGISTER_APARTADO);
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

	useEffect(() => {
		if (modalCobrar === true) {
			form.setFieldsValue({ efectivo: totalTotal });
			OnValuesChange();
			document.querySelector("#cobrarEfectivo").select();
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
		// 	F1
		if (e.keyCode === 112) {
			savePrintNewV("F1");
		}
		// F2
		if (e.keyCode === 113) {
			savePrintNewV("F2");
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
				try {
					const { data: FolioMax } = await mutateGET_FOLIO_MAX_APARTADO({
						variables: {
							input: {
								status: true,
							},
						},
					});
					let folioApartado = FolioMax?.getFolioMaxApartado?.folio;
					let listaComprasNew = {
						apartado: folioApartado,
						cantidad: 1,
						idArray: folioApartado,
						nombre: "APARTADO",
						precio: total,
						refApartado: "Apartado",
						totalArticulo: total,
					};
					if (folioApartado) {
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
									referencia: "Apartado",
									notas: "APARTADO",
								},
							},
						});
						if (await data) {
							savePrintAbono(keyF, data.registerVenta);
						}
					}
				} catch (error) {
					ErrorConection(logout);
					return false;
				}
			}
		}
	};

	//Guardar y/o Imprimir APARTADO CON GraphQL
	const savePrintAbono = async (keyF, dataVenta) => {
		let abonos = [
			{
				abono: parseFloat(totalTotal),
				vendedor: auth.name,
				idVenta: dataVenta.id,
				folioVenta: dataVenta.folio,
			},
		];
		if (cambio >= 0) {
			setbtnLoading(true);
			try {
				const { data } = await mutateREGISTER_APARTADO({
					variables: {
						input: {
							productos: listaCompras,
							vendedor: auth.name,
							cliente: cliente,
							abonos: abonos,
							folio: 1,
							total: parseFloat(totalTotal),
							referencia: "",
							notas: "",
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
					}
				}
			} catch (error) {
				setbtnLoading(false);
				ErrorConection(logout);
			}
		}
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
				dataApartado={dataApartado}
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
							style={{
								background: "linear-gradient(#32A632,#005800)",
								color: "white",
								fontWeight: "bold",
								width: 230,
							}}
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
							style={{
								background: "linear-gradient(#3232A6,#000058)",
								color: "white",
								fontWeight: "bold",
								width: 230,
							}}
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
						Abono: ${totalTotal}
					</h1>
				</div>
				<div key='div2' style={{ textAlignLast: "right" }}>
					<Form form={form} onValuesChange={OnValuesChange}>
						<Form.Item
							label='Efectivo'
							name='efectivo'
							key='formItem1'
							rules={[
								{
									required: false,
									message: "Please input your username!",
								},
							]}
							className='labelCobrar'
						>
							<Input
								id='cobrarEfectivo'
								className='inputCobrar'
								type='number'
								prefix={<FaMoneyBillWave style={{ color: "gray" }} />}
								onKeyUp={pressKeyPrecio}
								onKeyDown={keyBlock}
							></Input>
						</Form.Item>
						<Form.Item
							label='Tarjeta'
							name='tarjeta'
							key='formItem2'
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
							key='formItem3'
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

export default CobrarNewApartado;
