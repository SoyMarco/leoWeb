import gql from "graphql-tag";
const typePerfume = `{
			_id
			key
			nombre
			genero
			vendedor
			createAt
			cancelado
			size {
				tipo
				stock
				minStock
				vendedor
				createAt
			}
		}`;

export const REGISTER_PERFUME = gql`
	mutation registerPerfume($input: PerfumeInput) {
		registerPerfume(input: $input) ${typePerfume}
	}
`;

export const GET_ALL_PERFUME = gql`
	query getAllPerfumes {
		getAllPerfumes ${typePerfume}
	}
`;
