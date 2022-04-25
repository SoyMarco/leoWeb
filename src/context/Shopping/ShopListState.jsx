import { useState, useEffect } from "react";
import ShopListContext from "./ShopListContext";
import { REGISTER_F3 } from "myGraphql/f3";
import { useMutation } from "@apollo/client";
import { openNotification } from "Utils/openNotification";

const ShopListState = (props) => {
	const [shopList, setshopList] = useState([]);

	const [mutateREGISTER_F3] = useMutation(REGISTER_F3);
	const [DrawerF3Visible, setDrawerF3Visible] = useState(true);

	const [idArticulo, setidArticulo] = useState(0);
	const [selectedRowKeys, setselectedRowKeys] = useState(0);
	const [totalTotal, settotalTotal] = useState(0);
	const [totalProductos, settotalProductos] = useState(0);
	const [stateRecord, setstateRecord] = useState(null);
	const [modalCobrar, setmodalCobrar] = useState(false);
	const [imprimir, setimprimir] = useState(false);

	useEffect(() => {
		calcularTotales();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shopList]);

	useEffect(() => {
		setstateRecord({ key: selectedRowKeys[0] });
	}, [selectedRowKeys]);
	const calcularTotales = () => {
		if (shopList) {
			let sum = 0;
			let sumProd = 0;
			for (const itemComprar of shopList) {
				sum += itemComprar?.totalArticulo;
				sumProd += itemComprar?.cantidad;
			}
			settotalTotal(sum);
			settotalProductos(sumProd);
		}
		selectLastRow();
	};
	const selectLastRow = () => {
		const ultimoArray = shopList.length;
		if (ultimoArray) {
			setselectedRowKeys([shopList[ultimoArray - 1].key]);
		}
	};
	//Suma uno en Cantidad del Producto
	const addOneShopList = (ProductAdd) => {
		const currentShopList = [...shopList];
		const shopItem = currentShopList.find((item) => item.key === ProductAdd);
		shopItem.cantidad = shopItem.cantidad + 1;
		shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
		const newShopList = [...currentShopList];

		setshopList(newShopList);
	};

	//Resta uno en Cantidad del Producto
	const removeOneShopList = (record) => {
		const currentShopList = [...shopList];
		const shopItem = currentShopList.find((item) => item.key === record.key);
		if (shopItem.cantidad > 1) {
			shopItem.cantidad = shopItem.cantidad - 1;
			shopItem.totalArticulo = shopItem.cantidad * shopItem.precio;
			const newShopList = [...currentShopList];

			setshopList(newShopList);
		} else if (shopItem.cantidad === 1) {
			eliminarProducto(record);
		}
	};

	const eliminarProducto = (item) => {
		const i = shopList.indexOf(item);
		let key;
		if (i !== -1) {
			key = shopList.splice(i, 1);
		} else if (item.key > 0) {
			key = item.key;
		}
		const newPayload = shopList.filter((item2) => item2.key !== key);

		setshopList(newPayload);

		if (newPayload.length === 0) {
			setselectedRowKeys(0);
		}
	};
	const eliminarProductoF3 = (record) => {
		const newPayload = shopList.filter((item) => {
			return item.idF3 !== record._id;
		});

		setshopList(newPayload);

		if (newPayload.length === 0) {
			setselectedRowKeys(0);
		}
	};
	const addProductShopList = async ({
		precio,
		nombre = "Articulo",
		apartado = 0,
		refApartado = "0",
		f3 = false,
		idF3,
	}) => {
		const venta = {
			key: idArticulo + 1,
			nombre: nombre,
			precio: Math.round(precio * 100) / 100,
			cantidad: 1,
			apartado: apartado,
			refApartado: refApartado,
			totalArticulo: Math.round(precio * 100) / 100,
			idF3: idF3,
		};
		if (f3 === true) {
			try {
				const { data } = await mutateREGISTER_F3({
					variables: {
						input: venta,
					},
				});
				if (data) {
					openNotification("success", "F3 guardado");
					venta.idF3 = data.registerF3._id;
				}
			} catch (error) {
				console.log(error);
			}
		}
		const currentShopList = [...shopList];
		const shopItem = currentShopList.find(
			(item) => item.refApartado === refApartado && item.precio === precio
		);
		if (shopItem) {
			return;
		}

		setshopList([...shopList, venta]);
		setidArticulo(idArticulo + 1);
	};
	const clearShopList = () => {
		setshopList([]);

		setidArticulo(0);
	};
	const initialState = () => {
		setselectedRowKeys(0);
		clearShopList();
		settotalTotal(0);
		settotalProductos(0);
		setstateRecord(null);
		setmodalCobrar(false);
		setimprimir(false);
	};
	return (
		<ShopListContext.Provider
			value={{
				shopList: shopList,
				addProductShopList,
				clearShopList,
				addOneShopList,
				removeOneShopList,
				eliminarProducto,
				setselectedRowKeys,
				selectedRowKeys: selectedRowKeys,
				setDrawerF3Visible,
				DrawerF3Visible: DrawerF3Visible,
				eliminarProductoF3,
				totalTotal: totalTotal,
				settotalTotal,
				totalProductos: totalProductos,
				initialState,
				setstateRecord,
				setmodalCobrar,
				modalCobrar: modalCobrar,
				stateRecord,
				imprimir,
				setimprimir,
				calcularTotales,
			}}
		>
			{props.children}
		</ShopListContext.Provider>
	);
};

export default ShopListState;
