import { configureStore } from "@reduxjs/toolkit";
import {
    persistStore, persistReducer,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

import  SliceReducer  from "./Slice/slice";

const sessionStorage = {
    key: "Login-session",
    storage: storageSession
};

const persistFunction = persistReducer(sessionStorage, SliceReducer);

export const Store = configureStore({
    reducer: {
        loginInfo: persistFunction
    },

    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persist= persistStore(Store);