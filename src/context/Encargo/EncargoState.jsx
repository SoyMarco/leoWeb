import { useState, useContext } from "react";
import EncargoContext from "./context";
import useService from "Components/ModalCobrar/Service/useService";
import { useMutation } from "@apollo/client";
import { REGISTER_ENCARGO } from "myGraphql/encargo";
import { openNotification } from "Utils/openNotification";
import { useNavigate } from "react-router-dom";
import AuthContext from "context/Auth/AuthContext";
import { Form } from "antd";

const EncargoState = (props) => {
	const { auth } = useContext(AuthContext);

	let navigate = useNavigate();
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

	const guardarEncargo = async () => {
		const dataSend = {
			productos: listaProductos,
			abonos: [{ abono: abono, vendedor: auth.name }],
			cliente: cliente,
			vendedor: auth.name,
			guardado: { vendedor: auth.name },
		};
		const data = await register({
			input: dataSend,
			mutate: mutateREGISTER_ENCARGO,
			// keyF,
		});

		if (data.registerEncargo === true) {
			openNotification("success", `Encargo guardado `);
			navigate("/");
		}
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
	const btnAddAbono = () => {
		let values = form.getFieldsValue();
		if (!values.nombre && listaProductos.length > 0) {
			setmodalAbono(true);
		}
	};
	return (
		<EncargoContext.Provider
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
			}}
		>
			{props.children}
		</EncargoContext.Provider>
	);
};

export default EncargoState;
