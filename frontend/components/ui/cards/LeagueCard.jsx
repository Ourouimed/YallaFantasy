import { ExternalLink, Users } from "lucide-react";
import Button from "../Button";

export default function LeagueCard ({league}){
    return <div
                key={league.id_league}
                className="flex items-center justify-between p-4 border border-gray-300 rounded-xl hover:shadow-sm transition">
                <div>
                    <h4 className="font-semibold text-lg">{league.league_name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users size={16} />
                        {league.members_count} members
                    </div>
                </div>
                        
                <Button className="text-sm" isLink href={`./leagues/${league.id_league}`}>
                    <ExternalLink/>
                </Button>
            </div>
}