import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogin: false,
    Loginid: null,
    // role: null
};

export const Slice = createSlice({
    name: "Login_detils",
    initialState,
    reducers: {
        login(state, action) {
            state.isLogin = true;
            state.Loginid = action.payload.id;
            // state.role=action.payload.role
        },
        logout(state) {
            state.isLogin = false;
            state.Loginid = null;
            // state.role=null;
        }
    }
});

export const {login,logout} = Slice.actions;

export default Slice.reducer;