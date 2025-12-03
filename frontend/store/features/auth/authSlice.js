"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  user: null ,
  loggedIn : false ,
  isLoading : true ,
  status : null ,
  statusMsg : null ,
};

export const registerUser = createAsyncThunk('auth/register' , async (user , thunkAPI)=>{
  try {
    return await authService.register(user)
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})


export const loginUser = createAsyncThunk('auth/login' , async (user , thunkAPI)=>{
  try {
    return await authService.login(user)
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})


export const verifyEmail = createAsyncThunk('auth/verify-email' , async (id , thunkAPI)=>{
  try {
    return await authService.verifyEmail(id)
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})

export const verifySession = createAsyncThunk('auth/verify-session' , async (_ , thunkAPI)=>{
  try {
    return await authService.verifySession()
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})

export const logout = createAsyncThunk('auth/logout' , async (_ , thunkAPI)=>{
  try {
    return await authService.logout()
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
    // register
    .addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.status = true
      state.statusMsg = action.payload.message
      console.log(action.payload)
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.status = false
      state.statusMsg = action.payload
      state.user = null
      console.log(action.payload)
    })

    // Login 
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data
      state.status = true
      state.statusMsg = action.payload.message
      state.loggedIn = true
      console.log(action.payload)
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.status = false
      state.statusMsg = action.payload
      state.user = null
      state.loggedIn = false
    })

    // verify email
    .addCase(verifyEmail.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(verifyEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.status = true
      state.statusMsg = action.payload.message
      console.log(action.payload)
    })
    .addCase(verifyEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.status = false
      state.statusMsg = action.payload
    })


    // verify Session
    .addCase(verifySession.pending, (state) => {
      state.isLoading = true
    })
    .addCase(verifySession.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action.payload)
      state.user = action.payload.data
      state.status = true
      state.statusMsg = action.payload.message
      state.loggedIn = true
    })
    .addCase(verifySession.rejected, (state, action) => {
      state.isLoading = false;
      state.status = false
      state.statusMsg = action.payload
      state.user = null
      state.loggedIn = false
    })

    // Log out 
    .addCase(logout.pending, (state) => {
      state.isLoading = true
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action.payload)
      state.user = null
      state.loggedIn = false
      state.status = true
      state.statusMsg = action.payload
    })
    .addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.status = false
      state.statusMsg = action.payload
      state.user = null
      state.loggedIn = false
    })
}

});

export default authSlice.reducer;
