import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { teamsService } from "./teamsService";
const initialState = {
    teams : [] ,
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


export const updateTeam = createAsyncThunk('teams/update' , async (team , thunkAPI)=>{
    try {
      console.log(team)
        return await teamsService.update(team.id , team.formData)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const getAllTeams = createAsyncThunk('teams/get' , async (_ , thunkAPI)=>{
    try {
        return await teamsService.getAllteams()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})



export const deleteTeamByid = createAsyncThunk('teams/delete' , async (teamId , thunkAPI)=>{
    try {
        return await teamsService.deleteByid(teamId)
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
          state.teams.push(action.payload.team)
          console.log(action.payload)
        })
        .addCase(createTeam.rejected, (state, action) => {
          state.isLoading = false;
          state.status = false
          state.statusMsg = action.payload
          console.log(action.payload)
        })

        // update Team
        .addCase(updateTeam.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateTeam.fulfilled, (state, action) => {
          state.isLoading = false;
          state.teams.push(action.payload.team)
          console.log(action.payload)
        })
        .addCase(updateTeam.rejected, (state, action) => {
          state.isLoading = false;
          state.status = false
          state.statusMsg = action.payload
          console.log(action.payload)
        })
        // get all Teams
        .addCase(getAllTeams.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllTeams.fulfilled, (state, action) => {
          state.isLoading = false;
          console.log(action.payload)
          state.teams = action.payload
        })
        .addCase(getAllTeams.rejected, (state, action) => {
          state.isLoading = false;
          state.status = false
          state.statusMsg = action.payload
          state.teams = []
          console.log(action.payload)
        })

        // delete team by id
        .addCase(deleteTeamByid.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteTeamByid.fulfilled, (state, action) => {
          const deletedTeamId = action.meta.arg; 
          state.isLoading = false;
          state.teams = state.teams.filter(team => team.team_id !== deletedTeamId);
        })
        .addCase(deleteTeamByid.rejected, (state, action) => {
          state.isLoading = false;
          state.status = false;
          state.statusMsg = action.payload;
          console.log(action.payload);
        });

    }
})

export default teamsSlice.reducer