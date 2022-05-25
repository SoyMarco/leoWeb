import gql from "graphql-tag";
import { typeEncargo } from "./Types/encargo";

export const REGISTER_ENCARGO = gql`
	mutation registerEncargo($input: EncargoInput) {
		registerEncargo(input: $input) ${typeEncargo}
	}
`;
export const GET_ENCARGOS = gql`
	query getEncargos {
		getEncargos ${typeEncargo}
	}
`;
export const EDIT_GUARDAR_ENCARGO = gql`
	mutation editGuardarEncargo($input: CancelarApartadoInput) {
		editGuardarEncargo(input: $input) ${typeEncargo}
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
export const ADD_ABONO_ENCARGO = gql`
	mutation addAbonoEncargo($input: AbonoEncargoInput) {
		addAbonoEncargo(input: $input) ${typeEncargo}
	}
`;
