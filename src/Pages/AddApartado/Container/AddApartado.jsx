import React, { useState, useRef, useEffect } from "react";
import { Steps, Button, message, Card, Input, Row, Col } from "antd";
import { SmileOutlined, DollarCircleOutlined } from "@ant-design/icons";
import ProductsAddApartado from "../Components/ProductsAddApartado/ProductsAddApartado";
import "./addApartado.css";
export default function AddApartado() {
	const [current, setCurrent] = useState(0);
	const [nombre, setnombre] = useState("");
	const inputNameClient = useRef();
	useEffect(() => {
		// inputNameClient.current.select();
	}, []);
	const { Step } = Steps;
	const next = () => {
		setCurrent(current + 1);
	};

	const prev = () => {
		setCurrent(current - 1);
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			if (nombre) next();
		}
	};

	// RENDER DE STEPS
	const steps = [
		{
			title: nombre ? nombre : "Nombre cliente",
			content: (
				<Row justify='center'>
					<Input
						id='inputNameClient'
						prefix={<SmileOutlined style={{ marginLeft: "20px" }} />}
						style={{
							color: "blue",
							// fontSize: 30,
							fontSize: "x-large",
							fontWeight: "bold",
							borderRadius: "50px",
							maxWidth: "80%",
							margin: "60px 0 ",
						}}
						onChange={(e) => setnombre(e.target.value.toUpperCase())}
						value={nombre}
						ref={inputNameClient}
						onKeyUp={pressKeyEnter}
						// onKeyDown={keyBlock}
						// value={precio.precio}
						// onChange={handlePrecio}
					/>
				</Row>
			),
		},
		{
			title: "Productos",
			content: (
				<Card
					style={{
						margin: "5px 15px 20px 15px",
						borderRadius: "38px",
						// background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
						boxShadow: "12px 12px 20px #7a7a7a,-7px -7px 20px #ffffff",
					}}
				>
					<ProductsAddApartado />
				</Card>
			),
		},
		{
			title: "Abono",
			content: (
				<>
					<Row justify='center' style={{ margin: "60px 0 30px 0 " }}>
						<h1>Total $9999</h1>
					</Row>

					<Row justify='center' style={{ margin: "0 0 60px 0 " }}>
						<Input
							id='inputNameClient'
							prefix={<DollarCircleOutlined style={{ marginLeft: "20px" }} />}
							style={{
								color: "blue",
								// fontSize: 30,
								fontSize: "x-large",
								fontWeight: "bold",
								borderRadius: "50px",
								maxWidth: "80%",
							}}
							onChange={(e) => setnombre(e.target.value.toUpperCase())}
							value={nombre}
							ref={inputNameClient}
							onKeyUp={pressKeyEnter}
							// onKeyDown={keyBlock}
							// value={precio.precio}
							// onChange={handlePrecio}
						/>
					</Row>
					<Row justify='center' style={{ margin: "60px 0 30px 0 " }}>
						<h1>Restaría $9999</h1>
					</Row>
				</>
			),
		},
	];

	return (
		<>
			{nombre ? <title>{nombre}</title> : <title>Nuevo Apartado</title>}
			<Card
				style={{
					margin: "10px 25px",
					borderRadius: "38px",
					// background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
					boxShadow: "17px 17px 35px #7a7a7a,-7px -7px 30px #ffffff",
				}}
			>
				<div style={{ margin: "10px 30px" }}>
					<Steps current={current}>
						{steps.map((item) => (
							<Step key={item.title} title={item.title} />
						))}
					</Steps>
					<div className='steps-content'>{steps[current].content}</div>
					<Row justify='end'>
						<div className='steps-action'>
							{current > 0 && (
								<Button
									shape='round'
									style={{
										margin: "0 8px",
										color: "white",
										background: "linear-gradient(#2196F3,#0000E6)",
									}}
									onClick={() => prev()}
								>
									Regresar
								</Button>
							)}
							{current < steps.length - 1 && (
								<Button
									shape='round'
									onClick={() => next()}
									style={{
										background: "linear-gradient(#32A632,#005800)",
										color: "white",
									}}
								>
									Siguiente
								</Button>
							)}
							{current === steps.length - 1 && (
								<Button
									shape='round'
									onClick={() => message.success("Processing complete!")}
									style={{
										background: "linear-gradient(#32A632,#005800)",
										color: "white",
									}}
								>
									Guardar
								</Button>
							)}
						</div>
					</Row>
				</div>
			</Card>
		</>
	);
}
