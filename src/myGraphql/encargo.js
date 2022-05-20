import gql from "graphql-tag";
const typeEncargo = `{
			id
			cliente
			folio
			vendedor
			createAt
			guardado {
				status
				fecha
				vendedor
			}
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
				precio
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
		}`;

export const REGISTER_ENCARGO = gql`
	mutation registerEncargo($input: EncargoInput) {
		registerEncargo(input: $input)
	}
`;
export const GET_ENCARGOS = gql`
	query getEncargos {
		getEncargos ${typeEncargo}
	}
`;
export const EDIT_GUARDAR_ENCARGO = gql`
	mutation editGuararEncargo($input: CancelarApartadoInput) {
		editGuararEncargo(input: $input) ${typeEncargo}
	}
`;

export const GET_ENCARGO_FOLIO = gql`
	query getEncargoFolio($folio: Float) {
		getEncargoFolio(folio: $folio) ${typeEncargo}
	}
`;
export const CANCELAR_ENCARGO = gql`
	mutation cancelarApartado($input: CancelarApartadoInput) {
		cancelarApartado(input: $input)
	}
`;
export const CANCEL_ENTREGA = gql`
	mutation cancelEntrega($input: cancelEntregaInput) {
		cancelEntrega(input: $input)
	}
`;
export const EDIT_PRODUCTO_ENCARGO = gql`
	mutation editProductoEncargo($input: EditProductEncargoInput) {
		editProductoEncargo(input: $input) ${typeEncargo}
	}
`;
export const ADD_PRODUCTO_ENCARGO = gql`
	mutation addProductoEncargo($input: EditProductEncargoInput) {
		addProductoEncargo(input: $input) ${typeEncargo}
	}
`;
