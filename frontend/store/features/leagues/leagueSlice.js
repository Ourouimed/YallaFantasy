import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { leagueService } from "./leagueService";

export const createLeague = createAsyncThunk('leagues/create' , async (leagueName , thunkAPI)=>{
    try {
        return await leagueService.createLeague(leagueName)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const joinLeague = createAsyncThunk('leagues/join' , async (id , thunkAPI)=>{
    try {
        return await leagueService.joinLeague(id)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const updateLeague = createAsyncThunk('leagues/update' , async (data , thunkAPI)=>{
    try {
        return await leagueService.updateLeague(data)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})



export const getAllLeagues = createAsyncThunk('leagues/get' , async (_ , thunkAPI)=>{
    try {
        return await leagueService.getAllLeagues()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const deleteLeagueById = createAsyncThunk('league/delete' , async (id , thunkAPI)=>{
    try {
        return await leagueService.deleteLeagueById(id)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})




export const getLeague = createAsyncThunk('leagues/getSingle' , async (id , thunkAPI)=>{
    try {
        return await leagueService.getLeague(id)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})
export const leagueSlice = createSlice({
    name : 'league' ,
    initialState : {
        isLoading : false ,
        leagues : [] ,
        currentLeague : null
    },


    extraReducers : builder => {
        builder
        // Create league 
        .addCase(createLeague.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(createLeague.fulfilled , (state , action)=>{
            state.isLoading = false
            state.leagues.push(action.payload.league)
            console.log(action.payload)
        })
        .addCase(createLeague.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })



         // join league 
        .addCase(joinLeague.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(joinLeague.fulfilled , (state , action)=>{
            state.isLoading = false
            state.leagues.push(action.payload.league)
            console.log(action.payload)
        })
        .addCase(joinLeague.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })



        // delete league 
        .addCase(deleteLeagueById.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(deleteLeagueById.fulfilled , (state , action)=>{
            state.isLoading = false
            state.currentLeague = {}
            console.log(action.payload)
        })
        .addCase(deleteLeagueById.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })


            // update league 
        .addCase(updateLeague.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(updateLeague.fulfilled , (state , action)=>{
            state.isLoading = false
            state.currentLeague = action.payload
            console.log(action.payload)
        })
        .addCase(updateLeague.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })


        // getAll leagues 
        .addCase(getAllLeagues.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(getAllLeagues.fulfilled , (state , action)=>{
            state.isLoading = false
            state.leagues = action.payload.leagues
            console.log(action.payload)
        })
        .addCase(getAllLeagues.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })


        // get league 
        .addCase(getLeague.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(getLeague.fulfilled , (state , action)=>{
            state.isLoading = false
            state.currentLeague = action.payload
            console.log(action.payload)
        })
        .addCase(getLeague.rejected , (state , action)=>{
            state.isLoading = false
            console.log(action.payload)
        })
    }
})


export default leagueSlice.reducer