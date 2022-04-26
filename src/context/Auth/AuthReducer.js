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
		//Set Login
		SET_FIRST_LOGIN: {
			firstLogin: payload,
		},
		//SET_IS_LOADING
		SET_IS_LOADING: {
			isLoading: payload,
		},
	};

	return { ...state, ...REDUCER[type] };
};
