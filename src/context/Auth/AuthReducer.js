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

		SET_FIRST_LOGIN: {
			firstLogin: payload,
		},
	};

	return { ...state, ...REDUCER[type] };
};
