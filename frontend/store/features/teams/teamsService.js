import axios from "axios"
axios.defaults.withCredentials = true;

const create = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/create` , data , {
        headers: { "Content-Type": "multipart/form-data" },
      })
    return respone.data
}

const update = async (id , data)=>{
    const respone = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/update/${id}` , data , {
        headers: { "Content-Type": "multipart/form-data" },
      })
    return respone.data
}


const getAllteams = async ()=>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`)
    return respone.data
}


const deleteByid = async (id)=>{
    const respone = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/delete` , {data : {id}})
    return respone.data
}

export const teamsService = { create , update , getAllteams , deleteByid}