import { useContext } from "react";
import ModalCobrar from "Components/ModalCobrar/Container/ModalCobrar";
import ApartadoContext from "context/Apartado/ApartadoContext";

export default function Cobrar() {
	const { saveAndPrint } = useContext(ApartadoContext);

	return <ModalCobrar saveAndPrint={saveAndPrint} />;
}
