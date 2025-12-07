import axios from "axios"

const getAllPlayers = async ()=>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/players`)
    return respone.data
}

const create = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/players/create` , data , {
        headers: { "Content-Type": "multipart/form-data" },
      })
    return respone.data
}


export const playersService = { getAllPlayers , create}