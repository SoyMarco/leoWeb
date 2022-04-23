import { useRef, useContext } from "react";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";
import { keyBlock } from "Utils";
import { DollarCircleOutlined } from "@ant-design/icons";
import ProductsAddApartado from "../ProductsAddApartado/ProductsAddApartado";
import { Card, Input, Row, AutoComplete } from "antd";
import { GET_CLIENTS_NAMES, GET_PRODUCTS_NAME } from "myGraphql/apartado";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

const StepsB = () => {
	const {
		setmodalCobrar,
		cliente,
		setcliente,
		abono,
		setabono,
		listaCompras,
		setlistaCompras,
		totalTotal,
		restaria,
		titulo2,
		totalProductos,
		next,
		prev,
		inputAbono,
	} = useContext(NewAparadoContext);

	const { data: getClientsNames } = useQuery(GET_CLIENTS_NAMES);
	const { data: getProductsName } = useQuery(GET_PRODUCTS_NAME);

	const navigate = useNavigate();
	const inputNameClient = useRef();

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
	return [
		{
			title: cliente ? cliente : "Nombre cliente",
			content: (
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
			),
		},
		{
			title: titulo2,
			content: (
				<Card
					style={{
						margin: "5px 0px 10px 0px",
						borderRadius: "38px",
						boxShadow: "12px 12px 20px #7a7a7a,-7px -7px 20px #ffffff",
					}}
				>
					<ProductsAddApartado
						defaultActiveFirstOption={false}
						next={next}
						prev={prev}
						setlistaCompras={setlistaCompras}
						listaCompras={listaCompras}
						getProductsName={getProductsName?.getProductsName}
					/>
					<Row justify='space-around'>
						<h1
							style={{
								color: "darkblue",
								fontSize: "xx-large",
								fontWeight: "bold",
								alignSelf: "center",
								height: "min-content",
								margin: 0,
							}}
						>
							{totalProductos ? `Productos: ${totalProductos}` : null}
						</h1>
						<h1
							style={{
								color: "green",
								fontSize: "xxx-large",
								fontWeight: "bold",
								height: "min-content",
								margin: 0,
							}}
							// onClick={pressEnter}
						>
							{totalProductos ? `$ ${totalTotal}` : null}
						</h1>
					</Row>
				</Card>
			),
		},
		{
			title: "Abono",
			content: (
				<>
					<Row justify='center' style={{ margin: "30px 0 15px 0 " }}>
						<h1
							style={{
								fontWeight: "bold",
								fontSize: "xx-large",
							}}
						>
							Total de productos: ${totalTotal}
						</h1>
					</Row>

					<Row justify='center' style={{ margin: 0 }}>
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
							onChange={(e) => setabono(parseInt(e.target.value))}
							value={abono}
							ref={inputAbono}
							onKeyUp={pressKeyEnterAbono}
							onKeyDown={keyAbono}
							type='number'
							// value={precio.precio}
							// onChange={handlePrecio}
						/>
					</Row>
					<Row justify='center' style={{ margin: "30px 0 30px 0 " }}>
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
							Restaría ${restaria ?? 0}
						</h1>
					</Row>
				</>
			),
		},
	];
};

export default StepsB;
