import { useContext } from "react";
import ImprimirNewApartado from "../Components/ImprimirApartado/ImprimirNewApartado";
import CobrarNewApartado from "../Components/CobrarNewApartado/CobrarNewApartado";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";
import CardSteps from "../Components/StepsB/CardSteps";
import { Row, Col } from "antd";
import "./addApartado.css";

const AddApartado = () => {
	const { modalCobrar, cliente, imprimir } = useContext(NewAparadoContext);

	return (
		<>
			<title>{cliente ? cliente : "Nuevo Apartado"}</title>

			{modalCobrar && <CobrarNewApartado />}

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
