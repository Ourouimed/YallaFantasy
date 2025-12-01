"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/features/auth/authSlice";
import PopupReducer  from "./features/popup/popupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer ,
    popup : PopupReducer
  }
});
