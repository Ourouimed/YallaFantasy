"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/features/auth/authSlice";
import PopupReducer  from "./features/popup/popupSlice";
import teamsReducer  from "./features/teams/teamsSlice";
import toastReducer from "./features/toast/toastSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer ,
    popup : PopupReducer,
    teams : teamsReducer ,
    toast : toastReducer
  }
});
