import { Input, Form, Button, Row, AutoComplete } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import EncargoTable from "Pages/Encargo/Components/EncargoTable";
import { useApolloClient, useMutation } from "@apollo/client";
import { GET_APARTADOS_BUSCADOR } from "graphql/apartado";
import { FaMoneyBillAlt } from "react-icons/fa";
import { REGISTER_ENCARGO } from "graphql/encargo";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
import { useHistory } from "react-router-dom";

export default function Encargo() {
	const [mutateREGISTER_ENCARGO] = useMutation(REGISTER_ENCARGO);
	const client = useApolloClient();
	let apartadosBuscador = client.readQuery({
		query: GET_APARTADOS_BUSCADOR,
	});
	const history = useHistory();
	const { auth, logout } = useAuth();
	const [optionsClientes, setoptionsClientes] = useState([]);
	const [loader, setloader] = useState(false);
	const refCliente = useRef();
	const refProducto = useRef();
	const refTalla = useRef();
	const refColor = useRef();
	const refGenero = useRef();
	const refModelo = useRef();

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
		console.log("apartadosBuscador", apartadosBuscador);
	}, [apartadosBuscador]);
	const [form] = Form.useForm();
	const [listaProductos, setlistaProductos] = useState([]);
	const [cliente, setcliente] = useState("");
	const [keyCount, setkeyCount] = useState(0);
	const onValuesChange = () => {
		let unomas = form.getFieldsValue();
		console.log("1", unomas);
	};

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
	const onFinish = (values) => {
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

		console.log(productoEncargo);
		setlistaProductos(productoEncargo);
		setkeyCount(keyCount + 1);
		form.resetFields();
		if (cliente !== "") {
			refProducto.current.select();
		} else {
			document.querySelector("#clienteNuevoEncargo").select();
		}
	};
	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
		if (listaProductos.length > 0) {
			refModelo.current.select();
		}
	};

	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			refProducto.current.select();
		}
	};
	const guardarEncargo = async () => {
		if (loader === false) {
			try {
				const { data } = await mutateREGISTER_ENCARGO({
					variables: {
						input: {
							productos: listaProductos,
							abonos: [{ abono: 10, vendedor: auth.name }],
							cliente: cliente,
						},
					},
				});
				if (data) {
					openNotification("success", `Encargo guardado `);
					setloader(false);
					history.push("/");
				}
			} catch (error) {
				setloader(false);
				ErrorConection(logout);
			}
		}
	};
	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "darkblue" }}>
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
					placeholder='Ingresa la prenda'
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
					<Input ref={refProducto}></Input>
				</Form.Item>

				<Form.Item
					label={<h2>Talla o Tamaño</h2>}
					name='talla'
					tooltip='Opciones de tallas o tamaños'
				>
					<Input ref={refTalla}></Input>
				</Form.Item>
				<Form.Item
					label={<h2>Color o Aroma</h2>}
					name='color'
					tooltip='Opciones de colores o aromas'
				>
					<Input ref={refColor}></Input>
				</Form.Item>
				<Form.Item
					label={<h2>Genero</h2>}
					name='genero'
					tooltip='Dama, Caballero, Niño, Niña, Bebé'
				>
					<Input ref={refGenero}></Input>
				</Form.Item>
				<Form.Item
					label={<h2>Modelo</h2>}
					tooltip='Describe el encargo'
					name='modelo'
				>
					<Input ref={refModelo}></Input>
				</Form.Item>

				<Row justify='end' style={{ marginRight: 200 }}>
					<Form.Item>
						<Button
							shape='round'
							type='primary'
							htmlType='submit'
							icon={<BiAddToQueue style={{ margin: "5px 10px 0 0" }} />}
						>
							Añadir producto
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
		</>
	);
}
