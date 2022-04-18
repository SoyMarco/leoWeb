/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { Modal, Input, Button, Row } from "antd";
import { FaMoneyBillWave, FaCreditCard, FaStoreAlt } from "react-icons/fa";
import { SaveFilled, PrinterFilled } from "@ant-design/icons";
import Imprimir from "../Imprimir/Imprimir";
import { openNotification } from "Utils/openNotification";
import ErrorConection from "Utils/ErrorConection";
import { keyBlock } from "Utils";
import { useMutation, useQuery } from "@apollo/client";
import { REGISTER_VENTA, GET_TOTAL_VENTAS_DIA } from "myGraphql/venta";
import AuthContext from "context/Auth/AuthContext";
import aceptar from "assets/sonido/Aceptar.wav";
import "./cobrar.css";
import ShopListContext from "context/Shopping/ShopListContext";

const Cobrar = ({ modalCobrar, setmodalCobrar, totalTotal, initialState }) => {
	const { shopList } = useContext(ShopListContext);
	const { auth, timeLogout } = useContext(AuthContext);

	const [mutateREGISTER_VENTA] = useMutation(REGISTER_VENTA);
	let { refetch: refetchTotalVentasDia } = useQuery(GET_TOTAL_VENTAS_DIA);
	const [cambio, setcambio] = useState(0);
	const [imprimir, setimprimir] = useState(false);
	const [btnLoading, setbtnLoading] = useState(false);
	const [folio, setfolio] = useState(0);
	const [inputs, setinputs] = useState({
		efectivo: null,
		tarjeta: null,
		aCuenta: null,
	});
	const cobrarEfectivo = useRef();
	const audio = new Audio(aceptar);
	useEffect(() => {
		setTimeout(() => {
			cobrarEfectivo.current.select();
		}, 50);
		timeLogout();
	}, []);

	useEffect(() => {
		if (modalCobrar === true) {
			let others = inputs;
			setinputs({ ...others, efectivo: totalTotal });
			OnValuesChange();
		}
	}, [modalCobrar]);
	useEffect(() => {
		OnValuesChange();
	}, [inputs]);
	const pressKeyPrecio = (e) => {
		// Enter
		if (e.keyCode === 13) {
			savePrintNewV("F1");
		}
		// E
		if (e.keyCode === 69) {
			if (inputs.aCuenta === totalTotal || inputs.tarjeta === totalTotal) {
				setinputs({ efectivo: totalTotal });
			}
			cobrarEfectivo.current.select();
		}
		// A
		if (e.keyCode === 65) {
			if (inputs.efectivo === totalTotal || inputs.tarjeta === totalTotal) {
				setinputs({ aCuenta: totalTotal });
			}
			document.querySelector("#aCuenta").select();
		}
		// T
		if (e.keyCode === 84) {
			if (inputs.efectivo === totalTotal || inputs.aCuenta === totalTotal) {
				setinputs({ tarjeta: totalTotal });
			}
			document.querySelector("#tarjeta").select();
		}

		// 	F1
		if (e.keyCode === 112) {
			savePrintNewV("F1");
		}
		// F2
		if (e.keyCode === 113) {
			savePrintNewV("F2");
		}
	};

	const OnValuesChange = () => {
		let efectivo = parseFloat(inputs.efectivo ?? 0);
		let tarjeta = parseFloat(inputs.tarjeta ?? 0);
		let aCuenta = parseFloat(inputs.aCuenta ?? 0);
		let total = parseFloat(totalTotal);
		let sumaTodo = efectivo + tarjeta + aCuenta;
		let resultado = sumaTodo - total;

		setcambio(resultado);
	};

	//Guardar y/o Imprimir VENTA CON GraphQL
	const savePrintNewV = async (keyF) => {
		if (btnLoading === false && cambio >= 0) {
			setbtnLoading(true);
			let listaComprasNew = shopList.map((item) => ({
				apartado: item.apartado,
				cantidad: item.cantidad,
				idArray: item.key,
				key: item.key,
				nombre: item.nombre,
				precio: item.precio,
				refApartado: item.refApartado,
				totalArticulo: item.totalArticulo,
				idF3: item.idF3,
			}));

			let efectivo = parseFloat(inputs.efectivo ?? 0);
			let tarjeta = parseFloat(inputs.tarjeta ?? 0);
			let aCuenta = parseFloat(inputs.aCuenta ?? 0);
			let total = parseFloat(totalTotal);
			let input = {
				productos: listaComprasNew,
				vendedor: auth.name,
				folio: 1,
				total: total,
				efectivo: efectivo,
				tarjeta: tarjeta,
				aCuenta: aCuenta,
				pagoCon: 0,
				referencia: "",
				notas: "",
			};
			try {
				const { data } = await mutateREGISTER_VENTA({
					variables: { input },
				});
				if (data) {
					//Actualizar % barra
					refetchTotalVentasDia();
					audio.play();

					if (keyF === "F1") {
						setfolio(data.registerVenta.folio);
						setimprimir(true);
					} else if (keyF === "F2") {
						openNotification("success", "Venta guardada con exito");
						initialState();
					}
				}
			} catch (error) {
				setbtnLoading(false);
				ErrorConection(timeLogout);
			}
		}
	};
	const keyBlockCobrar = (e) => {
		keyBlock(e);
	};
	const onChangeInput = (e) => {
		let key = e.target.id;
		let value = Math.round(e.target.value * 100) / 100;
		value = value > 0 ? value : null;
		let algo = inputs;
		setinputs({ ...algo, [key]: value });
	};
	const memoPrint = useMemo(
		() => (
			<Imprimir
				imprimir={imprimir}
				totalTotal={totalTotal}
				cambio={cambio}
				dinero={inputs}
				listaCompras={shopList}
				setmodalCobrar={setmodalCobrar}
				folio={folio}
				auth={auth}
				initialState={initialState}
				key='keyImprimir'
			/>
		),
		[imprimir]
	);
	return (
		<>
			{memoPrint}
			<Modal
				key='keyModal'
				style={{ top: 25 }}
				className='ModalCobrarPrincipal'
				title={
					<>
						<FaMoneyBillWave style={{ marginRight: "10px" }} />
						Cobrar
					</>
				}
				visible={modalCobrar}
				onCancel={() => setmodalCobrar(!modalCobrar)}
				footer={[
					<Row justify='space-around' key='keyRowBtns'>
						<Button
							style={{
								background:
									cambio < 0 ? "grey" : "linear-gradient(#32A632,#005800)",
								color: "white",
								fontWeight: "bold",
								width: 230,
							}}
							shape='round'
							size='large'
							onClick={() => savePrintNewV("F1")}
							icon={<PrinterFilled />}
							loading={btnLoading}
							key='keybtnf1'
						>
							Imprimir F1
						</Button>
						<Button
							style={{
								background:
									cambio < 0 ? "grey" : "linear-gradient(#3232A6,#000058)",
								color: "white",
								fontWeight: "bold",
								width: 230,
							}}
							shape='round'
							size='large'
							onClick={() => savePrintNewV("F2")}
							icon={<SaveFilled />}
							loading={btnLoading}
							key='keybtnf2'
						>
							Guardar F2
						</Button>
					</Row>,
				]}
			>
				<div key='div1' style={{ textAlignLast: "center" }}>
					<h1
						key='div1h1'
						style={{
							fontWeight: "bold",
							fontSize: "36px",
							color: "green",
							margin: 0,
						}}
					>
						Total: ${totalTotal}
					</h1>
				</div>
				<div key='div2'>
					<Input
						placeholder='Efectivo'
						ref={cobrarEfectivo}
						autoFocus={true}
						type='number'
						prefix={<FaMoneyBillWave />}
						onKeyUp={(e) => pressKeyPrecio(e)}
						onKeyDown={(e) => keyBlockCobrar(e)}
						onChange={(e) => onChangeInput(e)}
						className='InputModalCobrar'
						id='efectivo'
						value={inputs.efectivo}
					></Input>

					<Input
						placeholder='Tarjeta'
						type='number'
						prefix={<FaCreditCard />}
						onKeyUp={pressKeyPrecio}
						onKeyDown={keyBlock}
						id='tarjeta'
						className='InputModalCobrar'
						onChange={(e) => onChangeInput(e)}
						value={inputs.tarjeta}
					></Input>

					<Input
						placeholder='A cuenta'
						type='number'
						prefix={<FaStoreAlt />}
						onKeyUp={pressKeyPrecio}
						onKeyDown={keyBlock}
						id='aCuenta'
						className='InputModalCobrar'
						onChange={(e) => onChangeInput(e)}
						value={inputs.aCuenta}
					></Input>
				</div>
				<div key='div3' style={{ textAlignLast: "center" }}>
					<h1
						key='keyh1Cambio'
						style={{
							fontWeight: "bold",
							fontSize: "40px",
							color: cambio >= 0 ? "#35B009" : "red",
							margin: "-10px 0 0 0",
						}}
					>
						{cambio >= 0 ? `Cambio: $${cambio}` : `Faltan: $${cambio}`}
					</h1>
				</div>
			</Modal>
		</>
	);
};

export default Cobrar;
