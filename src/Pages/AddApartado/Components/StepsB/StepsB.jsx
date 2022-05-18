import { useContext } from "react";
import ProductsAddApartado from "../ProductsAddApartado/ProductsAddApartado";
import { GET_PRODUCTS_NAME } from "myGraphql/apartado";
import NewAparadoContext from "context/NewApartado/NewAparadoContext";
import ShopListContext from "context/Shopping/ShopListContext";
import { DollarCircleOutlined } from "@ant-design/icons";
import { Card, Input, Row } from "antd";
import { useQuery } from "@apollo/client";
import { keyBlock } from "Utils";
import ListClients from "Components/ListClients/ListClients";
import { useNavigate } from "react-router-dom";

const StepsB = () => {
	const {
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
	const { setmodalCobrar, settotalTotal } = useContext(ShopListContext);
	const { data: getProductsName } = useQuery(GET_PRODUCTS_NAME);

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
	const totalAbono = (e) => {
		const value = parseInt(e.target.value);
		settotalTotal(value);
		setabono(value);
	};
	const navigate = useNavigate();

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
	return [
		{
			title: cliente ? cliente : "Nombre cliente",
			content: (
				<Row justify='center' style={{ margin: "55px 10px " }}>
					<h2
						style={{
							color: "blue",
							fontSize: "xx-large",
						}}
					>
						Cliente:
					</h2>
					<ListClients
						cliente={cliente}
						setcliente={setcliente}
						action={pressKeyEnter}
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
							id='Abono'
							prefix={<DollarCircleOutlined style={{ marginLeft: "20px" }} />}
							style={{
								color: "blue",
								fontSize: "xx-large",
								fontWeight: "bold",
								borderRadius: "50px",
								maxWidth: "80%",
								height: "50px",
							}}
							onChange={(e) => totalAbono(e)}
							value={abono}
							ref={inputAbono}
							onKeyUp={pressKeyEnterAbono}
							onKeyDown={keyAbono}
							type='number'
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
