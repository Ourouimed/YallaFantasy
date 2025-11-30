import Sidebar from "./sidebar";

export default function DashboardLayout ({ children }){
    return <div className="grid grid-cols-[2fr_8fr] h-screen">
        <Sidebar/>
        <div className="flex-1 p-4">
            {children}
        </div>
    </div>
}