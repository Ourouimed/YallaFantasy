import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
// Added User icon for the name field
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import GoogleIcon from "@/components/icons/google";

export default function RegisterPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-main text-white px-4 py-8 relative overflow-hidden">
      
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 space-y-8 z-10">
        
        {/* Header */}
        <div className="space-y-3 text-center">
          <h4 className="text-3xl font-bold tracking-tight text-white">
            Create an Account
          </h4>
          <p className="text-gray-300 text-sm">
            Join <span className="text-third font-medium">YallaFantasy</span> and start your AFCON 2025 journey today.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-medium text-gray-300 uppercase ml-1">
                Full Name
              </label>
              <Input
                  icon={User}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-gray-300 uppercase ml-1">
                Email Address
              </label>
              <Input
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="coach@example.com"
                />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium text-gray-300 uppercase ml-1">
                Password
              </label>
                {/* Note: Assuming you are using the fixed Input component that handles padding automatically based on the icon prop */}
                <Input
                  icon={Lock}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
            </div>

             {/* Confirm Password Field */}
             <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-300 uppercase ml-1">
                Confirm Password
              </label>
                <Input
                  icon={Lock}
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button className="w-full h-12 !bg-third text-black font-bold text-base">
              Create Account
            </Button>
            
            {/* Divider */}
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

            {/* Google Button */}
            <Button 
              type="button"
              className="w-full h-12 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all gap-2"
            >
              <GoogleIcon/>
              Sign up with Google
            </Button>
          </div>
        </div>

        {/* Footer Switch */}
        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-third hover:text-third/80 font-semibold inline-flex items-center gap-1 transition-colors">
            Sign In <ArrowRight className="w-3 h-3" />
          </Link>
        </p>

      </div>
    </section>
  );
}