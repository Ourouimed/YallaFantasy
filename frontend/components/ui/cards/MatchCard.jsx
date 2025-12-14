import { Calendar, Settings } from "lucide-react";
import Badge from "../Badge";
import { formatLocalTime } from "@/utils/formatDate";
import Button from "../Button";

export default function MatchCard({match}){
    console.log(match)
    return <div className="py-3 space-y-3 border border-gray-300 rounded-md">
        <div className="flex items-center justify-between px-4">
            <h4>
                {match?.round}
            </h4>
            <Badge text={match?.match_status} type={match?.match_status}/> 
        </div>


        <div className="flex items-center justify-between px-4">
            <div className="space-y-2">
                <img src={match.home_team_flag} alt={match.home_team} className="size-15 rounded-full p-1 border-1" />
                <p className="text-center">{match.home_team}</p>
            </div>
            <div>
                {match?.match_status.toUpperCase() === 'UPCOMING' ? <span className="font-semibold text-md">VS</span> : match.home_score + "-" + match.away_score}
            </div>
            <div className="space-y-2">
                 <img src={match.away_team_flag} alt={match.away_team} className="size-15 rounded-full p-1 border-1" />
                  <p className="text-center">{match.away_team}</p>
            </div>
        </div>

        <div className="flex items-center justify-between px-4 pt-3 border-t border-gray-300">
            <div className="flex items-center gap-1">
                <Calendar size={12} className="text-gray-700"/> 
                <span className="text-xs text-gray-700">
                    {formatLocalTime(match?.match_time)}
                </span>
            </div>

            <Button 
                className='!text-white !bg-black text-xs !p-2'
                isLink 
                href={`/dashboard/matches/${match.match_id}`}><Settings size={12}/> Manage match</Button>
        </div>
    </div>
}