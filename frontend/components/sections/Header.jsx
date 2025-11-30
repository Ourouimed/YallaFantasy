"use client";
import { useState } from "react";
import { menu } from "@/utils/links";
import { Button } from "../ui/Button";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/features/auth/authSlice";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()


  const handleLogout = ()=>{
    dispatch(logout())
  }

  return (
    <header className="fixed z-20 w-full top-0 bg-main backdrop-blur-lg py-4 px-6 md:px-20 text-white flex justify-between items-center">
      
      <div className="flex items-center gap-6">
        <h3 className="text-xl font-bold">
          Yalla<span className="text-third">Fantasy</span>
        </h3>

        <ul className="hidden md:flex gap-7 items-center">
          {menu.map(({ url, name }) => (
            <li key={url}>
              <a
                href={url}
                className="text-md font-semibold transition duration-300 hover:text-third"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>

     
      <div className="hidden md:flex items-center">
        {!user ? (
          <Button isLink href="/login">Get Started</Button>
        ) : (
          <div className="relative">
            <Image
              src={"/assets/images/avatar.webp"}
              width={40}
              height={40}
              alt="user"
              className="rounded-full cursor-pointer"
              onClick={() => setDropdown(!dropdown)}
            />

            {dropdown && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-xl py-2 w-40 shadow-lg">
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </a>
                <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </a>
                <Button className="text-red-500 hover:bg-gray-100 w-full justify-start"
                        onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <button className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-main/95 backdrop-blur-lg py-6 px-6 flex flex-col gap-4">
          {menu.map(({ url, name }) => (
            <a
              key={url}
              href={url}
              className="text-lg font-semibold hover:text-third transition"
            >
              {name}
            </a>
          ))}

          {!user ? (
            <Button isBtn href="/login" className="mt-2">
              Get Started
            </Button>
          ) : (
            <div className="mt-3">
              <a href="/profile" className="block py-2">Profile</a>
              <a href="/dashboard" className="block py-2">Dashboard</a>
              <button className="block py-2 text-left w-full">Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
