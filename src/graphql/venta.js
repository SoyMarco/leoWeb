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

export const CANCELAR_VENTA = gql`
	mutation cancelarVenta($input: CancelarVentaInput) {
		cancelarVenta(input: $input)
	}
`;

export const GET_HEROKU_DESPIERTO = gql`
	query getHerokuDespierto {
		getHerokuDespierto {
			boolean
		}
	}
`;
