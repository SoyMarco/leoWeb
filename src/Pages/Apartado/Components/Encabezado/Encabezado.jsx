import { useContext } from "react";
import {
	DollarCircleFilled,
	DeleteFilled,
	PrinterFilled,
} from "@ant-design/icons";
import { Row, Input, Button, Popconfirm, Switch, Tooltip } from "antd";
import { keyBlock } from "Utils";
import AuthContext from "context/Auth/AuthContext";
import ApartadoContext from "context/Apartado/ApartadoContext";
import { useNavigate } from "react-router-dom";
import { CANCELAR_APARTADO } from "myGraphql/apartado";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";
import useService from "Components/ModalCobrar/Service/useService";
import ShopListContext from "context/Shopping/ShopListContext";
export default function Encabezado({ refetch }) {
	const {
		dataApartado,
		inputAbono,
		abono,
		calculateRestaria,
		setmodalCobrar,
		setabono,
		setimprimir,
		statusApartado,
	} = useContext(ApartadoContext);
	const { isLoading } = useContext(AuthContext);
	const { settotalTotal } = useContext(ShopListContext);
	const { register } = useService();
	const [mutateCANCELAR_APARTADO] = useMutation(CANCELAR_APARTADO);

	const navigate = useNavigate();

	const pressEnter = () => {
		if (abono.abono > 0 && calculateRestaria() >= 0) {
			settotalTotal(abono.abono);
			setmodalCobrar(true);
		}
	};
	const pressKeyAbono = (e) => {
		if (e.keyCode === 13) {
			pressEnter();
		}
		// ESC
		if (e.keyCode === 27) {
			if (abono.abono > 0) {
				setabono({ abono: null });
			} else {
				navigate("/");
			}
		}
		// Reimprimir
		if (e.keyCode === 112) {
			setimprimir(true);
		}
		if (e.keyCode === 123) {
			pressEnter();
		}
		// F6 abrir ventana
		if (e.keyCode === 117) {
			document.getElementById("linkNewWindow").click();
		}
		// Cuenta
		if (e.keyCode === 67) {
			navigate("/");
		}
	};
	const titlePopconfirm = () => {
		let title = "¿Deseas  RECUPERAR este apartado?";
		if (statusApartado) {
			title = "¿Deseas  DESACTIVAR este apartado?";
		}
		return title;
	};
	const titleTooltip = () => {
		let title = "APARTADO INACTIVO";
		if (statusApartado) {
			title = "APARTADO ACTIVO";
		}
		return title;
	};
	const cancelarApartado = async () => {
		if (dataApartado.id) {
			const isCanceled = await register({
				mutate: mutateCANCELAR_APARTADO,
				input: {
					id: dataApartado.id,
					status: !statusApartado,
				},
			});
			if (isCanceled) {
				refetch();
				openNotification(
					"success",
					`Apartado ${statusApartado ? "CANCELADO" : "REACTIVADO"}`
				);
			}
		}
	};
	return (
		<>
			<Row
				justify='space-around'
				style={{
					background: "linear-gradient(#000066, #000058, #000036)",
					padding: "7px",
					borderRadius: "25px 5px 0 0",
				}}
			>
				<h1
					style={{
						color: "white",
						fontSize: "x-large",
						fontWeight: "bold",
					}}
				>{`Folio: ${dataApartado.folio}`}</h1>
				<Tooltip
					placement='top'
					title={`
							(F1)Imprimir
							  (F12)ENTREGAR`}
				>
					<Input
						ref={inputAbono}
						placeholder='Abono'
						disabled={!statusApartado}
						style={{
							color: "green",
							fontSize: "x-large",
							fontWeight: "bold",
							borderRadius: "50px",
							maxWidth: "60%",
							padding: "0 0 0 0px",
							border: "0 0 0 0",
						}}
						prefix={<DollarCircleFilled style={{ marginLeft: "10px" }} />}
						onKeyUp={pressKeyAbono}
						onKeyDown={keyBlock}
						value={abono.abono}
						onChange={(e) => setabono({ abono: e.target.value })}
					/>
				</Tooltip>
				<Row>
					<Button
						disabled={!statusApartado || isLoading}
						loading={isLoading}
						shape='round'
						style={{
							background: statusApartado
								? "linear-gradient(#2196F3,#0000E6)"
								: "gray",
							marginTop: 5,
							marginRight: 15,
							color: "white",
							border: 0,
							fontWeight: "bold",
						}}
						onClick={() => setimprimir(true)}
						icon={
							<PrinterFilled style={{ fontSize: "large", marginRight: 5 }} />
						}
					>
						Reimprimir
					</Button>

					<Tooltip placement='top' title={() => titleTooltip()}>
						<Popconfirm
							title={() => titlePopconfirm()}
							onConfirm={() => cancelarApartado()}
							icon={
								<DeleteFilled style={{ color: "red", fontSize: "large" }} />
							}
							loading={isLoading}
							disabled={isLoading}
						>
							<Switch
								loading={isLoading}
								checked={statusApartado}
								style={{
									marginTop: 10,
									marginRight: 5,
									background: statusApartado ? "limegreen" : "red",
									boxShadow: statusApartado
										? "5px 5px 29px #b3b3b3, -5px -5px 29px #ffffff"
										: null,
								}}
								defaultChecked
							></Switch>
						</Popconfirm>
					</Tooltip>
				</Row>
			</Row>
			<h1 className='nameClient'>{`Cliente:  ${dataApartado?.cliente}`}</h1>
		</>
	);
}
