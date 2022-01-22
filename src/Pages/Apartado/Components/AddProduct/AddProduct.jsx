import React, { useEffect, useState, useContext } from "react";
import { Row, Button, Modal, Input, Form, AutoComplete } from "antd";
import { GET_PRODUCTS_NAME, ADD_PRODUCTO } from "myGraphql/apartado";
import { openNotification } from "Utils/openNotification";
import { useQuery, useMutation } from "@apollo/client";
import ErrorConection from "Utils/ErrorConection";
import { FaMoneyBillWave } from "react-icons/fa";
import { SaveFilled } from "@ant-design/icons";
import { GiLargeDress } from "react-icons/gi";
import { keyBlock } from "Utils";
import AuthContext from "context/Auth/AuthContext";

export default function AddProduct({
	setmodalAddProduct,
	modalAddProduct,
	refetch,
	dataApartado,
	initialState,
}) {
	const { timeLogout } = useContext(AuthContext);
	const [mutateADD_PRODUCTO] = useMutation(ADD_PRODUCTO);
	let { data: getProductsName } = useQuery(GET_PRODUCTS_NAME);
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
		if (btnLoading === false) {
			try {
				if (idApartado) {
					const { data: dataAddProd } = await mutateADD_PRODUCTO({
						// Parameters
						variables: {
							input: {
								id: idApartado,
								nombre: nombre,
								precio: parseFloat(precio),
							},
						},
					});
					if (dataAddProd) {
						let data = { addAbono: dataAddProd.addProducto };

						openNotification("success", `Articulo agregado con exito`);
						initialState(data);
						setmodalAddProduct(false);
					}
				}
			} catch (error) {
				setbtnLoading(false);
				ErrorConection(timeLogout);
			}
		}
	};
	const agregarProducto = () => {
		if (precio > 0 && nombre) {
			addProducto();
		} else if (!nombre && precio > 0) {
			document.querySelector("#addProductNombre").select();
		} else if (nombre && !precio) {
			document.querySelector("#addProductPrecio").select();
		}
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			agregarProducto();
		}
	};
	const keyNumber = (e) => {
		if (e.keyCode >= 96 && e.keyCode <= 105) {
			document.querySelector("#addProductPrecio").select();
		}
	};
	return (
		<Modal
			key='modalAddProduct'
			title='Agregar producto'
			visible={modalAddProduct}
			onOk={() => agregarProducto()}
			onCancel={() => setmodalAddProduct(false)}
			footer={[
				<Row justify='space-around' key='rowModalAddProduct'>
					<Button
						style={{
							//Boton Rojo
							background: "linear-gradient(#F53636,#D32F2F,#8B0000)",
							color: "white",
							fontWeight: "bold",
							width: 230,
						}}
						shape='round'
						onClick={() => setmodalAddProduct(false)}
						loading={btnLoading}
						key='btnCancelarAddProduct'
					>
						Cancelar
					</Button>
					<Button
						style={{
							//Boton Verde
							background:
								btnDisabled === false
									? "linear-gradient(#32A632,#005800)"
									: "grey",
							color: "white",
							fontWeight: "bold",
							width: 230,
						}}
						shape='round'
						disabled={btnDisabled}
						onClick={() => agregarProducto()}
						icon={<SaveFilled key='iconguardarProduct' />}
						loading={btnLoading}
						key='btnGuardarProduct'
					>
						Guardar (Enter)
					</Button>
				</Row>,
			]}
		>
			<Form form={form} key='FormAddProduct'>
				<Form.Item
					label='Articulo'
					name='Articulo'
					rules={[
						{
							required: false,
							message: "Please input your username!",
						},
					]}
					className='labelCobrar'
					id='inputAddProduct'
					onChange={(e) => setnombre(e.target.value.toUpperCase())}
					key='FormItemArticulo'
				>
					<AutoComplete
						defaultActiveFirstOption={true}
						autoFocus={true}
						backfill={true}
						size='large'
						onKeyUp={pressKeyEnter}
						onKeyDown={keyNumber}
						style={{
							color: "green",
							fontSize: "large",
							fontWeight: "bold",
							borderRadius: "50px",
							width: "100%",
							padding: "0 0 0 0px",
							border: "0 0 0 0",
						}}
						value={nombre}
						id='addProductNombre'
						className='labelAddProducts'
						prefix={
							<GiLargeDress
								style={{ color: "gray" }}
								key='iconautompleteProduct'
							/>
						}
						onChange={(e) => setnombre(e.toUpperCase())}
						options={getProductsName?.getProductsName}
						placeholder='Ingresa la prenda'
						filterOption={(inputValue, option) =>
							option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
							-1
						}
						key='nameAutocompleteAddProduct'
					/>
				</Form.Item>

				<Form.Item
					label='Precio'
					name='Precio'
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
					key='FormItemPrecio'
				>
					<Input
						id='addProductPrecio'
						className='labelAddProducts'
						type='number'
						min={0}
						prefix={
							<FaMoneyBillWave
								style={{ color: "gray" }}
								key='iconinputprecioProduct'
							/>
						}
						key='inputprecioProduct'
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}
