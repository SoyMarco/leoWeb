import { useState, useContext } from "react";
import useService from "Hooks/Service/useService";
import { REGISTER_ENCARGO } from "myGraphql/encargo";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import NewEncargoContext from "./context";
import { Form } from "antd";
import ShopListContext from "context/Shopping/ShopListContext";

export default function NewEncargoState({ children }) {
	const { auth } = useContext(AuthContext);
	const { addProductShopList, setmodalCobrar, modalCobrar } =
		useContext(ShopListContext);

	const navigate = useNavigate();
	const { register } = useService();
	const [mutateREGISTER_ENCARGO] = useMutation(REGISTER_ENCARGO);
	const [form] = Form.useForm();

	const [listaProductos, setlistaProductos] = useState([]);
	const [imprimirEncargo, setimprimirEncargo] = useState(false);
	// Descomentar depues
	// const [loader, setloader] = useState(false);
	const [abono, setabono] = useState(0);
	const [cliente, setcliente] = useState("");
	const [modalAbono, setmodalAbono] = useState(null);
	const [keyCount, setkeyCount] = useState(0);
	const [dataEncargoBack, setdataEncargoBack] = useState(undefined);

	const guardarEncargo = async ({ keyF, inputs }) => {
		let newAbono = abono;
		if (keyF === "F3") {
			newAbono = 0;
		}
		const dataSend = {
			productos: listaProductos,
			cliente: cliente,
			total: newAbono,
			ventaEfectivo: inputs?.efectivo ?? 0,
			ventaTarjeta: inputs?.tarjeta ?? 0,
			ventaACuenta: inputs?.aCuenta ?? 0,
		};
		const data = await register({
			input: dataSend,
			mutate: mutateREGISTER_ENCARGO,
			// keyF,
		});

		if (data) {
			const { registerEncargo } = data;
			setmodalCobrar(false);
			if (keyF === "F1") {
				setdataEncargoBack(registerEncargo);
				setimprimirEncargo(true);
				return;
			}

			if (keyF === "F3") {
				addProductShopList({
					nombre: registerEncargo.cliente,
					precio: parseFloat(abono),
					apartado: registerEncargo.folio,
					refApartado: registerEncargo.id,
					f3: true,
				});
			}
			navigate("/");
		}
	};
	const onFinish = () => {
		const values = form.getFieldsValue();
		if (values.nombre && cliente) {
			const productoEncargo = [
				...listaProductos,
				{
					nombre: values.nombre,
					precio: values.precio > 0 ? parseInt(values.cantidad) : 0,
					talla: values.talla,
					color: values.color,
					genero: values.genero,
					modelo: values.modelo,
					cantidad: values.cantidad > 0 ? parseInt(values.cantidad) : 1,
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
	const btnAddAbono = () => {
		const values = form.getFieldsValue();
		if (!values.nombre && listaProductos.length > 0) {
			setmodalAbono(true);
		}
	};
	return (
		<NewEncargoContext.Provider
			value={{
				listaProductos,
				setlistaProductos,
				imprimirEncargo,
				setimprimirEncargo,
				guardarEncargo,
				// loader,
				abono,
				setabono,
				cliente,
				setcliente,
				modalAbono,
				setmodalAbono,
				onFinish,
				form,
				btnAddAbono,
				modalCobrar,
				setmodalCobrar,
				dataEncargoBack,
			}}
		>
			{children}
		</NewEncargoContext.Provider>
	);
}
