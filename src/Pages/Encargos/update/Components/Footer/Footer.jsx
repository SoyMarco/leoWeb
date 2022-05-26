import { useContext } from "react";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import { CalendarOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";

export default function Footer() {
	const { resta, restaria, dataEncargo, pasarAFecha } =
		useContext(ReadEncargoContext);

	const styleRestaria = () => {
		if (restaria >= 0) return "restariaStyle restariaVerde";
		return "restariaStyle restariaRojo";
	};

	return (
		<Row justify='space-around'>
			<Button
				disabled={true}
				shape='round'
				className='btnFecha'
				icon={
					<CalendarOutlined style={{ fontSize: "large", marginRight: 5 }} />
				}
			>
				{pasarAFecha(dataEncargo?.createAt, "LL")}
			</Button>
			<h1 className={styleRestaria()}>{`Restaría $${restaria}`}</h1>
			<h1 className='totalRestaApartado'>{resta !== 0 && `Resta $${resta}`}</h1>
		</Row>
	);
}
