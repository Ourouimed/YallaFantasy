import { getAllPlayers } from "@/store/features/players/playersSlice";
import { getAllrounds } from "@/store/features/rounds/roundsSlice";
import { getAllTeams } from "@/store/features/teams/teamsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useToast } from "@/hooks/useToast";
import { usePopup } from "@/hooks/usePopup";
import { createMatch } from "@/store/features/matches/matchesSlice";

export default function AddMatchPopup (){
    const { teams } = useSelector((state) => state.teams);
    const { rounds } = useSelector((state) => state.rounds);
    const teamsLoading = useSelector((state) => state.teams.isLoading)
    const roundLoading = useSelector((state) => state.rounds.isLoading)
    const { isLoading } = useSelector(state => state.matches)
     const toast = useToast();
    const { closePopup } = usePopup()
    const [validationErrors, setValidationErrors] = useState({});

    const dispatch = useDispatch()
    const [ match , setMatch] = useState({
        home_team : '',
        away_team : '',
        match_time : "" ,
        match_round : ""
    })


    const homeTeamOption = teams.filter(team => team.team_id != match.away_team)
    .map(team => ({
        value: team.team_id,
        label: team.team_name
    }));


    const awayTeamOption = teams.filter(team => team.team_id != match.home_team)
    .map(team => ({
        value: team.team_id,
        label: team.team_name
    }));


    const roundOptions = rounds.map(round => ({
        value: round.round_id,
        label: round.round_title
    }));
    

    useEffect(() => {
        dispatch(getAllTeams()).unwrap();
        console.log(teams)
    }, []);


    useEffect(() => {
        dispatch(getAllrounds()).unwrap();
        console.log(rounds)
    }, []);


    const handleHomeTeamChange = (value) => {
        setMatch(prev => ({ ...prev, home_team: value }));
    };


    const handleAwayTeamChange = (value) => {
        setMatch(prev => ({ ...prev, away_team: value }));
    };

    const handleRoundChange = (value) => {
        setMatch(prev => ({ ...prev, match_round: value }));
    };

    const validateForm = () => {
        const errors = {};

        if (!match.home_team) errors.home_team = "Home team is required";
        if (!match.away_team) errors.away_team = "Away team is required";
        if (!match.match_time.trim()) errors.match_time = "Match time is required";
        if (!match.match_round) errors.match_round = "Round is required";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateMatch = async ()=>{
        if (!validateForm()) return

         try {
            await dispatch(createMatch(match)).unwrap()
            toast.success('Match created successfully')
            closePopup()
        }
        catch (err) {
            toast.error(err)
        }
    }
    return <div className="space-y-4">
        {/* Home Team Select */}
        <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Home
                </label>
        
                <Select
                  name='home_team'
                  options={homeTeamOption}
                  value={match.home_team}
                  onChange={handleHomeTeamChange}
                  placeholder="Select home team"
                />
        
                {validationErrors.home_team && (
                  <p className="text-red-600 text-sm">{validationErrors.home_team}</p>
                )}
        </div>


        {/* Away Team Select */}
        <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Away
                </label>
        
                <Select
                  name='away_team'
                  options={awayTeamOption}
                  value={match.away_team}
                  onChange={handleAwayTeamChange}
                  placeholder="Select away team"
                />
        
                {validationErrors.away_team && (
                  <p className="text-red-600 text-sm">{validationErrors.away_team}</p>
                )}
        </div>

        {/* Round Select */}
        <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Round
                </label>
        
                <Select
                  name='round'
                  options={roundOptions}
                  value={match.match_round}
                  onChange={handleRoundChange}
                  placeholder="Select round"
                />
        
                {validationErrors.match_round && (
                  <p className="text-red-600 text-sm">{validationErrors.match_round}</p>
                )}
        </div>


        {/* Match time Select */}
        <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  Match time
                </label>
        
                <Input
                    type='datetime-local'
                    name="match_time"
                    value={match.match_time}
                    onChange={(e)=> {
                        setMatch(prev => ({...prev , match_time : e.target.value}))
                    }}
                />
        
                {validationErrors.match_time && (
                  <p className="text-red-600 text-sm">{validationErrors.match_time}</p>
                )}
        </div>


        <div className="flex justify-end">
            <Button
                disabled={isLoading}
                onClick={handleCreateMatch}
                className={`!bg-black text-white ${isLoading && "opacity-70"}`}
            >
                {isLoading ? "Creating..." : "Create Match"}
            </Button>
        </div>
    </div>
}