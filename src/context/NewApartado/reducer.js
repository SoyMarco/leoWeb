// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
	const { payload, type } = action;

	const REDUCER = {
		// Set
		COBRAR_SET: {
			cobrar: payload,
		},
		// Clear
		COBRAR_CLEAN: {
			cobrar: {},
		},
		//
		MODAL_COBRAR: {
			modalCobrar: payload,
		},
	};

	return { ...state, ...REDUCER[type] };
};
