import { useContext } from "react";
import ImprimirNewEncargo from "../Components/ImprimirEncargo/ImprimirNewEncargo";
import EncargoTable from "Pages/Encargos/create/Components/Table/Table";
import ModalAbonoEncargo from "../Components/ModalAbono/ModalAbono";
import FormEncargo from "../Components/Form/FormEncargo";
import EncargoContext from "context/Encargo/context";
import { Row, Col } from "antd";
import Botones from "../Components/Botones/Botones";

export default function Encargo() {
	const { imprimirEncargo, modalAbono } = useContext(EncargoContext);

	return (
		<>
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#001e36" }}>
					ENCARGO NUEVO
				</h1>
			</Row>
			<Row>
				<Col lg={17}>
					<FormEncargo />
				</Col>
				<Col lg={7}>
					<Botones />
				</Col>
			</Row>
			<EncargoTable />
			{modalAbono && <ModalAbonoEncargo />}
			{imprimirEncargo && <ImprimirNewEncargo />}
		</>
	);
}
