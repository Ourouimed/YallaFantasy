import axios from "axios"

const getSettings = async ()=>{
    const respone = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`)
    return respone.data
}

const saveSettings = async (data)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/save` , data)
    return respone.data
}

export const settingsService = { getSettings , saveSettings}