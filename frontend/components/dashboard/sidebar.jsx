// Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminMenu } from "@/utils/links";

const NavItem = ({ name, url, icon: Icon }) => {
  const currentPath = usePathname();
  return (
    <li>
      <Link
        href={url}
        className={`flex items-center gap-3 p-2 rounded-lg transition duration-300 text-black hover:bg-main ${
          url === currentPath ? "bg-main text-white" : "hover:text-white"
        } font-semibold w-full text-sm`}
      >
        <Icon size={20} color={'currentColor'}/>
        <span>{name}</span>
      </Link>
    </li>
  );
};

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
     
      <div
        className={`fixed inset-0 bg-black/70 z-30 transition-opacity md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col md:justify-between
        `}
      >
        <div className="space-y-8 p-4">
          <div className="py-2">
            <h3 className="font-bold text-3xl text-black">
              Yalla<span className="text-third">Fantasy</span>
            </h3>
          </div>

          <nav className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">
              Menu
            </p>
            <ul className="space-y-1">
              {adminMenu.map((item) => (
                <NavItem key={item.name} {...item} />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
