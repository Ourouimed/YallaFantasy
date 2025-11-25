"use client";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: {
    id: 1
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action) => {
        const {fullname , email  , password} = action.payload
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register` , {fullname , email  , password})
    }
  }
});

export const { register } = authSlice.actions;
export default authSlice.reducer;
