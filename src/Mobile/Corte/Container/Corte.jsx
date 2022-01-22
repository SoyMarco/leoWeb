import React, { useEffect, useState, useContext } from "react";
import { GET_VENTAS_DIA_ADMIN } from "myGraphql/venta";
import { GET_CAJA_DIA_ADMIN } from "myGraphql/caja";
import ErrorConection from "Utils/ErrorConection";
import { useQuery } from "@apollo/client";
import { Row, Divider, Col } from "antd";
import "./corte.css";
import AuthContext from "context/Auth/AuthContext";

const Corte = () => {
	const { timeLogout } = useContext(AuthContext);
	let { data, error, refetch } = useQuery(GET_VENTAS_DIA_ADMIN);
	let { data: getCajas, refetch: refetchCaja } = useQuery(GET_CAJA_DIA_ADMIN);
	const [dataVentasDiaAdmin, setdataVentasDiaAdmin] = useState([]);
	const [cajasDia, setcajasDia] = useState([]);
	const [ventaEfectivo, setventaEfectivo] = useState(0);
	const [ventaTarjeta, setventaTarjeta] = useState(0);
	const [totalVenta, settotalVenta] = useState(0);

	useEffect(() => {
		refetch();
		refetchCaja();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		ErrorConection(timeLogout);
	}
	useEffect(() => {
		if (getCajas) {
			let { getCajaDiaAdmin } = getCajas;
			setcajasDia(getCajaDiaAdmin);
		}
	}, [getCajas]);
	useEffect(() => {
		if (data) {
			let { getVentasDiaAdmin } = data;
			let vendedoresSeparados = [];
			for (const i of getVentasDiaAdmin) {
				const vendedor = i.vendedor;

				let listVendedores1 = [];
				for (const q of vendedoresSeparados) {
					const nameVendedorKey = Object.keys(q)[0];
					listVendedores1.push(nameVendedorKey);
				}

				if (listVendedores1.includes(vendedor)) {
					for (const x of vendedoresSeparados) {
						const nameVendedorKey2 = Object.keys(x)[0];

						if (nameVendedorKey2 === vendedor) {
							x[vendedor].push(i);
						}
					}
				} else {
					vendedoresSeparados.push({
						[vendedor]: [i],
					});
				}
			}
			let datosSeparados = vendedoresSeparados.map((obj) => {
				return obj[Object.keys(obj)[0]];
			});
			setdataVentasDiaAdmin(datosSeparados);

			// Calculos de cuentas
			let sumasTotales = 0;
			let sumasTarjetas = 0;
			let sumasEfectivos = 0;
			let sumasaCuentas = 0;

			for (const ds of datosSeparados) {
				let items = ds;

				let sumasTotal = 0;
				let sumasTarjeta = 0;
				let sumasEfectivo = 0;
				let sumasaCuenta = 0;
				for (const it of items) {
					sumasTotal = sumasTotal + it.total;
					sumasTarjeta = sumasTarjeta + it.tarjeta;
					sumasEfectivo = sumasEfectivo + it.efectivo;
					sumasaCuenta = sumasaCuenta + it.aCuenta;
				}
				sumasTotales = sumasTotales + sumasTotal;
				sumasTarjetas = sumasTarjetas + sumasTarjeta;
				sumasEfectivos = sumasEfectivos + sumasEfectivo;
				sumasaCuentas = sumasaCuentas + sumasaCuenta;
			}
			settotalVenta(totalVenta + sumasTotales);
			setventaTarjeta(ventaTarjeta + sumasTarjetas);
			setventaEfectivo(sumasTotales - (sumasTarjetas + sumasaCuentas));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",

		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});

	const sumarTotales = (item) => {
		let sumaTotal = 0;
		let sumaTarjeta = 0;
		let sumaACuenta = 0;
		let ventasEfectivo = 0;
		let sumaTotalEfectivo = 0;
		let sumaEfectivoFinal = 0;
		let recargasMonto = 0;

		for (let iterator of item) {
			sumaTarjeta = sumaTarjeta + iterator.tarjeta;
			sumaTotal = sumaTotal + iterator.total;
			sumaACuenta = sumaACuenta + iterator.aCuenta;
		}
		ventasEfectivo = sumaTotal - (sumaTarjeta + sumaACuenta);

		let cajaInicio = 0;
		let cajaEntrada = 0;
		let cajaSalida = 0;
		for (let cadaDia of cajasDia) {
			// Caja inicio
			if (item[0].vendedor === cadaDia.vendedor && cadaDia.tipo === "inicio") {
				cajaInicio = cadaDia.monto;
			}
			// Entrada
			if (
				item[0].vendedor === cadaDia.vendedor &&
				cadaDia.tipo === "entradaSalida"
			) {
				if (cadaDia.monto > 0) {
					cajaEntrada = cadaDia.monto;
				} else if (cadaDia.monto < 0) {
					cajaSalida = cadaDia.monto;
				}
			}
			if (
				item[0].vendedor === cadaDia.vendedor &&
				cadaDia.tipo === "recargas"
			) {
				recargasMonto = cadaDia.monto;
			}
		}

		sumaTotalEfectivo = ventasEfectivo + cajaInicio;
		sumaEfectivoFinal = cajaEntrada + cajaSalida + sumaTotalEfectivo;
		return (
			<>
				<Divider orientation='left' style={{ marginTop: 0 }}>
					<h1 style={{ fontSize: "x-large", color: "#001e36" }}>
						{item[0].vendedor}
					</h1>
				</Divider>
				<Row>
					<Col xs={10}>
						<h3>Efectivo Caja</h3>
						<h3>Venta Efectivo </h3>
						<h3>Venta tarjeta</h3>
						<h3>Total Venta</h3>
						<h3>Total Efectivo</h3>
						<br />
						<h3>Entradas</h3>
						<h3>Salidas</h3>
						<h3>Efectivo</h3>
						<br />
					</Col>
					<Col xs={5} style={{ textAlignLast: "end" }}>
						<h3>{formatter.format(cajaInicio)}</h3>
						<h3>{formatter.format(ventasEfectivo)}</h3>
						<h3>{formatter.format(sumaTarjeta)}</h3>
						<h3>{formatter.format(sumaTotal)}</h3>
						<h3>{formatter.format(sumaTotalEfectivo)}</h3>
						<br />
						<h3>{formatter.format(cajaEntrada)}</h3>
						<h3>{formatter.format(cajaSalida)}</h3>
						<h3>{formatter.format(sumaEfectivoFinal)} </h3>
						<br />
					</Col>
					<Col xs={9} style={{ textAlignLast: "end" }}>
						<h3>Recargas</h3>
						<h3>{formatter.format(recargasMonto)}</h3>
					</Col>
				</Row>
				<br />
				{/* <Row>
					<Col xs={10}>
						<h3>Dinero en efectivo que hay en caja</h3>
					</Col>
					<Col xs={14} style={{ textAlignLast: "end" }}>
						<h4>0000000000</h4>

						<h4>0000000000</h4>
						<h4>0000000000</h4>
						<h4>0000000000</h4>
						<h4>0000000000</h4>

						<h3>0000000000</h3>
					</Col>
				</Row> */}
				<br />
			</>
		);
	};
	return (
		<>
			<Row justify='center'>
				<h1
					style={{
						fontSize: "x-large",
						fontWeight: "bold",
						color: "#001e36",
					}}
				>
					Corte
				</h1>
			</Row>
			<Divider orientation='left' style={{ marginTop: 0 }}>
				<h1 style={{ fontSize: "x-large", color: "#001e36" }}>Del día</h1>
			</Divider>
			<Row>
				<Col xs={8}>
					<h3>Venta Efectivo</h3>
					<h3>Venta tarjeta</h3>
				</Col>
				<Col xs={7} style={{ textAlignLast: "end" }}>
					<h3>{formatter.format(ventaEfectivo)}</h3>
					<h3>{formatter.format(ventaTarjeta)}</h3>
				</Col>
				<Col xs={9} style={{ textAlignLast: "end" }}>
					<h3 style={{ fontWeight: "bold" }}>Total Venta</h3>
					<h3 style={{ fontWeight: "bold" }}>{formatter.format(totalVenta)}</h3>
				</Col>
			</Row>
			<br />

			{dataVentasDiaAdmin?.map((item) => {
				return (
					<>
						{sumarTotales(item)} <br />
						<br />
					</>
				);
			})}
		</>
	);
};

export default Corte;
