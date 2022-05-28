import gql from "graphql-tag";
import { typeApartado } from "./Types/apartado";

export const GET_FOLIO_MAX_APARTADO = gql`
	mutation getFolioMaxApartado($input: BasicInput) {
		getFolioMaxApartado(input: $input) {
			folio
		}
	}
`;

export const GET_PRODUCTOS_FOLIO = gql`
	query getProductosFolio($folio: Float) {
		getProductosFolio(folio: $folio) ${typeApartado}
	}
`;

export const GET_APARTADOS_BUSCADOR = gql`
	query getApartados {
		getApartados {
			id
			cliente
			folio
			vence
			tipo
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
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
	}
`;
export const ADD_ABONO = gql`
	mutation addAbono($input: AbonoApartadoInput) {
		addAbono(input: $input) ${typeApartado}
	}
`;
export const ADD_PRODUCTO = gql`
	mutation addProducto($input: ProductoApartadoInput) {
		addProducto(input: $input) ${typeApartado}
	}
`;
export const CANCEL_ENTREGA = gql`
	mutation cancelEntrega($input: cancelEntregaInput) {
		cancelEntrega(input: $input)
	}
`;
export const CANCELAR_PRODUCTO_APARTDO = gql`
	mutation cancelarProductoApartado($input: productoESCinput) {
		cancelarProductoApartado(input: $input) ${typeApartado}
	}
`;
export const EDIT_VENCE_APARTADO = gql`
	mutation editVenceApartado($input: editVenceApartadoInput) {
		editVenceApartado(input: $input) ${typeApartado}
	}
`;
export const BORRAR_EDITAR_ABONO = gql`
	mutation borrarEditarAbono($input: AbonoApartadoInput) {
		borrarEditarAbono(input: $input) ${typeApartado}
	}
`;
export const CANCELAR_APARTADO = gql`
	mutation cancelarApartado($input: CancelarApartadoInput) {
		cancelarApartado(input: $input) ${typeApartado}
	}
`;
export const SEARCH_APARTADO = gql`
	query searchApartado($search: String) {
		searchApartado(search: $search) {
			id
			cliente
			folio
			vence
		}
	}
`;
export const REGISTER_APARTADO = gql`
	mutation registerApartado($input: ApartadoInput) {
		registerApartado(input: $input) ${typeApartado}
	}
`;
export const GET_PRODUCTS_NAME = gql`
	query getProductsName {
		getProductsName {
			value
			key
		}
	}
`;
export const GET_CLIENTS_NAMES = gql`
	query getClientsNames {
		getClientsNames {
			value
			key
		}
	}
`;

export const REGISTER_APARTADO_F3 = gql`
	mutation registerApartadoF3($input: ApartadoInput) {
		registerApartadoF3(input: $input) ${typeApartado}
	}
`;
