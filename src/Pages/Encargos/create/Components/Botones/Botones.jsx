import { useContext } from "react";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import EncargoContext from "context/NewEncargo/context";
import { FaMoneyBillAlt } from "react-icons/fa";
import { BiAddToQueue } from "react-icons/bi";
import { Button } from "antd";

export default function Botones() {
	const {
		listaProductos,
		setimprimirEncargo,
		guardarEncargo,
		onFinish,
		btnAddAbono,
	} = useContext(EncargoContext);

	return (
		<>
			{listaProductos.length > 0 && (
				<>
					<Button
						size='large'
						shape='round'
						style={{
							margin: 10,
							background: "linear-gradient(#32A632,#005800)",
							color: "white",
							fontWeight: "bold",
							width: "90%",
						}}
						icon={<FaMoneyBillAlt style={{ margin: "5px 10px 0 0" }} />}
						onClick={btnAddAbono}
					>
						Agregar abono (Enter)
					</Button>
					<Button
						size='large'
						shape='round'
						style={{
							margin: 10,
							background: "linear-gradient(#3232A6,#000058)",
							color: "white",
							fontWeight: "bold",
							width: "90%",
						}}
						icon={<PrinterFilled style={{ margin: "5px 10px 0 0" }} />}
						onClick={() => setimprimirEncargo(true)}
					>
						Imprimir encargo (F1)
					</Button>
					<Button
						size='large'
						shape='round'
						style={{
							margin: 10,
							background: "linear-gradient(#3232A6,#000058)",
							color: "white",
							fontWeight: "bold",
							width: "90%",
						}}
						icon={<SaveFilled style={{ margin: "5px 10px 0 0" }} />}
						onClick={guardarEncargo}
					>
						Guardar encargo (F2)
					</Button>
				</>
			)}
			<Button
				style={{
					margin: 10,
					fontWeight: "bold",
					width: "90%",
				}}
				shape='round'
				type='primary'
				size='large'
				onClick={onFinish}
				icon={<BiAddToQueue style={{ margin: "5px 10px 0 0" }} />}
			>
				Añadir producto (F12)
			</Button>
		</>
	);
}
