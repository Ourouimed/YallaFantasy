import { getAllPlayers } from "@/store/features/players/playersSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Switch from "../ui/Switch";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { addToLinup, getMatchDetaills } from "@/store/features/matches/matchesSlice";
import { usePopup } from "@/hooks/usePopup";

export default function AddPlayerToLinupPopup({ team_id , matchId , team_side}) {
  const [playerData, setPlayerData] = useState({
    player_id: "",
    red_card: 0,
    yellow_cards: 0,
    assists: 0,
    goals: 0,
    pen_saves: 0,
    pen_missed: 0,
    min_played: 0,
    own_goals: 0,
    gk_save : 0 ,
    conceded_goal : 0 ,
    clean_sheets: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const toast = useToast()
  const { closePopup } = usePopup()
  const { players } = useSelector((state) => state.players);
  const { isLoading , currMatch} = useSelector(state => state.matches)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPlayers()).unwrap();
  }, []);

  useEffect(() => {
    dispatch(getMatchDetaills(matchId)).unwrap();
  }, []);



  const lineupPlayerIds = currMatch.linups[team_side].map(
  (l) => l.player_id
);

const playersToSelect = players
  .filter(
    (p) =>
      p.team_id === team_id &&
      !lineupPlayerIds.includes(p.player_id)
  )
  .map((p) => ({
    value: p.player_id,
    label: p.fullname,
  }));

  const handlePlayerChange = (value) => {
    setPlayerData((prev) => ({ ...prev, player_id: value }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlayerData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const validateForm = () => {
          const errors = {};
  
          if (!playerData.player_id) errors.player_id = "Player is is required";
          if (playerData.red_card > 1 || playerData.red_card < 0) errors.red_card = "Can only have one red card";
          if (playerData.yellow_cards > 2 || playerData.yellow_cards < 0) errors.yellow_cards = "Cannot have more than two yellow card";
          if (playerData.goals < 0) errors.goals = "Unvalid data";
          if (playerData.own_goals < 0) errors.own_goals = "Unvalid data";
          if (playerData.assists < 0) errors.assists = "Unvalid data";
          if (playerData.pen_saves < 0) errors.pen_saves = "Unvalid data";
          if (playerData.pen_missed < 0) errors.pen_missed = "Unvalid data";
          if (playerData.min_played < 0 ) errors.min_played = "Unvalid data";
          if (playerData.gk_save < 0 ) errors.gk_save = "Unvalid data";
          if (playerData.conceded_goal < 0 ) errors.conceded_goal = "Unvalid data";
          
  
          setValidationErrors(errors);
          return Object.keys(errors).length === 0;
      };
  
      const handleAddPlayer = async ()=>{
          if (!validateForm()) return
  
           try {
              console.log(matchId)
              await dispatch(addToLinup({match_id : matchId, team_id , team_side , ...playerData})).unwrap()
              toast.success('Player added successfully')
              closePopup()
          }
          catch (err) {
              console.log(err)
              toast.error(err)
          }
      }
  return (
    <div className="space-y-4">
      {/* Player Select */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Player
        </label>

        <Select
          options={playersToSelect}
          onChange={handlePlayerChange}
          value={playerData.player_id}
          name="player"
          placeholder="Select player"
        />

        {validationErrors.player_id && (
          <p className="text-red-600 text-sm">{validationErrors.player_id}</p>
        )}
      </div>

      <h3 className="font-semibold text-gray-700">Match Stats</h3>
      <div className="grid grid-cols-4 gap-2">
        {/* Goals */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Goals</label>
          <Input
            type="number"
            name="goals"
            placeholder="Enter goals"
            value={playerData.goals}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.goals && (
            <p className="text-red-600 text-sm">{validationErrors.goals}</p>
          )}
        </div>

        {/* Assists */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Assists</label>
          <Input
            type="number"
            name="assists"
            placeholder="Enter assists"
            value={playerData.assists}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.assists && (
            <p className="text-red-600 text-sm">{validationErrors.assists}</p>
          )}
        </div>

        {/* Yellow Cards */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Yellow Cards</label>
          <Input
            type="number"
            name="yellow_cards"
            placeholder="Enter yellow cards"
            value={playerData.yellow_cards}
            onChange={handleChange}
            min={0}
            max={2}
          />
          {validationErrors.yellow_cards && (
            <p className="text-red-600 text-sm">{validationErrors.yellow_cards}</p>
          )}
        </div>

        {/* Red Cards */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Red Cards</label>
          <Input
            type="number"
            name="red_card"
            placeholder="Enter red cards"
            value={playerData.red_card}
            onChange={handleChange}
            min={0}
            max={1}
          />
          {validationErrors.red_card && (
            <p className="text-red-600 text-sm">{validationErrors.red_card}</p>
          )}
        </div>

        {/* Minutes Played */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Minutes Played</label>
          <Input
            type="number"
            name="min_played"
            placeholder="Enter minutes"
            value={playerData.min_played}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.min_played && (
            <p className="text-red-600 text-sm">{validationErrors.min_played}</p>
          )}
        </div>

        {/* Penalty Saves */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Penalty Saves</label>
          <Input
            type="number"
            name="pen_saves"
            placeholder="Enter penalty saves"
            value={playerData.pen_saves}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.pen_saves && (
            <p className="text-red-600 text-sm">{validationErrors.pen_saves}</p>
          )}
        </div>

        {/* Penalty Missed */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Penalty Missed</label>
          <Input
            type="number"
            name="pen_missed"
            placeholder="Enter penalty missed"
            value={playerData.pen_missed}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.pen_missed && (
            <p className="text-red-600 text-sm">{validationErrors.pen_missed}</p>
          )}
        </div>

        {/* Goal  Saves */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Own Goals</label>
          <Input
            type="number"
            name="own_goals"
            placeholder="Enter own goals"
            value={playerData.own_goals}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.own_goals && (
            <p className="text-red-600 text-sm">{validationErrors.own_goals}</p>
          )}
        </div>

          {/* Goal  Saves */}
         <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Goal saves</label>
          <Input
            type="number"
            name="gk_save"
            placeholder="Enter own goals"
            value={playerData.gk_save}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.gk_save && (
            <p className="text-red-600 text-sm">{validationErrors.gk_save}</p>
          )}
        </div>


         {/* conceded goals */}
         <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">conceded goals</label>
          <Input
            type="number"
            name="conceded_goal"
            placeholder="Enter own goals"
            value={playerData.conceded_goal}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.conceded_goal && (
            <p className="text-red-600 text-sm">{validationErrors.conceded_goal}</p>
          )}
        </div>

        {/* Clean Sheets */}
        <div className="space-y-2 col-span-1">
          <Switch
            checked={playerData.clean_sheets}
            onChange={(value) =>
              setPlayerData((prev) => ({ ...prev, clean_sheets: value }))
            }
            label="Clean Sheet"
          />
          {validationErrors.clean_sheets && (
            <p className="text-red-600 text-sm">{validationErrors.clean_sheets}</p>
          )}
        </div>
      </div>


      <div className="flex justify-end">
                  <Button
                      disabled={isLoading}
                      onClick={handleAddPlayer}
                      className={`!bg-black text-white ${isLoading && "opacity-70"}`}
                  >
                        <Plus/>
                      {isLoading ? "Adding..." : "Add Player"}
                  </Button>
              </div>
    </div>
  );
}
