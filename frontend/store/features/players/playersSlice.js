import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { playersService } from "./playersService";

const initialState = {
    players : [] ,
    isLoading : false ,
}


export const getAllPlayers = createAsyncThunk('players/get' , async (_ , thunkAPI)=>{
    try {
        return await playersService.getAllPlayers()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const createPlayer = createAsyncThunk('players/create' , async (player , thunkAPI)=>{
    try {
        return await playersService.create(player)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const updatePlayer = createAsyncThunk('players/update' , async (player , thunkAPI)=>{
    try {
        return await playersService.update(player.id , player.formData)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const playersSlice = createSlice({
    name : "players" ,
    initialState ,
    extraReducers: (builder) => {
        builder
        // Get all players 
        .addCase(getAllPlayers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllPlayers.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
            state.players = action.payload
        })
        .addCase(getAllPlayers.rejected, (state, action) => {
            state.isLoading = false;
            state.players = []
            console.log(action.payload)
        })

        // create Team
        .addCase(createPlayer.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createPlayer.fulfilled, (state, action) => {
            state.isLoading = false;
            state.players.push(action.payload.player)
            console.log(action.payload)
        })
        .addCase(createPlayer.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
        })

        // update Player
        .addCase(updatePlayer.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updatePlayer.fulfilled, (state, action) => {
            state.isLoading = false;
            const { id } = action.meta.arg
            const playerToEdit = state.players.findIndex(player => player.player_id == id);
            state.players[playerToEdit] = action.payload.player
            console.log(action.payload)
        })
        .addCase(updatePlayer.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
        })
    }
})


export default playersSlice.reducer