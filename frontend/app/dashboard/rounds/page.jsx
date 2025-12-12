"use client";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/table";
import { usePopup } from "@/hooks/usePopup";
import { getAllrounds } from "@/store/features/rounds/roundsSlice";
import { formatLocalTime } from "@/utils/formatDate";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RoundsPage (){
    const { openPopup } = usePopup()
    const { isLoading , rounds } = useSelector(state => state.rounds)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllrounds()).unwrap();
        console.log(rounds)
    }, []);

    

    const handleOpenEditPopup = (round)=>{
        openPopup({
            title: "Edit Round",
            component: "EditRoundPopup",
            props : {round}
        })
    }

    const handleOpenDeleteConfirmation = (id)=>{
        openPopup({
            title: "Delete Round",
            component: "DeleteRoundPopup",
            props : {id}
        })
    }
    return <DashboardLayout>
        <div className="space-y-7">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Rounds</h1>
                        <p className="text-gray-700">Manage AFCON2025 rounds</p>
                    </div>

                    <Button
                        onClick={() =>
                            openPopup({
                                title: "Add new Round",
                                component: "AddRoundPopup",
                            })
                        }
                        className="!bg-black text-white text-sm"
                    >
                        <Plus size={15} /> Add Round
                    </Button>
                </div>



                {/* Table */}
                <div>
                    {isLoading ? (
                        <p>...Loading Rounds</p>
                    ) : rounds?.length === 0 ? (
                        <p>No Rounds found</p>
                    ) : (
                        <Table
                            data={rounds}
                            columns={{
                                action: (_, row) => (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            className="!p-0"
                                            onClick={() => handleOpenEditPopup(row)}
                                        >
                                            <Edit size={18} />
                                        </Button>

                                        <Button
                                            className="!p-0 !text-red-500"
                                            onClick={() =>
                                                handleOpenDeleteConfirmation(row.round_id)
                                            }
                                        >
                                            <Trash size={18} />
                                        </Button>
                                    </div>
                                ),
                                round_deadline : (val)=>{
                                    return formatLocalTime(val)
                                }
                            }}
                        />
                    )}
                </div>
        </div>

    </DashboardLayout>
}