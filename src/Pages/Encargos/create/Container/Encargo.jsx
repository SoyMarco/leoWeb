import React, { useState, useEffect, useRef, useContext } from "react";
import { Input, Form, Button, Row, AutoComplete } from "antd";
import { BiAddToQueue } from "react-icons/bi";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import EncargoTable from "Pages/Encargos/create/Components/EncargoTable";
import { useApolloClient, useMutation } from "@apollo/client";
import { GET_APARTADOS_BUSCADOR } from "myGraphql/apartado";
import { FaMoneyBillAlt } from "react-icons/fa";
import { REGISTER_ENCARGO } from "myGraphql/encargo";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ModalAbonoEncargo from "../Components/ModalAbonoEncargo";
import aceptar from "assets/sonido/Aceptar.wav";
import ImprimirNewEncargo from "../Components/ImprimirEncargo/ImprimirNewEncargo";
import { keyBlockFs } from "Utils";

export default function Encargo() {
	const { auth, timeLogout } = useContext(AuthContext);
	const [mutateREGISTER_ENCARGO] = useMutation(REGISTER_ENCARGO);
	const client = useApolloClient();
	let apartadosBuscador = client.readQuery({
		query: GET_APARTADOS_BUSCADOR,
	});
	const audio = new Audio(aceptar);

	let navigate = useNavigate();
	const [optionsClientes, setoptionsClientes] = useState([]);
	const [abono, setabono] = useState(0);
	const [modalAbono, setmodalAbono] = useState(null);
	const [imprimirEncargo, setimprimirEncargo] = useState(false);
	const [loader, setloader] = useState(false);
	const refCliente = useRef();
	const refProducto = useRef();
	const refTalla = useRef();
	const refColor = useRef();
	const refGenero = useRef();
	const refModelo = useRef();
	useEffect(() => {
		document.querySelector("#clienteNuevoEncargo").select();
	}, []);
	useEffect(() => {
		if (modalAbono === false) {
			refProducto.current.select();
		}
	}, [modalAbono]);
	useEffect(() => {
		if (apartadosBuscador?.getApartados) {
			let { getApartados } = apartadosBuscador;
			let listClientes = [];
			for (let i = 0; i < getApartados.length; i++) {
				const element = getApartados[i].cliente;
				let repetido = false;
				for (let x = 0; x < listClientes.length; x++) {
					if (listClientes[x].value === element) {
						repetido = true;
					}
				}
				if (repetido === false) {
					listClientes.push({ value: element });
				}
			}
			setoptionsClientes(listClientes);
		}
	}, [apartadosBuscador]);
	const [form] = Form.useForm();
	const [listaProductos, setlistaProductos] = useState([]);
	const [cliente, setcliente] = useState("");
	const [keyCount, setkeyCount] = useState(0);

	const formItemLayout = {
		labelCol: {
			span: 4,
		},
		wrapperCol: {
			span: 16,
		},
	};
	const validateMessages = {
		// eslint-disable-next-line no-template-curly-in-string
		required: "El ${label} es requerido",
	};
	const onFinish = () => {
		let values = form.getFieldsValue();
		if (values.nombre && cliente) {
			let productoEncargo = [
				...listaProductos,
				{
					nombre: values.nombre,
					talla: values.talla,
					color: values.color,
					genero: values.genero,
					modelo: values.modelo,
					cantidad: 1,
					key: keyCount,
					vendedor: auth.name,
				},
			];
			setlistaProductos(productoEncargo);
			setkeyCount(keyCount + 1);
			form.resetFields();
		}
		if (!cliente) {
			document.querySelector("#clienteNuevoEncargo").select();
		}
	};
	const onFinishFailed = (errorInfo) => {
		if (listaProductos.length > 0) {
			refModelo.current.select();
		}
	};

	const pressKeyEnter = (e) => {
		if (e.keyCode === 13 && cliente) {
			refProducto.current.select();
		}
	};
	const pressKeyEnterEncargo = async (e) => {
		let values = form.getFieldsValue();
		if (e.keyCode === 13) {
			if (e.target.id === "nombre" && values.nombre) {
				refTalla.current.select();
			}
			if (!values.nombre && listaProductos.length > 0) {
				setmodalAbono(true);
			}
			if (e.target.id === "talla") {
				refColor.current.select();
			}
			if (e.target.id === "color") {
				refGenero.current.select();
			}
			if (e.target.id === "genero") {
				refModelo.current.select();
			}
			if (e.target.id === "modelo") {
				onFinish();
				setTimeout(() => {
					refProducto.current.select();
				}, 100);
			}
		}
		if (e.keyCode === 112 && listaProductos.length > 0) {
			setmodalAbono(true);
		}
		if (e.keyCode === 113 && listaProductos.length > 0) {
			guardarEncargo();
		}
		if (e.keyCode === 123 && cliente) {
			if (!values.nombre) {
				btnAddAbono();
			} else {
				onFinish();

				setTimeout(() => {
					refProducto.current.select();
				}, 100);
			}
		}
	};
	const guardarEncargo = async () => {
		if (loader === false) {
			try {
				const { data } = await mutateREGISTER_ENCARGO({
					variables: {
						input: {
							productos: listaProductos,
							abonos: [{ abono: abono, vendedor: auth.name }],
							cliente: cliente,
							vendedor: auth.name,
							guardado: { vendedor: auth.name },
						},
					},
				});
				if (data.registerEncargo === true) {
					audio.play();
					openNotification("success", `Encargo guardado `);
					setloader(false);
					navigate("/");
				}
			} catch (error) {
				setloader(false);
				ErrorConection(timeLogout);
			}
		}
	};
	const btnAddAbono = () => {
		let values = form.getFieldsValue();
		if (!values.nombre && listaProductos.length > 0) {
			setmodalAbono(true);
		}
	};
	const onValuesChange = (e) => {
		let keys = Object.keys(e);
		let [key] = keys;
		let value = e[key].toUpperCase();
		form.setFieldsValue({ [key]: value });
	};
	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#001e36" }}>
					ENCARGO NUEVO
				</h1>
			</Row>
			<Row style={{ marginTop: 10 }}>
				<h2>Cliente:</h2>
				<AutoComplete
					ref={refCliente}
					defaultActiveFirstOption={true}
					autoFocus={true}
					backfill={true}
					size='large'
					onKeyUp={pressKeyEnter}
					onKeyDown={keyBlockFs}
					style={{
						color: "blue",
						fontSize: "large",
						fontWeight: "bold",
						borderRadius: "50px",
						width: "80%",
						padding: "0 0 0 0px",
						border: "0 0 0 0",
					}}
					value={cliente}
					id='clienteNuevoEncargo'
					className='labelAddProducts'
					// prefix={<GiLargeDress style={{ color: "gray" }} />}
					onChange={(e) => setcliente(e.toUpperCase())}
					options={optionsClientes}
					placeholder='Nombre del cliente'
					filterOption={(inputValue, option) =>
						option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}
				/>
			</Row>
			<Form
				{...formItemLayout}
				layout='vertial'
				form={form}
				onValuesChange={onValuesChange}
				style={{ marginTop: 20 }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				validateMessages={validateMessages}
			>
				<Form.Item
					label={<h2>Producto</h2>}
					name='nombre'
					required
					tooltip='Qué encarga el cliente?'
					rules={[
						{
							required: true,
						},
					]}
				>
					<Input
						ref={refProducto}
						onKeyUp={pressKeyEnterEncargo}
						onKeyDown={keyBlockFs}
					></Input>
				</Form.Item>

				<Form.Item
					label={<h2>Talla o Tamaño</h2>}
					name='talla'
					tooltip='Opciones de tallas o tamaños'
				>
					<Input
						ref={refTalla}
						onKeyUp={pressKeyEnterEncargo}
						onKeyDown={keyBlockFs}
					></Input>
				</Form.Item>
				<Form.Item
					label={<h2>Color o Aroma</h2>}
					name='color'
					tooltip='Opciones de colores o aromas'
				>
					<Input
						ref={refColor}
						onKeyUp={pressKeyEnterEncargo}
						onKeyDown={keyBlockFs}
					></Input>
				</Form.Item>
				<Form.Item
					label={<h2>Genero </h2>}
					name='genero'
					tooltip='Dama, Caballero, Niño, Niña, Bebé'
				>
					<Input
						ref={refGenero}
						onKeyUp={pressKeyEnterEncargo}
						onKeyDown={keyBlockFs}
					></Input>
				</Form.Item>
				<Form.Item
					label={<h2>Modelo o Marca</h2>}
					tooltip='Describe el encargo (Marca, tipo, corte)'
					name='modelo'
				>
					<Input
						ref={refModelo}
						onKeyUp={pressKeyEnterEncargo}
						onKeyDown={keyBlockFs}
					></Input>
				</Form.Item>

				<Row justify='end' style={{ marginRight: 200 }}>
					<Form.Item>
						<Button
							style={{
								background: "linear-gradient(#3232A6,#000058)",
								color: "white",
								fontWeight: "bold",
								width: 230,
							}}
							shape='round'
							type='primary'
							// htmlType='submit'
							onClick={onFinish}
							icon={<BiAddToQueue style={{ margin: "5px 10px 0 0" }} />}
						>
							Añadir producto (F12)
						</Button>
					</Form.Item>
					{listaProductos.length > 0 ? (
						<>
							<Button
								shape='round'
								style={{
									marginLeft: 20,
									background: "linear-gradient(#32A632,#005800)",
									color: "white",
									fontWeight: "bold",
									width: 230,
								}}
								icon={<PrinterFilled style={{ margin: "5px 10px 0 0" }} />}
								onClick={() => setimprimirEncargo(true)}
							>
								Imprimir encargo (F1)
							</Button>
							<Button
								shape='round'
								style={{
									marginLeft: 20,
									background: "linear-gradient(#32A632,#005800)",
									color: "white",
									fontWeight: "bold",
									width: 230,
								}}
								icon={<SaveFilled style={{ margin: "5px 10px 0 0" }} />}
								onClick={guardarEncargo}
							>
								Guardar encargo (F2)
							</Button>
							<Button
								shape='round'
								style={{
									marginLeft: 20,
									background: "linear-gradient(#32A632,#005800)",
									color: "white",
									fontWeight: "bold",
									width: 230,
								}}
								icon={<FaMoneyBillAlt style={{ margin: "5px 10px 0 0" }} />}
								onClick={btnAddAbono}
							>
								Agregar abono (Enter)
							</Button>
						</>
					) : null}
				</Row>
			</Form>
			<EncargoTable
				listaProductos={listaProductos}
				setlistaProductos={setlistaProductos}
			/>
			{modalAbono ? (
				<ModalAbonoEncargo
					modalAbono={modalAbono}
					setmodalAbono={setmodalAbono}
					setabono={setabono}
					abono={abono}
					loader={loader}
					guardarEncargo={guardarEncargo}
					setimprimirEncargo={setimprimirEncargo}
				/>
			) : null}
			{imprimirEncargo && (
				<ImprimirNewEncargo
					imprimir={imprimirEncargo}
					setimprimir={setimprimirEncargo}
					totalTotal={0}
					auth={auth}
					listaProductos={listaProductos}
					abono={abono}
					cliente={cliente}
				/>
			)}
		</>
	);
}
