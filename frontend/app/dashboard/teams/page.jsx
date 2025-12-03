"use client";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/table";
import { usePopup } from "@/hooks/usePopup";
import { getAllTeams } from "@/store/features/teams/teamsSlice";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TeamsPage(){
    const { openPopup } = usePopup()
    const dispatch = useDispatch()
    const { isLoading , teams } = useSelector(state => state.teams)
    useEffect(() => {
        const fetchTeams = async () => {
            await dispatch(getAllTeams()).unwrap();
        };

        fetchTeams();
    }, []); 


    const handleOpenDeleteConfirmation = async (id)=>{
        openPopup({title : 'Delete team' , component : 'DeleteTeamPopup' , props : {id}})
    }

    const handleOpenEditPopup = async (team)=>{
        openPopup({title : 'Edit Team' , component : 'EditTeamPopup', props : {team}})
    }
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
                {isLoading ? (
                    <p>...Loading teams</p>
                ) : teams?.length === 0 ? (
                    <p>No teams found</p>
                ) : (
                    <Table 
                        data={teams}
                        columns={{
                            flag: (value) => <img src={value} className="w-9 h-6 rounded" />,
                            action : (_ , row)=> <div className="flex items-center gap-2">
                                <Button className='!p-0' onClick={() => handleOpenEditPopup(row)}>
                                    <Edit size={18}/>
                                </Button>  

                                <Button className='!p-0 !text-red-500' onClick={() => handleOpenDeleteConfirmation(row.team_id)}>
                                    <Trash size={18}/>
                                </Button>  
                            </div>
                        }}
                    />

                )}
            </div>
        </div>
    </DashboardLayout>
}