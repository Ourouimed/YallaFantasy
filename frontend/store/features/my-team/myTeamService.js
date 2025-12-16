import axios from "axios"
axios.defaults.withCredentials = true;


const getTeam = async (round_id)=>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-team` , {round_id})
    return respone.data
}




const saveTeam = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/my-team/save` , data)
    return respone.data
}


export const myTeamService = { getTeam , saveTeam}