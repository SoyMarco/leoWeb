import gql from "graphql-tag";

export const REGISTER_CAJA = gql`
	mutation registerCaja($input: CajaInput) {
		registerCaja(input: $input)
	}
`;

export const GET_CAJA_DIA = gql`
	query getCajaDia {
		getCajaDia {
			_id
			tipo
			monto
			vendedor
			createAt
			cancelado {
				status
				fecha
				vendedor
			}
		}
	}
`;
export const GET_CAJA_DIA_ADMIN = gql`
	query getCajaDiaAdmin {
		getCajaDiaAdmin {
			_id
			tipo
			monto
			vendedor
			createAt
			cancelado {
				status
				fecha
				vendedor
			}
		}
	}
`;
