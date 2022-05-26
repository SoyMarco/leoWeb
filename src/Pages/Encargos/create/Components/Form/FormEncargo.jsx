import { useEffect, useRef, useContext } from "react";
import { Form, Row } from "antd";
import EncargoContext from "context/NewEncargo/context";
import ListClients from "Components/ListClients/ListClients";
import InputForm from "./FormItem/InputForm";

export default function FormEncargo() {
	const {
		listaProductos,
		guardarEncargo,
		cliente,
		setcliente,
		modalAbono,
		setmodalAbono,
		form,
		onFinish,
		btnAddAbono,
	} = useContext(EncargoContext);
	const refTalla = useRef();
	const refColor = useRef();
	const refGenero = useRef();
	const refProducto = useRef();
	const refModelo = useRef();
	const refPrecio = useRef();
	const refCantidad = useRef();

	useEffect(() => {
		if (modalAbono === false) {
			refProducto.current.select();
		}
	}, [modalAbono]);

	const onFinishFailed = () => {
		if (listaProductos.length > 0) {
			refModelo.current.select();
		}
	};

	const pressKeyEnter = (e) => {
		if (e.keyCode === 13 && cliente) {
			refProducto.current.select();
		}
	};

	const formItemLayout = {
		labelCol: {
			span: 5,
		},
		wrapperCol: {
			span: 19,
		},
	};
	const validateMessages = {
		// eslint-disable-next-line no-template-curly-in-string
		required: "El ${label} es requerido",
	};

	const onValuesChange = (e) => {
		const keys = Object.keys(e);
		const [key] = keys;
		const value = e[key].toUpperCase();
		form.setFieldsValue({ [key]: value });
	};
	const pressKeyEnterEncargo = async (e) => {
		let values = form.getFieldsValue();
		if (e.keyCode === 13) {
			if (e.target.id === "nombre" && values.nombre) {
				refPrecio.current.select();
			}
			if (!values.nombre && listaProductos.length > 0) {
				setmodalAbono(true);
			}
			if (e.target.id === "precio") {
				refCantidad.current.select();
			}
			if (e.target.id === "cantidad") {
				refTalla.current.select();
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
			guardarEncargo({ keyF: "F1" });
		}
		if (e.keyCode === 113 && listaProductos.length > 0) {
			guardarEncargo({ keyF: "F2" });
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
	return (
		<>
			<Row justify='end'>
				<h3 style={{ marginTop: "5px" }}>* Cliente:</h3>
				<ListClients
					cliente={cliente}
					setcliente={setcliente}
					action={pressKeyEnter}
				/>
			</Row>
			<Form
				{...formItemLayout}
				layout='horizontal'
				form={form}
				onValuesChange={onValuesChange}
				style={{ marginTop: 10 }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				validateMessages={validateMessages}
			>
				<InputForm
					label='Producto'
					name='nombre'
					tooltip='Qué encarga el cliente?'
					required={true}
					reference={refProducto}
					onKeyUp={pressKeyEnterEncargo}
				/>
				<InputForm
					label='Precio'
					name='precio'
					tooltip='Precio aproximado'
					reference={refPrecio}
					onKeyUp={pressKeyEnterEncargo}
					type='number'
				/>
				<InputForm
					label='Cantidad'
					name='cantidad'
					tooltip='Cantidad aproximado'
					reference={refCantidad}
					onKeyUp={pressKeyEnterEncargo}
					type='number'
				/>
				<InputForm
					label='Talla o Tamaño'
					name='talla'
					tooltip='Opciones de tallas o tamaños'
					reference={refTalla}
					onKeyUp={pressKeyEnterEncargo}
				/>
				<InputForm
					label='Color o Aroma'
					name='color'
					tooltip='Opciones de colores o aromas'
					reference={refColor}
					onKeyUp={pressKeyEnterEncargo}
				/>
				<InputForm
					label='Genero'
					name='genero'
					tooltip='Dama, Caballero, Niño, Niña, Bebé'
					reference={refGenero}
					onKeyUp={pressKeyEnterEncargo}
				/>
				<InputForm
					label='Modelo y/o Marca'
					name='modelo'
					tooltip='Describe el encargo (Marca, tipo, corte)'
					reference={refModelo}
					onKeyUp={pressKeyEnterEncargo}
				/>
			</Form>
		</>
	);
}
