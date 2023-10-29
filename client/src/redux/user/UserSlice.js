import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
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
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload,
                state.loading = false,
                state.error = null
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload,
                state.loading = false;
        },
        deleteUserStart: (state, action) => {
            state.loading = true;
        },
        deleteUserSuccess: (state, action) => {
            state.loading = false,
                state.currentUser = null,
                state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signoutUserStart: (state, action) => {
            state.loading = true;
        },
        signoutUserSuccess: (state, action) => {
            state.loading = false,
                state.currentUser = null,
                state.error = null
        },
        signoutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
});

export const { signInFailure,
    signInStart,
    signInSuccess,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserSuccess,
    deleteUserStart,
    signoutUserFailure,
    signoutUserSuccess,
    signoutUserStart,
    resetError
} = userSlice.actions;
/**this is minor change */
export default userSlice.reducer;
