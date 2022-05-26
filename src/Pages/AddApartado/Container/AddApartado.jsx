import { useContext } from "react";
import ImprimirNewApartado from "../Components/ImprimirApartado/ImprimirNewApartado";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";
import ShopListContext from "context/Shopping/ShopListContext";
import Cobrar from "../Components/CobrarNewApartado/Cobrar";
import CardSteps from "../Components/StepsB/CardSteps";
import { Row, Col } from "antd";
import "./addApartado.css";

const AddApartado = () => {
	const { cliente, imprimir } = useContext(NewAparadoContext);
	const { modalCobrar } = useContext(ShopListContext);

	return (
		<>
			<title>{cliente ? cliente : "Nuevo Apartado"}</title>

			{modalCobrar && <Cobrar />}
			<Row justify='center'>
				<h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#001e36" }}>
					NUEVO APARTADO
				</h1>
			</Row>
			<Row justify='space-around'>
				{imprimir === false && (
					<Col flex='70%'>
						<CardSteps />
					</Col>
				)}
				<Col>
					<ImprimirNewApartado />
				</Col>
			</Row>
		</>
	);
};
export default AddApartado;
