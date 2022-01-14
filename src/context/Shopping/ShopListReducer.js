import { ADD_PRODUCT_SHOP_LIST, CLEAR_SHOP_LIST } from "./types";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
	const { payload, type } = action;

	switch (type) {
		case ADD_PRODUCT_SHOP_LIST:
			return {
				...state,
				shopList: payload,
			};
		case CLEAR_SHOP_LIST:
			return {
				...state,
				shopList: [],
			};

		default:
			return state;
	}
};
