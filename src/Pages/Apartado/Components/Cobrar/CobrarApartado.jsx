import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import ImprimirApartado from "../ImprimirApartado/ImprimirApartado";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import { openNotification } from "Utils/openNotification";
import { Modal, Input, Form, Button, Row } from "antd";
import ErrorConection from "Utils/ErrorConection";
import aceptar from "assets/sonido/Aceptar.wav";
import { ADD_ABONO } from "myGraphql/apartado";
import { useMutation } from "@apollo/client";
import AuthContext from "context/Auth/AuthContext";
import { keyBlock } from "Utils";
import ShopListContext from "context/Shopping/ShopListContext";
import { useNavigate } from "react-router-dom";

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
	const { addProductShopList } = useContext(ShopListContext);
	let navigate = useNavigate();
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
			savePrintAbono("F1");
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
			savePrintAbono("F1");
		}
		// F2
		if (e.keyCode === 113) {
			savePrintAbono("F2");
		}
		// F3
		if (e.keyCode === 114) {
			savePrintAbono("F3");
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

	//Guardar e Imprimir APARTADO CON GraphQL
	const savePrintAbono = async (keyF) => {
		if (cambio >= 0 && btnLoading === false) {
			setbtnLoading(true);
			let ventaEfectivo = parseFloat(dinero.efectivo);
			let ventaTarjeta = parseFloat(dinero.tarjeta);
			let ventaACuenta = parseFloat(dinero.aCuenta);
			let total = parseFloat(totalTotal);
			let resta = parseFloat(calculateRestaria());
			if (keyF === "F3") {
				addProductShopList({
					nombre: dataApartado.cliente,
					precio: total,
					apartado: dataApartado.folio,
					refApartado: dataApartado.id,
					f3: true,
				});
				navigate("/");
				return;
			}
			try {
				const { data } = await mutateADD_ABONO({
					variables: {
						input: {
							id: listaCompras.id,
							abono: total,
							resta: resta,
							ventaEfectivo: ventaEfectivo,
							ventaTarjeta: ventaTarjeta,
							ventaACuenta: ventaACuenta,
							folioApartado: dataApartado.folio,
							idApartado: dataApartado.id,
							nombreCliente: dataApartado.cliente,
							keyF: keyF,
						},
					},
				});
				if (data) {
					if (keyF === "F1") {
						setdataApartadoImprimir(data.addAbono);
					} else if (keyF === "F2") {
						openNotification("success", "Abono guardado con exito");
						initialState(data);
					}
				} else {
					audio.play();
				}
			} catch (error) {
				setbtnLoading(false);
				ErrorConection(timeLogout);
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
	const memoPrint = useMemo(
		() => (
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
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[imprimir]
	);
	return (
		<>
			{memoPrint}
			<Modal
				key='modalCobrarAbonoApartado'
				style={{ top: 25 }}
				title={
					<>
						<FaMoneyBillWave
							style={{ marginRight: "10px" }}
							key='iconCobrarAbonoApartado'
						/>
						Cobrar
					</>
				}
				visible={modalCobrar}
				onCancel={() => cerrarCobrar()}
				footer={[
					<Row justify='space-around' key='rowCobrarAbonoApartado'>
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
							icon={<PrinterFilled key='iconF1AbonoApartado' />}
							loading={btnLoading}
							key='btnAbonoApartadoF1'
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
							icon={<SaveFilled key='iconF2AbonoApartado' />}
							loading={btnLoading}
							key='btnAbonoApartadoF2'
						>
							Guardar F2
						</Button>
					</Row>,
				]}
			>
				<div key='div1AbonoApartado' style={{ textAlignLast: "center" }}>
					<h1
						style={{
							fontWeight: "bold",
							fontSize: "36px",
							color: "#00000099",
							margin: 0,
						}}
						key='h1TotalTotalAbonoApartado'
					>
						Total: ${totalTotal}
					</h1>
				</div>
				<div key='div2AbonoApartado' style={{ textAlignLast: "right" }}>
					<Form form={form} onValuesChange={OnValuesChange}>
						<Form.Item
							label='Efectivo'
							name='efectivo'
							key='FormItem1AbonoApartado'
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
							key='FormItem2AbonoApartado'
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
							key='FormItem3AbonoApartado'
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
				<div key='div3AbonoApartado' style={{ textAlignLast: "center" }}>
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
						key='h1CambioAbonoApartado'
					>
						{cambio >= 0 ? `Cambio: $${cambio}` : `Faltan: $${cambio}`}
					</h1>
				</div>
			</Modal>
		</>
	);
};

export default CobrarApartado;
/* 
Example code:
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
navigate("/"); */
