import { useContext } from "react";
import { openNotification } from "Utils/openNotification";
import { useMutation } from "@apollo/client";
import { CANCEL_ENTREGA } from "myGraphql/apartado";
import { Button, Result } from "antd";
import ApartadoContext from "context/Apartado/ApartadoContext";
import useService from "Hooks/Service/useService";
import AuthContext from "context/Auth/AuthContext";

export default function ApartadoEntregado() {
	const { dataApartado, pasarAFecha, statusApartado, refetch } =
		useContext(ApartadoContext);
	const { isLoading } = useContext(AuthContext);

	const [mutateCANCEL_ENTREGA] = useMutation(CANCEL_ENTREGA);

	const { register } = useService();

	const cancelEntrega = async () => {
		if (dataApartado.id) {
			const isCanceled = await register({
				mutate: mutateCANCEL_ENTREGA,
				input: {
					id: dataApartado.id,
					status: !statusApartado,
				},
			});
			if (isCanceled) {
				refetch();
				openNotification(
					"success",
					`Apartado ${!statusApartado ? "ENTREGADO" : "REACTIVADO"}`
				);
			}
		}
	};

	return (
		<Result
			status='warning'
			title={`Este apartado se entregó el día ${pasarAFecha(
				dataApartado?.entregado[0]?.fecha
			)}, por ${dataApartado?.entregado[0]?.vendedor?.toUpperCase()}`}
			extra={
				<Button
					type='primary'
					key='console'
					loading={isLoading}
					onClick={() => cancelEntrega()}
				>
					Quitar entrega
				</Button>
			}
		/>
	);
}
