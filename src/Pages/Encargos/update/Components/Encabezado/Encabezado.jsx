import { useContext } from "react";
import { Row, Input, Button, Tooltip } from "antd";
import { keyBlock } from "Utils";
import { DollarCircleFilled, PrinterFilled } from "@ant-design/icons";
import ReadEncargoContext from "context/Encargos/ReadEcargo/context";
import SwitchB from "Pages/Encargos/Components/Switch/SwitchB";

export default function Encabezado() {
	const {
		dataEncargo,
		statusEncargo,
		guardarEncargo,
		loader,
		inputAbono,
		abono,
		setabono,
		setmodalReimprimir,
	} = useContext(ReadEncargoContext);

	return (
		<Row
			justify='space-around'
			style={{
				background: "#1873b9",
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
			>
				{`Folio: ${dataEncargo?.folio}`}
			</h1>
			<Tooltip
				placement='top'
				title={`
							(F1)Imprimir
							  (F12)ENTREGAR`}
			>
				<Input
					ref={inputAbono}
					placeholder='Abono'
					disabled={!statusEncargo}
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
					// onKeyUp={pressKeyAbono}
					onKeyDown={keyBlock}
					value={abono.abono}
					onChange={(e) => setabono({ abono: e.target.value })}
					type='number'
				/>
			</Tooltip>

			<Button
				disabled={!statusEncargo || loader}
				loading={loader}
				shape='round'
				style={{
					background: statusEncargo
						? "linear-gradient(#2196F3,#0000E6)"
						: "gray",
					marginTop: 5,
					marginRight: 15,
					color: "white",
					border: 0,
					fontWeight: "bold",
				}}
				onClick={() => setmodalReimprimir(true)}
				icon={<PrinterFilled style={{ fontSize: "large", marginRight: 5 }} />}
			>
				Reimprimir
			</Button>

			<SwitchB
				loader={loader}
				checked={statusEncargo}
				onClick={guardarEncargo}
				// style={{
				// 	marginTop: 10,
				// 	marginRight: 5,
				// }}
			/>
		</Row>
	);
}
