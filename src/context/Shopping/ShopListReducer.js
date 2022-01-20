// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
	const { payload, type } = action;

	const REDUCER = {
		// Add
		ADD_PRODUCT_SHOP_LIST: {
			shopList: payload,
		},
		// Clear
		CLEAR_SHOP_LIST: {
			shopList: [],
		},
	};

	return { ...state, ...REDUCER[type] };
};
