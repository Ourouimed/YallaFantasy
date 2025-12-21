import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { myTeamService } from "./myTeamService";

export const getTeam = createAsyncThunk('my-team/get' , async (_ , thunkAPI)=>{
    try {
        return await myTeamService.getTeam()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const saveTeam = createAsyncThunk('my-team/save' , async (data , thunkAPI)=>{
    try {
        return await myTeamService.saveTeam(data)
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const savePickedTeam = createAsyncThunk('my-team/pick-team/save' , async (data , thunkAPI)=>{
    try {
        return await myTeamService.savePickedTeam(data)
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})



export const getPickedTeam = createAsyncThunk('my-team/pick-team' , async (data , thunkAPI)=>{
    try {
        console.log('Test')
        return await myTeamService.getPickedTeam()
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const myTeamSlice= createSlice({
    name : 'my-team' ,
    initialState : {
        isLoading : false ,
        my_team : null ,
        picked_team : null
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




        // get picked team 
        .addCase(getPickedTeam.pending , (state)=>{
            state.isLoading= true 
        })
        .addCase(getPickedTeam.fulfilled , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
            state.picked_team = action.payload
        })
        .addCase(getPickedTeam.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })


        // save team 
        .addCase(saveTeam.pending , (state)=>{
            state.isLoading= true 
        })
        .addCase(saveTeam.fulfilled , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })
        .addCase(saveTeam.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })



         // save picked team 
        .addCase(savePickedTeam.pending , (state)=>{
            state.isLoading= true 
        })
        .addCase(savePickedTeam.fulfilled , (state , action)=>{
            state.isLoading = false
            state.picked_team = action.payload
            console.log(action.payload)
        })
        .addCase(savePickedTeam.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })
        
    }
})

export default myTeamSlice.reducer