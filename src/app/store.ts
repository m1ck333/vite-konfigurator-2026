import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user/userSlice";
import backgroundReducer from "../features/background/backgroundSlice";
import configurationReducer from "../features/configuration/configurationSlice";
import priceReducer from "../features/price/priceSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    background: backgroundReducer,
    configuration: configurationReducer,
    price: priceReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
