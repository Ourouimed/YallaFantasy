import axios from "axios"
axios.defaults.withCredentials = true;


const getTeam = async (round_id)=>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-team` , {round_id})
    return respone.data
}


export const myTeamService = { getTeam }