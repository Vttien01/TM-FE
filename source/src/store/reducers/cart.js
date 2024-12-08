import { createReducer } from '@store/utils';
import { cartActions } from '@store/actions';
import { defaultLocale } from '@constants';
import { getData } from '@utils/localStorage';
import { storageKeys } from '@constants';
const { addItemCart, removeItemCarts, getCartItemList } = cartActions;
const storedCart = getData(storageKeys.ITEM_CART);
const initialState = {
    cart: storedCart ? storedCart : [],
};

const appReducer = createReducer(
    {
        reducerName: 'cart',
        initialState: {
            cart: [],
            loading: false,
            error: null,
        },
        // storage: {
        //     whiteList: [ 'theme', 'locale', 'cart' ],
        // },
    },
    {
        [addItemCart.type]: (state, { payload }) => {
            state.cart.push(payload);
        },
        [removeItemCarts.type]: (state, { payload }) => {
            state.cart = state.cart.filter((product) => product.id !== payload.id);
        },
        [getCartItemList.type]: (state, { payload }) => {
            state.cart = payload;
        },
    },
);

export default appReducer;
