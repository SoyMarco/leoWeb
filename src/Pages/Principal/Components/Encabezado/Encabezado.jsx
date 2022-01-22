import React, { useState, useContext, useEffect } from "react";
import { keyBlock } from "Utils";
import { AiFillDollarCircle, AiOutlineCloudDownload } from "react-icons/ai";
import { Input, Button, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import GetVentasF3 from "Pages/GetVentasF3/Container/GetVentasF3";
import ShopListContext from "context/Shopping/ShopListContext";
import "./Encabezado.css";
import { ShoppingOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { GET_ALL_F3 } from "myGraphql/f3";

export default function Encabezado({ setmodalCobrar, stateRecord }) {
	const {
		shopList,
		addProductShopList,
		addOneShopList,
		removeOneShopList,
		selectedRowKeys,
		setselectedRowKeys,
		DrawerF3Visible,
		setDrawerF3Visible,
	} = useContext(ShopListContext);
	const {
		data: dataGET,
		loading: loadingAllF3,
		refetch: refetchAllF3,
	} = useQuery(GET_ALL_F3, {
		notifyOnNetworkStatusChange: true,
	});

	const [precio, setprecio] = useState({
		precio: null,
	});
	let navigate = useNavigate();

	useEffect(() => {
		if (DrawerF3Visible === false) {
			document.querySelector("#inputPrecio").select();
		}
	}, [DrawerF3Visible]);

	const pressEnter = () => {
		if (precio.precio > 0) {
			addProductShopList({ precio: precio.precio });
			setprecio({ precio: null });
		} else if (shopList.length > 0) {
			setmodalCobrar(true);
		}
	};

	const rowAbajo = () => {
		for (let i = 0; i < shopList.length; i++) {
			const element = shopList[i].key;
			if (element === selectedRowKeys[0]) {
				let newRow = i - 1;
				setselectedRowKeys([shopList[newRow]?.key]);
				return;
			}
		}
	};
	const rowArriba = () => {
		for (let i = 0; i < shopList.length; i++) {
			const element = shopList[i].key;
			if (element === selectedRowKeys[0]) {
				let newRow = i + 1;
				setselectedRowKeys([shopList[newRow]?.key]);
				return;
			}
		}
	};
	const addArticulo = (record) => {
		console.log("record", shopList, 1);
		const shopItem = shopList.find((item) => item.key === record.key);
		if (shopList.length > 0 && shopItem.apartado === 0) {
			addOneShopList(record.key);
		}
	};
	const removeArticulo = (record) => {
		if (shopList.length > 0) {
			removeOneShopList(record);
		}
	};
	// Press Key Precio commands
	const pressKeyPrecio = (e) => {
		if (e.keyCode === 13) {
			pressEnter();
		}
		// Tecla ⬆️
		if (e.keyCode === 38) {
			if (shopList.length > 1) {
				let max = shopList.length - 1;
				if (shopList[max].key !== selectedRowKeys[0]) {
					rowArriba();
				}
			}
		}
		// Tecla ⬇️
		if (e.keyCode === 40) {
			if (shopList.length > 1) {
				if (shopList[0].key !== selectedRowKeys[0]) {
					rowAbajo();
				}
			}
		}

		if (e.keyCode === 46) {
			if (stateRecord) {
				removeArticulo(stateRecord);
			}
		}
		if (e.keyCode === 65) {
			document.querySelector("#buscarApartadoInput").select();
		}
		if (e.keyCode === 66) {
			document.querySelector("#buscarApartadoInput").select();
		}
		if (e.keyCode === 67) {
			navigate("/corte");
		}
		if (e.keyCode === 78) {
			navigate("/add");
		}
		if (e.keyCode === 107) {
			if (stateRecord) {
				addArticulo(stateRecord);
			}
		}
		if (e.keyCode === 109) {
			if (stateRecord) {
				removeArticulo(stateRecord);
			}
		}
		// F3
		if (e.keyCode === 114) {
			refetchAllF3();
			setDrawerF3Visible(true);
		}
		// F6 abrir ventana
		if (e.keyCode === 117) {
			document.getElementById("linkNewWindow").click();
		}
		if (e.keyCode === 121) {
			document.querySelector("#buscarApartadoInput").select();
		}
		if (e.keyCode === 122) {
			navigate("/add");
		}
		if (e.keyCode === 123) {
			pressEnter();
		}
	};
	return (
		<div className='EncabezadoPrincipal'>
			{/* Ingresar Precio */}
			<AiOutlineCloudDownload
				style={{
					color: loadingAllF3 ? "white" : "transparent",
					fontSize: "30px",
					margin: "0 10px 0 0",
					verticalAlign: "sub",
				}}
			/>
			<Input
				id='inputPrecio'
				prefix={
					<AiFillDollarCircle style={{ marginLeft: "20px" }} size={"40px"} />
				}
				style={{
					color: "green",
					// fontSize: 30,
					fontSize: "x-large",
					fontWeight: "bold",
					borderRadius: "50px",
					maxWidth: "60%",
					padding: "0 0 0 0px",
					border: "0 0 0 0",
				}}
				onKeyUp={pressKeyPrecio}
				onKeyDown={keyBlock}
				value={precio.precio}
				onChange={(e) =>
					setprecio({
						precio: e.target.value,
					})
				}
			/>
			{dataGET?.getAllF3?.length > 0 && (
				<>
					<Badge count={dataGET?.getAllF3?.length} className='BtnBadge'>
						<Button
							icon={
								// <AiFillShopping />
								<ShoppingOutlined style={{ fontSize: "30px", color: "blue" }} />
							}
							size='large'
							shape='circle'
							onClick={() => setDrawerF3Visible(!DrawerF3Visible)}
						/>
					</Badge>
					{/* // GET VENTAS MOBILE */}
				</>
			)}
			<GetVentasF3 />
		</div>
	);
}
