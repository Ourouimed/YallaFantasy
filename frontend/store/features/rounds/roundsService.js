import axios from "axios"
axios.defaults.withCredentials = true;

const create = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/rounds/create` , data )
    return respone.data
}


const update = async (data)=>{
    const respone = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/rounds/update/${data.round_id}` , data)
    return respone.data
}


const getAllrounds= async ()=>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/rounds`)
    return respone.data
}

const deleteByid = async (id)=>{
    const respone = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/rounds/delete` , {data : {id}})
    return respone.data
}

export const roundsService = { create , getAllrounds , deleteByid , update}