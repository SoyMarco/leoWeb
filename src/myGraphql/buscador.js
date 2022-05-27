import gql from "graphql-tag";
import { typeApartado } from "./Types/apartado";
import { typeEncargo } from "./Types/encargo";

export const GET_DATA_BUSCADOR = gql`
	query getDataBuscador {
		${typeApartado}
        ${typeEncargo}
	}
`;
