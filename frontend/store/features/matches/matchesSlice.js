import { matchesService } from "./matchesService";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const initialState = {
    matches : [] ,
    isLoading : false , 
    currMatch : null
}

export const createMatch =  createAsyncThunk('matches/create' , async (match , thunkAPI)=>{
    try {
        return await matchesService.create(match)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const addToLinup =  createAsyncThunk('matches/linup/add' , async (data , thunkAPI )=>{
    try {
        return await matchesService.addToLinup(data)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const updateLinupPlayer =  createAsyncThunk('matches/linup/update' , async (data , thunkAPI )=>{
    try {
        return await matchesService.updateLinupPlayer(data)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})



export const startMatch =  createAsyncThunk('matches/start' , async (id , thunkAPI)=>{
    try {
        return await matchesService.start(id)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const getAllMatches = createAsyncThunk('matches/get' , async (_ , thunkAPI)=>{
    try {
        return await matchesService.getAllMatches()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const getMatchDetaills = createAsyncThunk('matches/getCurrent' , async (id , thunkAPI)=>{
    try {
        return await matchesService.getMatchDetaills(id)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const deletPlayerFromLinup = createAsyncThunk('matches/linup/delete' , async (data , thunkAPI)=>{
    try {
        console.log(data)
        return await matchesService.deletePlayerFromLinup(data.player_id , data.match_id)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const macthesSlice = createSlice({
    name : 'matches' ,
    initialState ,
    extraReducers : builder =>{
        builder
        // Create Match
        .addCase(createMatch.pending, (state) => {
            state.isLoading = true;
         })
        .addCase(createMatch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.matches.push(action.payload.match)
            console.log(action.payload)
        })
        .addCase(createMatch.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
        })


        // Start Match
        .addCase(startMatch.pending, (state) => {
            state.isLoading = true;
         })
        .addCase(startMatch.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
            state.currMatch = action.payload
        })
        .addCase(startMatch.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
        })



        // Add to linup Match
        .addCase(addToLinup.pending, (state) => {
            state.isLoading = true;
         })
        .addCase(addToLinup.fulfilled, (state, action) => {
            state.isLoading = false
            const { team_side} = action.meta.arg
            console.log(team_side)
            state.currMatch.linups[team_side].push(action.payload.player)
            console.log(action.payload)
        })
        .addCase(addToLinup.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
        })


        // Update linup Match
        .addCase(updateLinupPlayer.pending, (state) => {
            state.isLoading = true;
         })
        .addCase(updateLinupPlayer.fulfilled, (state, action) => {
            state.isLoading = false;
            const { team_side, player_id } = action.meta.arg;
            const linup = state.currMatch.linups[team_side];
            const index = linup.findIndex(
                (p) => p.player_id === player_id
            );
            if (index !== -1) {
                linup[index] = {
                ...linup[index],
                ...action.payload.player
                };
            }
            })

        .addCase(updateLinupPlayer.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
        })


        // delete player by id from linup
                .addCase(deletPlayerFromLinup.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(deletPlayerFromLinup.fulfilled, (state, action) => {
                    const { team_side , player_id} = action.meta.arg
                    console.log(team_side)
                    state.isLoading = false;
                    const teamLinup = state.currMatch.linups[team_side]
                    state.currMatch.linups = teamLinup.filter(player => player.player_id !== player_id);
                })
                .addCase(deletPlayerFromLinup.rejected, (state, action) => {
                    state.isLoading = false;
                    console.log(action.payload)
                })




         // Get all matches 
                .addCase(getAllMatches.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(getAllMatches.fulfilled, (state, action) => {
                    state.isLoading = false;
                    console.log(action.payload)
                    state.matches = action.payload
                })
                .addCase(getAllMatches.rejected, (state, action) => {
                    state.isLoading = false;
                    state.matches = []
                    console.log(action.payload)
                })


        // Get match detaills 
                .addCase(getMatchDetaills.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(getMatchDetaills.fulfilled, (state, action) => {
                    state.isLoading = false;
                    console.log(action.payload)
                    state.currMatch = action.payload
                })
                .addCase(getMatchDetaills.rejected, (state, action) => {
                    state.isLoading = false;
                    state.currMatch = {}
                    console.log(action.payload)
                })
    }
})


export default macthesSlice.reducer