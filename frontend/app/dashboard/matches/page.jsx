"use client"
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import MatchCard from "@/components/ui/cards/MatchCard";
import Table from "@/components/ui/table";
import { usePopup } from "@/hooks/usePopup";
import { getAllMatches } from "@/store/features/matches/matchesSlice";
import { formatLocalTime } from "@/utils/formatDate";
import { Plus, Settings } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function MatchesPage (){
    const { openPopup } = usePopup()
    const { isLoading , matches } = useSelector(state => state.matches)
    const dispatch = useDispatch()
    const handleOpenAddPopup = ()=>{
        openPopup({
            title: "Add match",
            component: "AddMatchPopup",
        })
    }

    useEffect(() => {
        dispatch(getAllMatches()).unwrap();
    }, []);
    return <DashboardLayout>
        <div className="space-y-7">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Matches</h1>
                        <p className="text-gray-700">Manage AFCON2025 matches</p>
                    </div>

                    <Button
                        onClick={handleOpenAddPopup}
                        className="!bg-black text-white text-sm"
                    >
                        <Plus size={15} /> Create Match
                    </Button>
                </div>


                {/* Matches */}
                <div>
                    {isLoading ? (
                        <p>...Loading matches</p>
                    ) : matches?.length === 0 ? (
                        <p>No Matches found</p>
                    ) : 
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {matches.map(match => <MatchCard 
                                    key={match.match_id} 
                                    match={match}
                            />)}
                        </div>
                    }
                </div>

            </div>
    </DashboardLayout>
}