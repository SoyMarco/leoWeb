import gql from "graphql-tag";

export const REGISTER_VENTA = gql`
	mutation registerVenta($input: VentaInput) {
		registerVenta(input: $input) {
			id
			folio
		}
	}
`;
export const GET_VENTAS_DIA = gql`
	query getVentasDia {
		getVentasDia {
			id
			createAt
			folio
			cancelado
			total
			efectivo
			tarjeta
			aCuenta
			pagoCon
			productos {
				_id
				idArray
				key
				nombre
				precio
				cantidad
				cancelado
				totalArticulo
				apartado
				refApartado
			}
		}
	}
`;
export const GET_VENTAS_MES = gql`
	query getVentasMes {
		getVentasMes {
			ventaMayor
		}
	}
`;
export const GET_VENTAS_DIA_ADMIN = gql`
	query getVentasDiaAdmin {
		getVentasDiaAdmin {
			vendedor
			id
			createAt
			folio
			cancelado
			total
			efectivo
			tarjeta
			aCuenta
			pagoCon
			productos {
				_id
				idArray
				key
				nombre
				precio
				cantidad
				cancelado
				totalArticulo
				apartado
				refApartado
			}
		}
	}
`;

export const GET_HEROKU_DESPIERTO = gql`
	query getHerokuDespierto {
		getHerokuDespierto {
			boolean
		}
	}
`;
export const GET_VENTAS_MOBILE = gql`
	query getVentasMobile {
		getVentasMobile {
			id
			mobile
			vendedor
			createAt
			folio
			cancelado
			total
			efectivo
			tarjeta
			aCuenta
			pagoCon
			productos {
				_id
				idArray
				key
				nombre
				precio
				cantidad
				cancelado
				totalArticulo
				apartado
				refApartado
			}
		}
	}
`;
export const VENTA_MOBILE_FALSE = gql`
	mutation ventaMobileFalse($input: CancelarVentaInput) {
		ventaMobileFalse(input: $input)
	}
`;

export const GET_TOTAL_VENTAS_DIA = gql`
	query getTotalVentasDia {
		getTotalVentasDia
	}
`;

const getCorteType = `ventas {
				key
				id
				createAt
				folio
				cancelado
				total
				efectivo
				tarjeta
				aCuenta
				pagoCon
				productos {
					_id
					idArray
					key
					nombre
					precio
					cantidad
					cancelado
					totalArticulo
					apartado
					refApartado
				}
			}
			totales {
				key
				inicioCaja
				ventasEfectivo
				totalEfectivo
				efectivoFinalCaja
				entSal
				entradas
				salidas
				efectivo
				tarjeta
				aCuenta
				total
				finCaja
				recargas
			}`;
export const GET_CORTE = gql`
	query getCorte {
		getCorte {
			${getCorteType}
		}
	}
`;
export const CANCELAR_PRODUCTO_VENTA = gql`
	mutation cancelProductVenta($input: cancelProductVentaInput) {
		cancelProductVenta(input: $input) {
			${getCorteType}
		}
	}
`;
export const CANCELAR_VENTA = gql`
	mutation cancelarVenta($input: CancelarVentaInput) {
		cancelarVenta(input: $input) {
			${getCorteType}
		}
	}
`;

//llamadas locales
export const VENTA_F3 = gql`
	query ventaF3 {
		ventaF3 {
			productos
			vendedor
			folio
			total
			efectivo
			tarjeta
			aCuenta
			pagoCon
			referencia
			notas
		}
	}
`;
