"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  user: null ,
  isLoading : false ,
  status : null ,
  statusMsg : null ,

};

export const registerUser = createAsyncThunk('/api/auth/register' , async (user , thunkAPI)=>{
  try {
    return await authService.register(user)
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})


export const loginUser = createAsyncThunk('/api/auth/login' , async (user , thunkAPI)=>{
  try {
    return await authService.login(user)
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
    });
}

});

export default authSlice.reducer;
