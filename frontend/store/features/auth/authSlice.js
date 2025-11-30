"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  user: null ,
  isLoading : false ,
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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    
  },

  extraReducers: (builder) => {
    builder
    // register
    .addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log('Fullfilled')
      console.log(action.payload)
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.status = false
      state.statusMsg = action.payload
    })

    // Login 
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log('Fullfilled')
      console.log(action.payload)
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.status = false
      state.statusMsg = action.payload
    })


    .addCase(verifyEmail.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(verifyEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log('Fullfilled')
      console.log(action.payload)
    })
    .addCase(verifyEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.status = false
      state.statusMsg = action.payload
    });
}

});

export default authSlice.reducer;
