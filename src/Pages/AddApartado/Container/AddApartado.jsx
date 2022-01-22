import React, { useState, useRef, useEffect, useContext } from "react";
import ProductsAddApartado from "../Components/ProductsAddApartado/ProductsAddApartado";
import { DollarCircleOutlined } from "@ant-design/icons";
import { Steps, Button, message, Card, Input, Row, AutoComplete } from "antd";
import ImprimirNewApartado from "../Components/ImprimirApartado/ImprimirNewApartado";
import CobrarNewApartado from "../Components/CobrarNewApartado/CobrarNewApartado";
import { useNavigate } from "react-router-dom";
import AuthContext from "context/Auth/AuthContext";
import { keyBlock } from "Utils";
import "./addApartado.css";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS_NAMES, GET_PRODUCTS_NAME } from "myGraphql/apartado";

export default function AddApartado() {
	const { auth, timeLogout } = useContext(AuthContext);

	let { data: getClientsNames } = useQuery(GET_CLIENTS_NAMES);
	let { data: getProductsName } = useQuery(GET_PRODUCTS_NAME);
	let navigate = useNavigate();
	const [current, setCurrent] = useState(0);
	const [cliente, setcliente] = useState("");
	const [titulo2, settitulo2] = useState("Productos");
	const [listaCompras, setlistaCompras] = useState([]);
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [totalProductos, settotalProductos] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const [abono, setabono] = useState(null);
	const [restaria, setrestaria] = useState(0);
	const [imprimirNewApartado, setimprimirNewApartado] = useState(false);

	const inputNameClient = useRef();
	const inputAbono = useRef();
	useEffect(() => {
		timeLogout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		setrestaria(totalTotal - abono);
	}, [abono, totalTotal]);

	useEffect(() => {
		if (current === 2) {
			inputAbono.current.select();
		}
	}, [current]);

	useEffect(() => {
		let sum = 0;
		let sumProd = 0;
		for (const articulo of listaCompras) {
			sum += articulo.totalArticulo;
			sumProd += articulo.cantidad;
		}
		settotalTotal(sum);
		settotalProductos(sumProd);
		settitulo2(`Productos: ${listaCompras.length}`);
	}, [listaCompras]);

	const { Step } = Steps;
	const next = () => {
		setCurrent(current + 1);
	};
	const prev = () => {
		setCurrent(current - 1);
	};
	const goToHome = () => {
		navigate("/");
	};

	const cerrarCobrar = () => {
		setmodalCobrar(false);
		inputAbono.current.select();
	};
	const pressKeyEnter = (e) => {
		if (e.keyCode === 13) {
			if (cliente) next();
		}
		if (e.keyCode === 27) {
			if (!cliente) {
				navigate("/");
			}
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
			if (restaria > 0 && abono > 0) {
				setmodalCobrar(true);
			}
		}
	};
	// RENDER DE STEPS
	const steps = [
		{
			title: cliente ? cliente : "Nombre cliente",
			content: (
				<>
					<Row justify='center'>
						<h2
							style={{
								color: "blue",
								fontSize: "xx-large",
								margin: "55px 10px ",
							}}
						>
							Cliente:
						</h2>
						<AutoComplete
							defaultActiveFirstOption={false}
							id='inputNameClient'
							ref={inputNameClient}
							autoFocus={true}
							backfill={true}
							size='large'
							onKeyUp={pressKeyEnter}
							style={{
								color: "blue",
								fontSize: "x-large",
								fontWeight: "bold",
								borderRadius: "50px",
								width: "80%",
								margin: "60px 0 ",
							}}
							onChange={(e) => setcliente(e.toUpperCase())}
							value={cliente}
							options={getClientsNames?.getClientsNames}
							placeholder='Ingresa el nombre de cliente'
							filterOption={(inputValue, option) =>
								option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
								-1
							}
						/>
					</Row>
				</>
			),
		},
		{
			title: titulo2,
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
						getProductsName={getProductsName?.getProductsName}
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
								fontSize: "xx-large",
							}}
						>
							Total: ${totalTotal}
						</h1>
					</Row>

					<Row justify='center' style={{ margin: "0 0 0 0 " }}>
						<h2
							style={{
								color: "blue",
								fontSize: "xx-large",
								fontWeight: "bold",
								margin: "0px 10px ",
							}}
						>
							Abono:
						</h2>
						<Input
							id='inputNameClient'
							prefix={<DollarCircleOutlined style={{ marginLeft: "20px" }} />}
							style={{
								color: "blue",
								// fontSize: 30,
								fontSize: "xx-large",
								fontWeight: "bold",
								borderRadius: "50px",
								maxWidth: "80%",
								height: "50px",
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
											fontSize: "xx-large",
											color: "green",
									  }
									: {
											fontWeight: "bold",
											fontSize: "xx-large",
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
			<Row justify='center'>
				<h1 style={{ fontSize: "x-large", fontWeight: "bold", color: "blue" }}>
					Nuevo apartado
				</h1>
			</Row>
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
