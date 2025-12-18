import axios from "axios"
axios.defaults.withCredentials = true;


const getTeam = async () =>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-team`)
    return respone.data
}



const getPickedTeam = async () =>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-team/pick-team`)
    return respone.data
}




const saveTeam = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/my-team/save` , data)
    return respone.data
}


const savePickedTeam = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/my-team/pick-team/save` , data)
    return respone.data
}




export const myTeamService = { getTeam , saveTeam , getPickedTeam , savePickedTeam}