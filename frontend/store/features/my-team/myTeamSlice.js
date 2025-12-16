import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { myTeamService } from "./myTeamService";

export const getTeam = createAsyncThunk('my-team/get' , async (id , thunkAPI)=>{
    try {
        return await myTeamService.getTeam(id)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const myTeamSlice= createSlice({
    name : 'my-team' ,
    initialState : {
        isLoading : false ,
        my_team : null
    },

    extraReducers : builder=>{
        builder
        // get team 
        .addCase(getTeam.pending , (state)=>{
            state.isLoading= true 
        })
        .addCase(getTeam.fulfilled , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
            state.my_team = action.payload
        })
        .addCase(getTeam.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })
        
    }
})

export default myTeamSlice.reducer