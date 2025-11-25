"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Lock } from "lucide-react";
import GoogleIcon from "@/components/icons/google";
import { useState } from "react";

export default function LoginPage() {
  const [loginForm , setLoginForm] = useState({
    
  })
  return (
    <section className="min-h-screen flex items-center justify-center bg-main text-white px-4 py-8 relative overflow-hidden">
    
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 space-y-8 z-10">
        
        <div className="space-y-3 text-center">
          <h4 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h4>
          <p className="text-gray-300 text-sm">
            Sign in to <span className="text-third font-medium">YallaFantasy</span> to manage your team for AFCON 2025.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-gray-300 uppercase">
                Email Address
              </label>
              <Input
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="coach@example.com"
                  
                />
            </div>

            
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-xs font-medium text-gray-300 uppercase">
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
                  className="pl-10 bg-black/20 border-white/10 focus:border-third/50 focus:ring-third/20 h-12"
                />
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full !bg-third text-black">
              Sign In
            </Button>
            
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-main px-2 text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              type="button"
              className="w-full h-12 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all"
            >
              
              <GoogleIcon/>
              Google
            </Button>
          </div>
        </div>

        
        <p className="text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <Link href="/register" className="text-third hover:text-third/80 font-semibold inline-flex items-center gap-1 transition-colors">
            Register Now
          </Link>
        </p>

      </div>
    </section>
  );
}