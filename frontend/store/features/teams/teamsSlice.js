import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { teamsService } from "./teamsService";
const initialState = {
    teams : null ,
    isLoading : false ,
    status : null ,
    statusMsg : null ,
}

export const createTeam = createAsyncThunk('teams/create' , async (team , thunkAPI)=>{
    try {
        return await teamsService.create(team)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})
export const teamsSlice = createSlice({
    name : 'teams' ,
    initialState, 
    extraReducers: (builder) => {
        builder
        // create Team
        .addCase(createTeam.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createTeam.fulfilled, (state, action) => {
          state.isLoading = false;
          console.log(action.payload)
        })
        .addCase(createTeam.rejected, (state, action) => {
          state.isLoading = false;
          state.status = false
          state.statusMsg = action.payload
          state.teams = null
          console.log(action.payload)
        })
    }
})

export default teamsSlice.reducer