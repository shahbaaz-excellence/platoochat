import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../../config/firebaseConfig";

export const userLogin = createAsyncThunk("/login", ({ email, password }) =>
  auth.signInWithEmailAndPassword(email, password)
);

export const userSignUp = createAsyncThunk("/signup", ({ email, password }) =>
  auth.createUserWithEmailAndPassword(email, password)
);

const initialState = {
  isAuthenticating: false,
  isAuthenticationFailed: true,
  isAuthenticationSuccess: false,
  userData:{},
  errorMsg:"",
};

const logIn = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    resetUserLogin: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      // console.log(payload,"success")
      state.isAuthenticating = false;
      state.isAuthenticationFailed = false;
      state.isAuthenticationSuccess = true;
      state.userData = payload.user;
      state.errorMsg = ""
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      // console.log(action,"failed")
      state.isAuthenticating = false;
      state.isAuthenticationFailed = true;
      state.isAuthenticationSuccess = false;
      state.userData = {};
      state.errorMsg = action?.error?.code;
    });
    builder.addCase(userLogin.pending, (state, { payload }) => {
      state.isAuthenticating = true;
      state.isAuthenticationFailed = false;
      state.isAuthenticationSuccess = false;
      state.userData = {};
      state.errorMsg = ""
    });

    builder.addCase(userSignUp.fulfilled, (state, { payload }) => {
      // console.log(payload,"signup s")
      state.isAuthenticating = false;
      state.isAuthenticationFailed = false;
      state.isAuthenticationSuccess = true;
      state.userData = payload.user;
      state.errorMsg = ""
    });
    builder.addCase(userSignUp.rejected, (state, action) => {
      // console.log(action,"signup f")
      state.isAuthenticating = false;
      state.isAuthenticationFailed = true;
      state.isAuthenticationSuccess = false;
      state.userData = {};
      state.errorMsg = action?.error?.code;
    });
    builder.addCase(userSignUp.pending, (state, { payload }) => {
      state.isAuthenticating = true;
      state.isAuthenticationFailed = false;
      state.isAuthenticationSuccess = false;
      state.userData = {};
      state.errorMsg = ""
    });
  },
});

export const { resetUserLogin } = logIn.actions;

export default logIn.reducer;