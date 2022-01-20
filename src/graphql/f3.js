import gql from "graphql-tag";

export const REGISTER_F3 = gql`
	mutation registerF3($input: F3Input) {
		registerF3(input: $input) {
			key
			apartado
			nombre
			precio
			cantidad
			totalArticulo
			vendedor
			refApartado
			cancelado
			createAt
			_id
		}
	}
`;
export const GET_ALL_F3 = gql`
	query getAllF3 {
		getAllF3 {
			key
			apartado
			nombre
			precio
			cantidad
			totalArticulo
			vendedor
			refApartado
			cancelado
			createAt
			_id
		}
	}
`;

export const CANCEL_F3 = gql`
	mutation cancelF3($input: CancelarVentaInput) {
		cancelF3(input: $input) {
			key
			apartado
			nombre
			precio
			cantidad
			totalArticulo
			vendedor
			refApartado
			cancelado
			createAt
			_id
		}
	}
`;
