import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { settingsService } from "./settingsService";

export const getSettings = createAsyncThunk('settings/get' , async (_ , thunkAPI)=>{
    try {
        return await settingsService.getSettings()
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const saveSettings = createAsyncThunk('settings/save' , async (data , thunkAPI)=>{
    try {
        return await settingsService.saveSettings(data)
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const settingsSlice = createSlice({
    name : "settings" , 
    initialState : {
        isLoading : false ,
        settings : {}
    },

    extraReducers : builder => 
        builder
        // get settings 
        .addCase(getSettings.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(getSettings.fulfilled , (state , action)=>{
            state.isLoading = false 
            state.settings = action.payload
            console.log(action.payload)
        })
        .addCase(getSettings.rejected , (state , action)=>{
            state.isLoading = false 
            console.log(action.payload)
        })

        // save settings 
        .addCase(saveSettings.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(saveSettings.fulfilled , (state , action)=>{
            state.isLoading = false 
            state.settings = action.payload
            console.log(action.payload)
        })
        .addCase(saveSettings.rejected , (state , action)=>{
            state.isLoading = false 
            console.log(action.payload)
        })
}) 



export default settingsSlice.reducer