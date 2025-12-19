import axios from "axios"

axios.defaults.withCredentials = true;

const createLeague = async (league_name) => {
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/leagues/create` , {league_name})
    return respone.data
}


const joinLeague = async (id) => {
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/leagues/join` , {id})
    return respone.data
}


const getLeague = async (id) => {
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/leagues/${id}`)
    return respone.data
}



const getAllLeagues = async () => {
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/leagues`)
    return respone.data
}


export const leagueService = { createLeague , getAllLeagues , joinLeague , getLeague}