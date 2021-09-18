import gql from "graphql-tag";

export const REGISTER_ENCARGO = gql`
	mutation registerEncargo($input: EncargoInput) {
		registerEncargo(input: $input) {
			id
		}
	}
`;
