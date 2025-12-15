"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/features/auth/authSlice";
import PopupReducer  from "./features/popup/popupSlice";
import teamsReducer  from "./features/teams/teamsSlice";
import toastReducer from "./features/toast/toastSlice";
import playersReducer from "./features/players/playersSlice";
import roundsReducer from "./features/rounds/roundsSlice";
import matchesReducer from "./features/matches/matchesSlice";
import settingsReducer from "./features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer ,
    popup : PopupReducer,
    teams : teamsReducer ,
    players : playersReducer,
    toast : toastReducer ,
    rounds : roundsReducer,
    matches : matchesReducer , 
    settings : settingsReducer
  }
});
