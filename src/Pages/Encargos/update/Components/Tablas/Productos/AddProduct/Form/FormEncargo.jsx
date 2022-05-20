import { useEffect, useRef, useContext } from "react";
import { Form } from "antd";
import InputForm from "./FormItem/InputForm";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";

export default function FormEncargo() {
	const {
		form,
		listaProductos,
		guardarEncargo,
		cliente,
		modalAbono,
		setmodalAbono,
		btnAddAbono,
		onFinish,
	} = useContext(ReadEncargoContext);

	const refPrecio = useRef();
	const refTalla = useRef();
	const refColor = useRef();
	const refGenero = useRef();
	const refProducto = useRef();
	const refModelo = useRef();
	const refCantidad = useRef();

	useEffect(() => {
		refPrecio.current.focus();
	}, [refPrecio]);

	useEffect(() => {
		if (modalAbono === false) {
			refProducto.current.focus();
		}
	}, [modalAbono]);

	const onFinishFailed = () => {
		if (listaProductos.length > 0) {
			refModelo.current.focus();
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
		let keys = Object.keys(e);
		let [key] = keys;
		let value = e[key].toUpperCase();
		form.setFieldsValue({ [key]: value });
	};
	const pressKeyEnterEncargo = async (e) => {
		let values = form.getFieldsValue();
		if (e.keyCode === 13) {
			if (e.target.id === "precio") {
				refProducto.current.focus();
			}
			if (e.target.id === "nombre") {
				refTalla.current.focus();
			}
			if (e.target.id === "talla") {
				refColor.current.focus();
			}
			if (e.target.id === "color") {
				refGenero.current.focus();
			}
			if (e.target.id === "genero") {
				refModelo.current.focus();
			}
			if (e.target.id === "modelo") {
				refCantidad.current.focus();
			}
			if (e.target.id === "cantidad") {
				onFinish();
				// Oter cosa
				// setTimeout(() => {
				// 	refProducto.current.focus();
				// }, 100);
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
					refProducto.current.focus();
				}, 100);
			}
		}
	};

	return (
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
				label='Precio'
				name='precio'
				tooltip='Precio del Producto'
				required={true}
				reference={refPrecio}
				onKeyUp={pressKeyEnterEncargo}
				type='number'
			/>
			<InputForm
				label='Cliente'
				name='cliente'
				tooltip='Nombre'
				required={true}
				onKeyUp={pressKeyEnterEncargo}
				disabled={true}
			/>
			<InputForm
				label='Producto'
				name='nombre'
				tooltip='Qué encarga el cliente?'
				required={true}
				reference={refProducto}
				onKeyUp={pressKeyEnterEncargo}
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
			<InputForm
				label='Cantidad'
				name='cantidad'
				tooltip='Cantidad'
				reference={refCantidad}
				onKeyUp={pressKeyEnterEncargo}
				type='number'
			/>
		</Form>
	);
}
