import { menu } from "@/utils/links";
import { Button } from "../ui/Button";

export default function Header (){
    return <header className="fixed z-20 w-full top-0 bg-black/20 backdrop-blur-lg py-4 px-20 text-white flex justify-between gap-3 items-center">
        <div className="flex justify-between gap-6 items-center">
            <h3 className="text-xl">
                Yalla<span className="text-third">Fantasy</span>
            </h3>

            <ul className="flex justify-between gap-7 items-center">
                {menu.map(({url , name})=> <li key={url}>
                    <a href={url} className="text-md font-semibold 
                                            transition duration-300
                                            hover:text-third">{name}</a>
                </li>)}
            </ul>

        </div>
        
        <Button className="">Get started</Button>
    </header>
}