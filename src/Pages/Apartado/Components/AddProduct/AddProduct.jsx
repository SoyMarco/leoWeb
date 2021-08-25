import React, { useEffect, useState } from "react";
import { SaveFilled } from "@ant-design/icons";
import { GiLargeDress } from "react-icons/gi";
import { FaMoneyBillWave } from "react-icons/fa";
import { keyBlock } from "Utils";
import { Row, Button, Modal, Input, Form } from "antd";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";

import { useMutation } from "@apollo/client";
import { ADD_PRODUCTO } from "graphql/apartado";

export default function AddProduct({
	setmodalAddProduct,
	modalAddProduct,
	refetch,
	dataApartado,
}) {
	const [mutateADD_PRODUCTO] = useMutation(ADD_PRODUCTO);
	const { logout } = useAuth();
	const [btnLoading, setbtnLoading] = useState(false);
	const [btnDisabled, setbtnDisabled] = useState(true);
	const [idApartado, setidApartado] = useState(null);
	const [nombre, setnombre] = useState("");
	const [precio, setprecio] = useState(0);
	const [form] = Form.useForm();

	useEffect(() => {
		document.querySelector("#addProductNombre").select();
	}, []);
	useEffect(() => {
		if (nombre && precio > 0) {
			setbtnDisabled(false);
		} else {
			setbtnDisabled(true);
		}
		form.setFieldsValue({
			Articulo: nombre,
		});
		let { id } = 0;
		if (dataApartado) {
			id = dataApartado.id;
			setidApartado(id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nombre, precio]);

	const addProducto = async () => {
		setbtnLoading(true);
		try {
			if (idApartado) {
				const { data } = await mutateADD_PRODUCTO({
					// Parameters
					variables: {
						input: {
							id: idApartado,
							nombre: nombre,
							precio: parseFloat(precio),
						},
					},
				});
				if (data) {
					openNotification("success", `Articulo agregado con exito`);
					refetch();
					setbtnLoading(false);
					setmodalAddProduct(false);
				}
			}
		} catch (error) {
			setbtnLoading(false);
			ErrorConection(logout);
		}
	};
	const agregarProducto = () => {
		if (precio > 0 && nombre) {
			addProducto();
		} else if (!nombre && precio > 0) {
			document.querySelector("#addProductNombre").select();
		} else if (nombre && !precio) {
			document.querySelector("#addProductPrecio").select();
		} else {
		}
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			agregarProducto();
		}
	};
	return (
		<Modal
			title='Agregar producto'
			visible={modalAddProduct}
			onOk={() => agregarProducto()}
			onCancel={() => setmodalAddProduct(false)}
			footer={[
				<Row justify='space-around'>
					<Button
						style={{
							//Boton Rojo
							background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
							color: "white",
							fontWeight: "bold",
							width: 230,
						}}
						shape='round'
						// loading={loading}
						// disabled={cambio < 0}
						onClick={() => setmodalAddProduct(false)}
						// icon={<PrinterFilled />}
						loading={btnLoading}
					>
						Cancelar
					</Button>
					<Button
						style={
							btnDisabled === false
								? {
										//Boton Verde
										background: "linear-gradient(#32A632,#005800)",
										color: "white",
										fontWeight: "bold",
										width: 230,
								  }
								: {
										background: "grey",
										color: "white",
										fontWeight: "bold",
										width: 230,
								  }
						}
						shape='round'
						disabled={btnDisabled}
						onClick={() => agregarProducto()}
						icon={<SaveFilled />}
						loading={btnLoading}
					>
						{`Guardar (Enter)`}
					</Button>
				</Row>,
			]}
		>
			<Form form={form}>
				<Form.Item
					label='Articulo'
					name='Articulo'
					key='1'
					rules={[
						{
							required: false,
							message: "Please input your username!",
						},
					]}
					className='labelCobrar'
					id='inputAddProduct'
					onKeyUp={pressKeyEnter}
					onChange={(e) => setnombre(e.target.value.toUpperCase())}
					loading={btnLoading}
				>
					<Input
						value={nombre}
						id='addProductNombre'
						className='labelAddProducts'
						prefix={<GiLargeDress style={{ color: "gray" }} />}
						// onKeyUp={pressKeyPrecio}
						// onKeyDown={keyBlock}
					/>
				</Form.Item>

				<Form.Item
					label='Precio'
					name='Precio'
					key='2'
					rules={[
						{
							required: false,
							message: "Please input your username!",
						},
					]}
					className='labelCobrar'
					onKeyUp={pressKeyEnter}
					onChange={(e) => setprecio(e.target.value)}
					onKeyDown={keyBlock}
				>
					<Input
						id='addProductPrecio'
						className='labelAddProducts'
						type='number'
						min={0}
						// style={{ borderRadius: 50 }}
						prefix={<FaMoneyBillWave style={{ color: "gray" }} />}
						// onKeyUp={pressKeyPrecio}
						// onKeyDown={keyBlock}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}
