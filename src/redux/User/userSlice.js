import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status:false,
    currentUser: "",
    certificateData:"",
    error: "",
    loading: false,
    token:"",
}

// Create User Slice 
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loadingInStart: (state) => {
            state.loading = true;
        },
        loadingInStop: (state) => {
            state.loading = false
        },
        signInStart: (state) => {
            state.loading = true;
            state.loaded=false;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
            state.status=true;
            state.loaded=true;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.status=false;
        },
        updateUserStart: (state) => {
            state.loading = true;

        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOutUserStart: (state) => {
            state.loading = true;
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
            state.token = null
            state.status =false
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setToken: (state,action) => {
            state.token = action.payload;
        },
        removeToken: (state,payload) => {
            state.token = null
        },
        setCertificate: (state,action) => {
            state.certificate = action.payload;
        },
        updateCertificate: (state,action) => {
            state.certificate = action.payload;
        },
        clearUser: (state) => {
            state = null
        },
    }
})

export const {
    loadingInStart,
    loadingInStop,
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserFailure,
    updateUserSuccess,
    updateUserStart,
    deleteUserFailure,
    deleteUserSuccess,
    deleteUserStart,
    signOutUserFailure,
    signOutUserSuccess,
    signOutUserStart,
    setToken,
    removeToken,
    clearUser
} = userSlice.actions;

export default userSlice.reducer;