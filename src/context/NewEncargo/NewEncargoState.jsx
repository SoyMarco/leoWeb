import { useState, useContext } from "react";
import useService from "Components/ModalCobrar/Service/useService";
import { openNotification } from "Utils/openNotification";
import { REGISTER_ENCARGO } from "myGraphql/encargo";
import AuthContext from "context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import NewEncargoContext from "./context";
import { Form } from "antd";

export default function NewEncargoState({ children }) {
	const { auth } = useContext(AuthContext);

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
		const values = form.getFieldsValue();
		if (values.nombre && cliente) {
			const productoEncargo = [
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
			}}
		>
			{children}
		</NewEncargoContext.Provider>
	);
}
