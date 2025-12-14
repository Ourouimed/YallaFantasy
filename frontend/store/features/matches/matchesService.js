import axios from "axios"
axios.defaults.withCredentials = true;

const create = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/matches/create` , data )
    return respone.data
}


const addToLinup = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/matches/linup/add` , data )
    return respone.data
}

const updateLinupPlayer = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/matches/linup/update` , data )
    return respone.data
}

const start = async (id)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/matches/start/${id}`)
    return respone.data
}


const getAllMatches = async ()=>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/matches`)
    return respone.data
}

const getMatchDetaills = async (id)=>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/matches/${id}`)
    return respone.data
}

const deletePlayerFromLinup = async (player_id , match_id)=>{
    const respone = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/matches/linup/delete` , {data : {player_id , match_id}})
    return respone.data
}

export const matchesService = { create , getAllMatches , getMatchDetaills , updateLinupPlayer , start , addToLinup , deletePlayerFromLinup}