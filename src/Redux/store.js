import { configureStore } from "@reduxjs/toolkit";

import { AuthReducer } from "./Slies/authSlice";

const store = new configureStore({
    reducer: {
        auth: AuthReducer,

    },
});

export default store;