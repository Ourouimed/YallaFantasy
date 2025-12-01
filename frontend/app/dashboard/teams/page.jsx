"use client";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import { Button } from "@/components/ui/Button";
import { usePopup } from "@/hooks/usePopup";
import { Plus } from "lucide-react";

export default function TeamsPage(){
    const { openPopup } = usePopup()
    return <DashboardLayout>
        <div className="space-y-7">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">National teams</h1>
                    <p className="text-gray-700">Manage AFCON2025 teams</p>
                </div>
                <Button 
                    onClick={()=> openPopup({title : 'Add new national team' , component : 'AddTeamPopup' })}
                    className='!bg-black text-white text-sm'><Plus size={15}/> Add Team</Button>
            </div>

            <div>

            </div>
        </div>
    </DashboardLayout>
}