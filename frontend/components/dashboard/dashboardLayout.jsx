"use client";
import { useState } from "react";
import Sidebar from "./sidebar";
import Button from "../ui/Button";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 p-4 overflow-auto">
        <Button
          className="md:hidden mb-4 p-1 aspect-square flex items-center justify-center !bg-main text-white rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={12} /> : <Menu size={12} />}
        </Button>

        {children}
      </div>
    </div>
  );
}
