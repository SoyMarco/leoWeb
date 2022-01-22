import gql from "graphql-tag";

export const REGISTER_ESTRELLA = gql`
	mutation registerEstrella($input: EstrellaInput) {
		registerEstrella(input: $input)
	}
`;
export const GET_ESTRELLAS_VENDEDOR = gql`
	query getEstrellasVendedor {
		getEstrellasVendedor {
			estrellas
			vendedor
			createAt
		}
	}
`;

//llamadas locales
export const ADD_STARS_OK = gql`
	query addStarsOk {
		addStarsOk
	}
`;
