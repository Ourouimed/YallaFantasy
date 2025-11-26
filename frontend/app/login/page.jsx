"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Lock } from "lucide-react";
import GoogleIcon from "@/components/icons/google";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function LoginPage() {
  const [loginForm , setLoginForm] = useState({
    email : '' , 
    password : ''
  })
  const [validationErrors , setValidationErrors] = useState({})
  const { isLoading } = useSelector(state => state.auth)
  const handleChange =(e)=>{
      setLoginForm(prev => ({...prev , [e.target.id] : e.target.value}))
  }

  const validateForms = ()=>{
        const newErrors = {}
        if (!loginForm.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) newErrors.email = "Invalid email address";

        if (!loginForm.password.trim()) newErrors.password = "Password is required";
        setValidationErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    const handleLogin = ()=>{
      if (!validateForms()) return ;
    }
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="w-full max-w-md p-8 rounded-3xl border border-gray-300 space-y-8 z-10 bg-white">
        
        <div className="space-y-3 text-center">
          <h4 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome <span className="text-second">Back</span>
          </h4>
          <p className="text-gray-600 text-sm">
            Sign in to <span className="text-third font-medium">YallaFantasy</span> to manage your team for AFCON 2025.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-gray-700 uppercase">
                Email Address
              </label>
              <Input
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="coach@example.com"
                  onChange={handleChange}
                  value={loginForm.email}
                />
                {validationErrors?.email && <p className="text-red-600 text-sm">{validationErrors.email}</p>}
            </div>

            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-gray-700 uppercase">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-third hover:text-third/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
                <Input
                  icon={Lock}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  value={loginForm.password}
                />
                {validationErrors?.password && <p className="text-red-600 text-sm">{validationErrors.password}</p>}
            </div>


            <div className="space-y-4">
                <Button className={`w-full h-12 !bg-third text-black font-bold text-base ${isLoading && 'opacity-70'}`} disabled={isLoading} onClick={handleLogin}>
                    {isLoading? 'login in...' : 'Login'}
                </Button>        
                        
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">
                          Or continue with
                        </span>
                    </div>
                  </div> 
                        
                  <Button 
                    type="button"
                    className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition-all gap-2 shadow-sm"
                  >
                      <GoogleIcon/>
                    Sign up with Google
                  </Button>
            
                  
                        
            </div>
          </div>

        </div>


        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-third hover:text-third/80 font-semibold inline-flex items-center gap-1 transition-colors">
            Register Now
          </Link>
        </p>

      </div>
    </section>
  );
}