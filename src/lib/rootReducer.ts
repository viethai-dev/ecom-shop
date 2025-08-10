import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/lib/features/auth/authSlice';
import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";
import wishlistReducer from "./features/wishlist-slice";
import productDetailsReducer from "./features/product-details";

const rootReducer = combineReducers({
    auth: authReducer,
    quickViewReducer: quickViewReducer,
    cartReducer: cartReducer,
    wishlistReducer: wishlistReducer,
    productDetailsReducer: productDetailsReducer,
});

export default rootReducer;
