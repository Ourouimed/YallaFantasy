"use client";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LinupPlayerCard from "@/components/ui/LinupPlayerCard";
import { usePopup } from "@/hooks/usePopup";
import { useToast } from "@/hooks/useToast";
import { getMatchDetaills, startMatch } from "@/store/features/matches/matchesSlice";
import { formatLocalTime } from "@/utils/formatDate";
import { Calendar, Play, Plus, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MatchCenter(){

    const { matchId } = useParams()
    const { currMatch , isLoading} = useSelector(state => state.matches)
    const [showedLinup , setShowedLinup] = useState('home')
    const { openPopup } = usePopup()
    const toast = useToast()
    const dispatch = useDispatch()
    useEffect(() => {
            dispatch(getMatchDetaills(matchId)).unwrap();
    }, []);


    const matchTime = new Date(currMatch?.match?.match_time);
    const now = new Date();
    const canStartMatch = now > matchTime;

    const handleChangeLinup = ()=>{
        if (showedLinup === 'home') setShowedLinup('away')
        else if (showedLinup === 'away') setShowedLinup('home')
    }
    const handleStartMatch = async ()=>{
        try {
            await dispatch(startMatch(matchId)).unwrap()
            toast.success('Match started successfully')
        }
        catch (err) {
            toast.error(err)
        }
    }

    const handleOpenAddPlayerToLinupPopup = ()=>{
        let team_id 
        if (showedLinup === 'home')
            team_id = currMatch?.match?.home_team
        if (showedLinup === 'away')
            team_id = currMatch?.match?.away_team
        openPopup({
            title : 'Add player to linup' , 
            component : 'AddPlayerToLinupPopup',
            props : { team_id , matchId , team_side : showedLinup}
        })
    }

    
    if (!currMatch?.match) return <p>Match unfound</p>
    return <DashboardLayout>
        <div className="space-y-5">
            <div className="py-3 space-y-3 border border-gray-300 rounded-md">
                <div className="flex items-center justify-between px-4">
                    <h4>
                        {currMatch?.match?.round}
                    </h4>
                    <Badge text={currMatch?.match?.match_status} type={currMatch?.match?.match_status}/> 
                </div>


                <div className="flex items-center justify-between px-4">
                    <div className="space-y-2">
                        <img src={currMatch?.match.home_team_flag} alt={currMatch?.match.home_team} className="size-25 rounded-full p-1 border-1" />
                        <p className="text-center">{currMatch?.match.home_name}</p>
                    </div>
                    <div>
                        {currMatch?.match?.match_status?.toUpperCase() === 'UPCOMING' ? <span className="font-semibold text-3xl">VS</span> : <div className="flex items-center gap-4">
                                    <span className="font-semibold text-5xl">
                                        {currMatch?.match.home_score}
                                    </span>
                                    <span className="font-semibold text-4xl text-gray-800">
                                        -
                                    </span>
                                    <span className="font-semibold text-5xl">
                                        {currMatch?.match.away_score}
                                    </span>
                                </div>}
                    </div>
                    <div className="space-y-2">
                        <img src={currMatch?.match.away_team_flag} alt={currMatch?.match.away_team} className="size-25 rounded-full p-1 border-1" />
                        <p className="text-center">{currMatch?.match.away_name}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between px-4 pt-3 border-t border-gray-300">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-gray-700"/> 
                        <span className="text-xs text-gray-700">
                            {formatLocalTime(currMatch?.match?.match_time)}
                        </span>
                    </div>

                    {canStartMatch && <Button
                        className={`!text-white !bg-black text-xs !p-2 ${isLoading && "opacity-70"}`}
                        onClick={handleStartMatch}
                        disabled={isLoading}>
                        <Play size={12}/>
                    {isLoading ? 'Starting...' : 'Start Match'}</Button>}
                </div>
            </div>


            <div className="py-3 space-y-3 border border-gray-300 rounded-md">
                <div className="flex items-center justify-between px-4 border-b border-gray-300 pb-3">
                    <h4 className="font-semibold text-xl">Linups</h4>
                    <div className="flex items-center gap-2">
                        <Button className={`${showedLinup === 'home' ? '!text-white !bg-black' : 'border border-1'} text-xs !p-2`} onClick={handleChangeLinup}>{currMatch?.match.home_name} </Button>
                        <Button className={`${showedLinup === 'away' ? '!text-white !bg-black' : 'border border-1'} text-xs !p-2`} onClick={handleChangeLinup}>{currMatch?.match.away_name}</Button>
                    </div>
                </div>
                <div className="pb-3 px-4">
                    {!currMatch?.linups?.[showedLinup] || Object.keys(currMatch.linups[showedLinup]).length === 0
                        ? <p className="flex justify-center flex-col items-center gap-3">
                            <Users size={50}/>
                            <span className="text-sm text-gray-500">
                                No players added yet 
                            </span>
                            <Button onClick={handleOpenAddPlayerToLinupPopup} className='!bg-second text-white text-sm !p-2'>Add new Player <Plus/></Button>
                        </p>
                        : <div className="space-y-4">
                                <div className="grid gap-3">
                                    {currMatch.linups[showedLinup].map(player => (
                                        <LinupPlayerCard
                                            key={player.player_id}
                                            player={player}
                                            team_side={showedLinup}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleOpenAddPlayerToLinupPopup} className='!bg-second text-white text-sm !p-2'>Add new Player <Plus/></Button>
                                </div>
                        </div>}

                </div>
            </div>
        </div>
    </DashboardLayout>
}