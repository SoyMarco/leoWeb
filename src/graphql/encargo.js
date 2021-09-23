import gql from "graphql-tag";

export const REGISTER_ENCARGO = gql`
	mutation registerEncargo($input: EncargoInput) {
		registerEncargo(input: $input) {
			id
		}
	}
`;

export const GET_ENCARGOS = gql`
	query getEncargos {
		getEncargos {
			id
			cliente
			folio
			vendedor
			createAt
			entregado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
			productos {
				nombre
				talla
				color
				genero
				modelo
				cantidad
				key
				idUnico
				vendedor
				_id
				createAt
				entregado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			abonos {
				_id
				idVenta
				folioVenta
				abono
				vendedor
				createAt
				cancelado {
					status
					fecha
					vendedor
				}
			}
		}
	}
`;
