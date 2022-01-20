// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
	const { payload, type } = action;

	const REDUCER = {
		// Add
		SET_AUTH: {
			auth: payload,
		},
		// Clear
		LOGOUT: {
			auth: undefined,
		},
	};

	return { ...state, ...REDUCER[type] };
};
