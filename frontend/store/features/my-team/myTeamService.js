import axios from "axios"
axios.defaults.withCredentials = true;


const getTeam = async (id)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/my-team`)
    return respone.data
}


export const myTeamService = { getTeam }