import React, { useEffect, useState } from "react";
import "./corte.css";
import { Row, Divider, Col } from "antd";
import { useQuery } from "@apollo/client";
import { GET_VENTAS_DIA_ADMIN } from "../../../graphql/venta";
import { GET_CAJA_DIA_ADMIN } from "../../../graphql/caja";
import ErrorConection from "Utils/ErrorConection";
import useAuth from "hooks/useAuth";
import "./corte.css";

const Corte = () => {
	let { data, error, refetch } = useQuery(GET_VENTAS_DIA_ADMIN);
	let { data: getCajas, refetch: refetchCaja } = useQuery(GET_CAJA_DIA_ADMIN);
	const [getVentasDiaAdmin, setgetVentasDiaAdmin] = useState([]);
	const [cajasDia, setcajasDia] = useState([]);
	const [ventaEfectivo, setventaEfectivo] = useState(0);
	const [ventaTarjeta, setventaTarjeta] = useState(0);
	const [totalVenta, settotalVenta] = useState(0);
	const { logout } = useAuth();
	useEffect(() => {
		refetch();
		refetchCaja();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (error) {
		ErrorConection(logout);
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
			let vendedoresSeparados = [
				// { "ISABEL LEÓN": [] },
				// { PAO: [] },
				// { MARCO: [] },
				// { PAO: [] },
				// { "ISABEL LEÓN": [] },
				// { "ISABEL SALAZAR": [] },
				// { LUPITA: [] },
				// { GABY: [] },
				// { JESSICA: [] },
			];

			for (let i = 0; i < getVentasDiaAdmin.length; i++) {
				const vendedor = getVentasDiaAdmin[i].vendedor;

				let listVendedores1 = [];
				for (let q = 0; q < vendedoresSeparados.length; q++) {
					const nameVendedorKey = Object.keys(vendedoresSeparados[q])[0];
					listVendedores1.push(nameVendedorKey);
				}

				if (listVendedores1.includes(vendedor)) {
					let listVendedores = [];
					for (let z = 0; z < vendedoresSeparados.length; z++) {
						const nameVendedorKey = Object.keys(vendedoresSeparados[z])[0];
						listVendedores.push(nameVendedorKey);
					}

					for (let x = 0; x < vendedoresSeparados.length; x++) {
						const nameVendedorKey2 = Object.keys(vendedoresSeparados[x])[0];

						if (nameVendedorKey2 === vendedor) {
							vendedoresSeparados[x][vendedor].push(getVentasDiaAdmin[i]);
						}
					}
				} else {
					vendedoresSeparados.push({
						[vendedor]: [getVentasDiaAdmin[i]],
					});
				}
			}
			// console.log("vendedoresSeparados", vendedoresSeparados);
			let datosSeparados = vendedoresSeparados.map((obj) => {
				return obj[Object.keys(obj)[0]];
			});
			console.log("datosSeparados", datosSeparados);
			setgetVentasDiaAdmin(datosSeparados);

			// Calculos de cuentas
			let sumasTotales = 0;
			let sumasTarjetas = 0;
			let sumasEfectivos = 0;
			let sumasaCuentas = 0;
			for (let ds = 0; ds < datosSeparados.length; ds++) {
				let items = datosSeparados[ds];

				let sumasTotal = 0;
				let sumasTarjeta = 0;
				let sumasEfectivo = 0;
				let sumasaCuenta = 0;
				for (let it = 0; it < items.length; it++) {
					sumasTotal = sumasTotal + items[it].total;
					sumasTarjeta = sumasTarjeta + items[it].tarjeta;
					sumasEfectivo = sumasEfectivo + items[it].efectivo;
					sumasaCuenta = sumasaCuenta + items[it].aCuenta;
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

	var formatter = new Intl.NumberFormat("en-US", {
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
		for (let it = 0; it < item.length; it++) {
			sumaTarjeta = sumaTarjeta + item[it].tarjeta;
			sumaTotal = sumaTotal + item[it].total;
			sumaACuenta = sumaACuenta + item[it].aCuenta;
		}
		ventasEfectivo = sumaTotal - (sumaTarjeta + sumaACuenta);

		let cajaInicio = 0;
		let cajaEntrada = 0;
		let cajaSalida = 0;
		for (let cd = 0; cd < cajasDia.length; cd++) {
			// Caja inicio
			if (
				item[0].vendedor === cajasDia[cd].vendedor &&
				cajasDia[cd].tipo === "inicio"
			) {
				cajaInicio = cajasDia[cd].monto;
			}
			// Entrada
			if (
				item[0].vendedor === cajasDia[cd].vendedor &&
				cajasDia[cd].tipo === "entradaSalida"
			) {
				if (cajasDia[cd].monto > 0) {
					cajaEntrada = cajasDia[cd].monto;
				} else if (cajasDia[cd].monto < 0) {
					cajaSalida = cajasDia[cd].monto;
				}
			}
		}
		sumaTotalEfectivo = ventasEfectivo + cajaInicio;
		sumaEfectivoFinal = cajaEntrada + cajaSalida + sumaTotalEfectivo;
		return (
			<>
				<Divider orientation='left' style={{ marginTop: 0 }}>
					<h1 style={{ fontSize: "x-large", color: "darkblue" }}>
						{item[0].vendedor}
					</h1>
				</Divider>
				<Row>
					<Col xs={8}>
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
					<Col xs={11} style={{ textAlignLast: "end" }}>
						<h3>Recargas</h3>
						<h3>0000000000</h3>
					</Col>
				</Row>
				<br />
				<Row>
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
				</Row>
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
						color: "darkblue",
					}}
				>
					Corte
				</h1>
			</Row>
			<Divider orientation='left' style={{ marginTop: 0 }}>
				<h1 style={{ fontSize: "x-large", color: "darkblue" }}>Del día</h1>
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

			{getVentasDiaAdmin?.map((item) => {
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
