import React, { useState, useRef, useEffect } from "react";
import ProductsAddApartado from "../Components/ProductsAddApartado/ProductsAddApartado";
import { SmileOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { Steps, Button, message, Card, Input, Row } from "antd";
import ImprimirNewApartado from "../Components/ImprimirApartado/ImprimirApartado";
import CobrarNewApartado from "../Components/CobrarNewApartado/CobrarNewApartado";
import { useHistory } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { keyBlock } from "Utils";
import "./addApartado.css";

export default function AddApartado() {
	const history = useHistory();
	const [current, setCurrent] = useState(0);
	const [cliente, setcliente] = useState("");
	const [listaCompras, setlistaCompras] = useState([]);
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [totalProductos, settotalProductos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const [abono, setabono] = useState(null);
	const [restaria, setrestaria] = useState(0);
	const [imprimirNewApartado, setimprimirNewApartado] = useState(false);
	const inputNameClient = useRef();
	const inputAbono = useRef();
	const { auth } = useAuth();

	useEffect(() => {
		inputNameClient.current.select();
	}, []);
	useEffect(() => {
		setrestaria(totalTotal - abono);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [abono]);
	useEffect(() => {
		if (current === 2) {
			inputAbono.current.select();
		} else if (current === 0) {
			inputNameClient.current.select();
		}
	}, [current]);
	useEffect(() => {
		// selectLastRow();
		let sum = 0;
		let sumProd = 0;
		for (let i = 0; i < listaCompras.length; i++) {
			sum += listaCompras[i].totalArticulo;
			sumProd += listaCompras[i].cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);
	}, [listaCompras]);
	const { Step } = Steps;
	const next = () => {
		setCurrent(current + 1);
	};
	const prev = () => {
		setCurrent(current - 1);
	};
	const goToHome = () => {
		history.push("/");
	};

	const cerrarCobrar = () => {
		setmodalCobrar(false);
		inputAbono.current.select();
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			if (cliente) next();
		}
	};
	const keyAbono = (e) => {
		if (e.keyCode === 27) {
			prev();
		} else {
			keyBlock(e);
		}
	};
	const pressKeyEnterAbono = (e) => {
		if (e.keyCode === 13) {
			if (restaria > 0) {
				setmodalCobrar(true);
			}
		}
	};
	// RENDER DE STEPS
	const steps = [
		{
			title: cliente ? cliente : "Nombre cliente",
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
						onChange={(e) => setcliente(e.target.value.toUpperCase())}
						value={cliente}
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
			title: `Productos ${
				listaCompras.length > 0 ? `: ${listaCompras.length}` : ""
			}`,
			content: (
				<Card
					style={{
						margin: "5px 15px 20px 15px",
						borderRadius: "38px",
						// background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
						boxShadow: "12px 12px 20px #7a7a7a,-7px -7px 20px #ffffff",
					}}
					actions={[
						<h1
							style={{
								color: "darkblue",
								fontSize: "xx-large",
								fontWeight: "bold",
								marginTop: "-5px",
							}}
						>
							{totalProductos ? `Productos: ${totalProductos}` : null}
						</h1>,
						<></>,
						<h1
							style={{
								color: "green",
								fontSize: "xxx-large",
								fontWeight: "bold",
								marginTop: "-20px",
							}}
							// onClick={pressEnter}
						>
							{totalProductos ? `$ ${totalTotal}` : null}
						</h1>,
					]}
				>
					<ProductsAddApartado
						next={next}
						prev={prev}
						setlistaCompras={setlistaCompras}
						listaCompras={listaCompras}
					/>
				</Card>
			),
		},
		{
			title: "Abono",
			content: (
				<>
					<Row justify='center' style={{ margin: "60px 0 30px 0 " }}>
						<h1
							style={{
								fontWeight: "bold",
								fontSize: "x-large",
							}}
						>
							Total ${totalTotal}
						</h1>
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
							onChange={(e) => setabono(e.target.value.toUpperCase())}
							value={abono}
							ref={inputAbono}
							onKeyUp={pressKeyEnterAbono}
							onKeyDown={keyAbono}
							// value={precio.precio}
							// onChange={handlePrecio}
						/>
					</Row>
					<Row justify='center' style={{ margin: "30px 0 60px 0 " }}>
						<h1
							style={
								restaria > 0
									? {
											fontWeight: "bold",
											fontSize: "x-large",
											color: "green",
									  }
									: {
											fontWeight: "bold",
											fontSize: "x-large",
											color: "red",
									  }
							}
						>
							Restaría ${restaria}
						</h1>
					</Row>
				</>
			),
		},
	];

	return (
		<>
			{cliente ? <title>{cliente}</title> : <title>Nuevo Apartado</title>}

			{/* MODAL APARTADO */}
			{modalCobrar ? (
				<CobrarNewApartado
					modalCobrar={modalCobrar}
					setmodalCobrar={setmodalCobrar}
					cerrarCobrar={cerrarCobrar}
					totalTotal={abono}
					listaCompras={listaCompras}
					initialState={goToHome}
					calculateRestaria={restaria}
					inputAbono={inputAbono}
					key='CobrarNewApartado'
					cliente={cliente}
				/>
			) : null}

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
									// onClick={() => next()}
									style={{
										background: "linear-gradient(#32A632,#005800)",
										color: "white",
									}}
								>
									Siguiente
								</Button>
							)}
							{current === steps.length - 1 && (
								<>
									<Button
										shape='round'
										onClick={() => message.success("Processing complete!")}
										style={{
											background: "linear-gradient(#32A632,#005800)",
											color: "white",
										}}
									>
										Cobrar (Enter)
									</Button>
									{/* <Button
										shape='round'
										onClick={() => message.success("Processing complete!")}
										style={{
											background: "linear-gradient(#32A632,#005800)",
											color: "white",
										}}
									>
										F2 Guardar
									</Button> */}
								</>
							)}
						</div>
					</Row>
				</div>
			</Card>

			{imprimirNewApartado ? (
				<ImprimirNewApartado
					imprimir={imprimirNewApartado}
					setimprimir={setimprimirNewApartado}
					totalTotal={abono}
					listaCompras={listaCompras}
					calculateRestaria={restaria}
					auth={auth}
				/>
			) : null}
		</>
	);
}
