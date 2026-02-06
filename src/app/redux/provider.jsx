"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Store,  persist } from "./Store";

export default function ReduxProvider({ children }) {
    return (
        <Provider store={Store}>
            <PersistGate loading={null} persistor={persist}>
                {children}
            </PersistGate>
        </Provider>
    );
}
