import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { roundsService } from "./roundsService";

export const createRound =  createAsyncThunk('rounds/create' , async (round , thunkAPI)=>{
    try {
        return await roundsService.create(round)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const updateRound =  createAsyncThunk('rounds/update' , async (round , thunkAPI)=>{
    try {
        return await roundsService.update(round)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const getAllrounds = createAsyncThunk('rounds/get' , async (_ , thunkAPI)=>{
    try {
        return await roundsService.getAllrounds()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const deleteRoundByid = createAsyncThunk('rounds/delete' , async (roundId , thunkAPI)=>{
    try {
        return await roundsService.deleteByid(roundId)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const roundsSlice = createSlice({
    name : "rounds" ,
    initialState : {
        rounds : [],
        isLoading : false
    },
    extraReducers : builder =>{
        builder
        // Create Round
        .addCase(createRound.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createRound.fulfilled, (state, action) => {
            state.isLoading = false;
            state.rounds.push(action.payload.round)
            console.log(action.payload)
        })
        .addCase(createRound.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
        })

        // get all rounds
        .addCase(getAllrounds.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllrounds.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
            state.rounds = action.payload
        })
        .addCase(getAllrounds.rejected, (state, action) => {
            state.isLoading = false;
            state.rounds = []
            console.log(action.payload)
        })

        // delete team by id
        .addCase(deleteRoundByid.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteRoundByid.fulfilled, (state, action) => {
            const deletedRoundId = action.meta.arg; 
            state.isLoading = false;
            state.rounds = state.rounds.filter(round => round.round_id !== deletedRoundId);
        })
        .addCase(deleteRoundByid.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload);
        })

        
        // update Team
        .addCase(updateRound.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateRound.fulfilled, (state, action) => {
          state.isLoading = false;
          const roundToEdit = state.rounds.findIndex(round => round.round_id == action.payload.round.round_id);
          state.rounds[roundToEdit] = action.payload.round
          console.log(action.payload)
        })  
        .addCase(updateRound.rejected, (state, action) => {
          state.isLoading = false;
          console.log(action.payload)
        })
    }
})

export default roundsSlice.reducer