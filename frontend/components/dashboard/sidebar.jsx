import { adminMenu } from "@/utils/links";
import { Button } from "../ui/Button";

export default function Sidebar(){
    return <>
        <div className="h-full border-r border-gray-300 flex flex-col justify-between p-4">
            <div className="space-y-4">
                <h3 className="font-semibold text-2xl">Yalla<span className="text-main">Fantasy</span></h3>
                <nav>
                    <ul className="space-y-1">
                        {adminMenu.map(({name , url , icon : Icon}) => <li key={name}>
                            <Button isLink href={url} className='text-sm justify-start w-full !bg-black text-white'><Icon size={22}/> {name}</Button>
                        </li>)}
                    </ul>
                </nav>
            </div>
        </div>
    </>
}