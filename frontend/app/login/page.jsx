import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-main text-white px-4 py-8">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 space-y-6">
        
        <div className="space-y-2 text-center">
          <h4 className="text-3xl font-bold">Welcome Back</h4>
          <p className="text-gray-300 text-sm">
            Sign in to your YallaFantasy account to continue your AFCON 2025 journey
          </p>
        </div>

        <div className="space-y-5">
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-200">Email</label>
            <Input id="email"
              type="email"
              placeholder="Enter your email"/>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-200">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Button */}
        <Button className="w-full !bg-third text-black font-semibold">
          Login
        </Button>
      </div>
    </section>
  );
}
