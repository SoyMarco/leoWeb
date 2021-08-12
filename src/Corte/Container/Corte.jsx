import React /* useState */ from "react";
import { Modal, Button } from "antd";
import "./corte.css";
import { FaCashRegister } from "react-icons/fa";

const Corte = ({ modalCorte, handleModalCorte }) => {
	// const [state, setstate] = useState("hola");
	return (
		<Modal
			title={
				<>
					<FaCashRegister /> Corte
				</>
			}
			visible={modalCorte}
			onCancel={handleModalCorte}
			footer={[
				<Button
					key="submit"
					type="primary"
					// loading={loading}
					onClick={handleModalCorte}
				>
					Cancelar
				</Button>,
			]}
		></Modal>
	);
};

export default Corte;
