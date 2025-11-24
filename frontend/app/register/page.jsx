import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-main text-white px-4 py-8">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 space-y-6">
        
        <div className="space-y-2 text-center">
          <h4 className="text-3xl font-bold">Create Account</h4>
          <p className="text-gray-300 text-sm">
            Sign up to start your YallaFantasy AFCON 2025 journey
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm text-gray-200">Username</label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
            />
          </div>


          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-200">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-200">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm text-gray-200">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <Button className="w-full !bg-third text-black font-semibold">
          Register
        </Button>
      </div>
    </section>
  );
}
