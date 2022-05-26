/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react";
import { SaveFilled } from "@ant-design/icons";
import { Row, Button, Modal } from "antd";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import FormEncargo from "../AddProduct/Form/FormEncargo";
export default function UpdateProducto() {
	const {
		encargoSelect,
		isLoading,
		form,
		dataEncargo,
		openModal,
		closeModal,
		onFinish,
	} = useContext(ReadEncargoContext);

	useEffect(() => {
		if (openModal === "UPDATE") {
			form.setFieldsValue({
				nombre: encargoSelect.nombre,
				talla: encargoSelect.talla,
				color: encargoSelect.color,
				genero: encargoSelect.genero,
				modelo: encargoSelect.modelo,
				cantidad: encargoSelect.cantidad,
				precio: encargoSelect.precio,
				cliente: dataEncargo.cliente,
			});
			return;
		}
		form.setFieldsValue({
			cliente: dataEncargo.cliente,
		});
	}, []);

	const selectTitle = () => {
		if (openModal === "UPDATE") {
			return "Modificar producto";
		}
		return "Agregar producto";
	};
	return (
		<Modal
			style={{ top: 25 }}
			title={selectTitle()}
			visible={openModal}
			onOk={() => onFinish()}
			onCancel={() => closeModal()}
			width='700px'
			footer={[
				<Row justify='space-around' key='rowBtns'>
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
						onClick={() => closeModal()}
						// icon={<PrinterFilled />}
						loading={isLoading}
						key='btnCancelar'
					>
						Cancelar
					</Button>
					<Button
						style={{
							background:
								isLoading === false
									? "linear-gradient(#32A632,#005800)"
									: "grey",
							color: "white",
							fontWeight: "bold",
							width: 230,
						}}
						shape='round'
						disabled={isLoading}
						onClick={() => onFinish()}
						icon={<SaveFilled />}
						loading={isLoading}
						key='btnGuardar'
					>
						{`Guardar (Enter)`}
					</Button>
				</Row>,
			]}
		>
			<FormEncargo />
		</Modal>
	);
}
