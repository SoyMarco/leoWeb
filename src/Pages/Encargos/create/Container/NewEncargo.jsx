import { useContext } from "react";
import ImprimirNewEncargo from "../Components/ImprimirEncargo/ImprimirNewEncargo";
import EncargoTable from "Pages/Encargos/create/Components/Table/Table";
import ModalAbonoEncargo from "../Components/ModalAbono/ModalAbono";
import FormEncargo from "../Components/Form/FormEncargo";
import EncargoContext from "context/NewEncargo/context";
import { Row, Col } from "antd";
import Botones from "../Components/Botones/Botones";
import ModalCobrar from "Components/ModalCobrar/Container/ModalCobrar";
import ShopListContext from "context/Shopping/ShopListContext";

export default function NewEncargo() {
	const { modalAbono, guardarEncargo } = useContext(EncargoContext);
	const { modalCobrar } = useContext(ShopListContext);

	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#001e36" }}>
					NUEVO ENCARGO
				</h1>
			</Row>
			<Row justify='space-around' align='middle'>
				<Col flex='70%'>
					{modalAbono ? <ModalAbonoEncargo /> : <FormEncargo />}
					<Botones />
				</Col>
				<Col>
					<ImprimirNewEncargo />
				</Col>
			</Row>

			<EncargoTable />

			{modalCobrar && <ModalCobrar saveAndPrint={guardarEncargo} />}
		</>
	);
}
