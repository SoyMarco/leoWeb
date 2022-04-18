import { useState } from "react";
import { Button } from "antd";
import TablaPerfumes from "../Components/TablaPerfumes/TablaPerfumes";
import { GiDelicatePerfume } from "react-icons/gi";
import ModalAddPerfume from "../Components/ModalAddPerfume/ModalAddPerfume";

export default function Perfumes() {
	const [modalAddVisible, setmodalAddVisible] = useState(false);
	return (
		<>
			<Button
				type='primary'
				shape='round'
				size='large'
				icon={<GiDelicatePerfume />}
				onClick={() => setmodalAddVisible(true)}
			>
				Agregar
			</Button>

			<ModalAddPerfume
				modalAddVisible={modalAddVisible}
				setmodalAddVisible={setmodalAddVisible}
			/>
			<TablaPerfumes />
		</>
	);
}
