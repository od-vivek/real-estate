import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: 'jdsakldsal',
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState, // Corrected
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { signInFailure, signInStart, signInSuccess } = userSlice.actions;

export default userSlice.reducer;
