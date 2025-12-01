"use client";
import { adminMenu } from "@/utils/links";
import Link from 'next/link'; 
import { usePathname } from 'next/navigation'; 

const NavItem = ({ name, url, icon: Icon }) => {
    const currentPath = usePathname(); 
    console.log(currentPath)

    return (
        <li key={name}>
            <Link href={url} className={`flex items-center gap-3 p-2 rounded-lg transition duration-300 text-black hover:bg-main ${url === currentPath && 'bg-main text-white'} hover:text-white font-semibold w-full text-sm`}>
                <Icon size={20} />
                <span>{name}</span>
            </Link>
        </li>
    );
};

export default function Sidebar() {
    return (
        <div className="h-full w-64 border-r border-gray-200 bg- flex flex-col justify-between p-4 shadow-lg">
            
            
            <div className="space-y-8"> 
                
                <div className="py-2">
                    <h3 className="font-bold text-3xl text-black">
                        Yalla<span className="text-third">Fantasy</span>
                    </h3>
                </div>

               
                <nav className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">Menu</p>
                    <ul className="space-y-1">
                        {adminMenu.map((item) => (
                            <NavItem key={item.name} {...item} />
                        ))}
                    </ul>
                </nav>
            </div>

        </div>
    );
}
