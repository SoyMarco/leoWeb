import React, { useReducer, useState } from "react";

import ShopListContext from "./ShopListContext";
import ShopListReducer from "./ShopListReducer";
import { ADD_PRODUCT_SHOP_LIST, CLEAR_SHOP_LIST } from "./types";

const ShopListState = (props) => {
	const initialState = {
		shopList: [],
	};

	const [state, dispatch] = useReducer(ShopListReducer, initialState);

	const [idArticulo, setidArticulo] = useState(0);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);

	//Suma uno en Cantidad del Producto
	const addOneShopList = (ProductAdd) => {
		const { shopList } = state;

		const currentShopList = [...shopList];
		const shopItem = currentShopList.find((item) => item.key === ProductAdd);
		shopItem.cantidad = shopItem.cantidad + 1;
		shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
		const newShopList = [...currentShopList];
		dispatch({
			type: ADD_PRODUCT_SHOP_LIST,
			payload: newShopList,
		});
	};

	//Resta uno en Cantidad del Producto
	const removeOneShopList = (record) => {
		const { shopList } = state;

		const currentShopList = [...shopList];
		const shopItem = currentShopList.find((item) => item.key === record.key);
		if (shopItem.cantidad > 1) {
			shopItem.cantidad = shopItem.cantidad - 1;
			shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
			const newShopList = [...currentShopList];
			dispatch({
				type: ADD_PRODUCT_SHOP_LIST,
				payload: newShopList,
			});
		} else if (shopItem.cantidad === 1) {
			eliminarProducto(record);
		}
	};

	const eliminarProducto = (item) => {
		const { shopList } = state;

		let i = shopList.indexOf(item);
		let key;
		if (i !== -1) {
			key = shopList.splice(i, 1);
		} else if (item.key > 0) {
			key = item.key;
		}
		let newPayload = shopList.filter((item2) => item2.key !== key);
		dispatch({
			type: ADD_PRODUCT_SHOP_LIST,
			payload: newPayload,
		});
		if (newPayload.length === 0) {
			setselectedRowKeys(0);
		}
	};
	const addProductShopList = ({
		precio,
		nombre = "Articulo",
		apartado = 0,
		refApartado = "0",
	}) => {
		dispatch({
			type: ADD_PRODUCT_SHOP_LIST,
			payload: [
				...state.shopList,
				{
					key: idArticulo + 1,
					nombre: nombre,
					precio: Math.round(precio * 100) / 100,
					cantidad: 1,
					apartado: apartado,
					refApartado: refApartado,
					totalArticulo: Math.round(precio * 100) / 100,
				},
			],
		});
		setidArticulo(idArticulo + 1);
	};
	const clearShopList = () => {
		dispatch({ type: CLEAR_SHOP_LIST, payload: [] });
		setidArticulo(0);
	};
	return (
		<ShopListContext.Provider
			value={{
				shopList: state.shopList,
				addProductShopList,
				clearShopList,
				addOneShopList,
				removeOneShopList,
				eliminarProducto,
				setselectedRowKeys,
				selectedRowKeys: selectedRowKeys,
			}}
		>
			{props.children}
		</ShopListContext.Provider>
	);
};

export default ShopListState;
