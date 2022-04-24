import { useContext } from "react";
import ImprimirNewApartado from "../Components/ImprimirApartado/ImprimirNewApartado";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";
import Cobrar from "../Components/CobrarNewApartado/Cobrar";
import CardSteps from "../Components/StepsB/CardSteps";
import { Row, Col } from "antd";
import "./addApartado.css";

const AddApartado = () => {
	const { modalCobrar, cliente, imprimir } = useContext(NewAparadoContext);

	return (
		<>
			<title>{cliente ? cliente : "Nuevo Apartado"}</title>

			{modalCobrar && <Cobrar />}

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
