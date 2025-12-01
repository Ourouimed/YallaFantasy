import axios from "axios"
axios.defaults.withCredentials = true;

const create = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/create` , data , {
        headers: { "Content-Type": "multipart/form-data" },
      })
    return respone.data
}

export const teamsService = { create }