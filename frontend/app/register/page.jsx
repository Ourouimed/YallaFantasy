"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Lock, User } from "lucide-react";
import GoogleIcon from "@/components/icons/google";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/features/auth/authSlice";

export default function RegisterPage() {
  const [registerForm , setRegisterForm] = useState({
      fullname : '',
      email : '',
      password : '',
      confirmPassword : ''
    })
    const [validationErrors , setValidationErrors] = useState({})
    const dispatch = useDispatch()
    const { isLoading } = useSelector(state => state.auth)
    const handleChange =(e)=>{
      setRegisterForm(prev => ({...prev , [e.target.id] : e.target.value}))
    }


    const validateForms = ()=>{
        const newErrors = {}
        if (!registerForm.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(registerForm.email)) newErrors.email = "Invalid email address";

        if (!registerForm.fullname.trim()) newErrors.fullname = "full name is required"
  
        if (!registerForm.password.trim()) newErrors.password = "Password is required";
        else if (registerForm.password.length < 6 || registerForm.password.length > 15) newErrors.password = "Password length must be between 6 and 15";
        if (registerForm.password !== registerForm.confirmPassword) newErrors.confirmPassword = "Passwords do not matches";

        setValidationErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleRegister = ()=>{
      if (!validateForms()) return ;
      dispatch(registerUser(registerForm))
    }

    
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4 py-8 relative overflow-hidden">
      
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 space-y-8 z-10">
        

        <div className="space-y-3 text-center">
          <h4 className="text-3xl font-bold tracking-tight text-white">
            Create an Account
          </h4>
          <p className="text-gray-300 text-sm">
            Join <span className="text-third font-medium">YallaFantasy</span> and start your AFCON 2025 journey today.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-medium text-gray-300 uppercase ml-1">
                Full Name
              </label>
              <Input
                  icon={User}
                  id="fullname"
                  type="text"
                  placeholder="John Doe"
                  onChange={handleChange}
                  value={registerForm.fullname}
                />
                  {validationErrors?.fullname && <p className="text-red-400 text-sm">{validationErrors.fullname}</p>}
            </div>


            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-gray-300 uppercase ml-1">
                Email Address
              </label>
              <Input
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="coach@example.com"
                  onChange={handleChange}
                  value={registerForm.email}
                />
                {validationErrors?.email && <p className="text-red-400 text-sm">{validationErrors.email}</p>}
            </div>


            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium text-gray-300 uppercase ml-1">
                Password
              </label>
                <Input
                  icon={Lock}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  value={registerForm.password}
                />
                {validationErrors?.password && <p className="text-red-400 text-sm">{validationErrors.password}</p>}
            </div>

             
             <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-300 uppercase ml-1">
                Confirm Password
              </label>
                <Input
                  icon={Lock}
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  value={registerForm.confirmPassword}
                />
                {validationErrors?.confirmPassword && <p className="text-red-400 text-sm">{validationErrors.confirmPassword}</p>}
            </div>
          </div>

          
          <div className="space-y-4">
            <Button className={`w-full h-12 !bg-third text-black font-bold text-base ${isLoading && 'opacity-70'}`} disabled={isLoading} onClick={handleRegister}>
              {isLoading? 'Creating...' : 'Create Account'}
            </Button>
            
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>

            
            <Button 
              type="button"
              className="w-full h-12 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all gap-2"
            >
              <GoogleIcon/>
              Sign up with Google
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-third hover:text-third/80 font-semibold inline-flex items-center gap-1 transition-colors">
            Sign In
          </Link>
        </p>

      </div>
    </section>
  );
}