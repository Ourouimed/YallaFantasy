import axios from "axios"

const register = async (data) => {
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register` , data)
    return respone.data
}


const login = async (data) => {
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login` , data)
    return respone.data
}

const verifyEmail = async (id)=>{
    const respone = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?id=${id}`)
    return respone.data
}


const authService = { register , login , verifyEmail}
export default authService