import { getAllPlayers } from "@/store/features/players/playersSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Switch from "../ui/Switch";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { usePopup } from "@/hooks/usePopup";
import { updateLinupPlayer } from "@/store/features/matches/matchesSlice";

export default function EditPlayerLinupPopup({player , team_side}) {
  const [playerDataToEdit, setPlayerToEdit] = useState({
    player_id: player.player_id,
    red_card: player.red_card ,
    yellow_cards: player.yellow_cards,
    assists: player.assists,
    goals: player.goals,
    pen_saves: player.pen_saves,
    pen_missed: player.pen_missed,
    min_played: player.min_played,
    own_goals: player.own_goals,
    clean_sheets: player.clean_sheets,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const toast = useToast()
  const { closePopup } = usePopup()
  const { isLoading } = useSelector(state => state.matches)
  const dispatch = useDispatch();


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlayerToEdit((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const validateForm = () => {
          const errors = {};
  
          if (!playerDataToEdit.player_id) errors.player_id = "Player is is required";
          if (playerDataToEdit.red_card > 1 || playerDataToEdit.red_card < 0) errors.red_card = "Can only have one red card";
          if (playerDataToEdit.yellow_cards > 2 || playerDataToEdit.yellow_cards < 0) errors.yellow_cards = "Cannot have more than two yellow card";
          if (playerDataToEdit.goals < 0) errors.goals = "Unvalid data";
          if (playerDataToEdit.own_goals < 0) errors.own_goals = "Unvalid data";
          if (playerDataToEdit.assists < 0) errors.assists = "Unvalid data";
          if (playerDataToEdit.pen_saves < 0) errors.pen_saves = "Unvalid data";
          if (playerDataToEdit.pen_missed < 0) errors.pen_missed = "Unvalid data";
          if (playerDataToEdit.min_played < 0 ) errors.min_played = "Unvalid data";
          
  
          setValidationErrors(errors);
          return Object.keys(errors).length === 0;
      };
  
      const handleUpdatePlayer = async ()=>{
          if (!validateForm()) return
  
           try {
              await dispatch(updateLinupPlayer({match_id : player.match_id , team_id : player.team_id , team_side , ...playerDataToEdit})).unwrap()
              toast.success('Player update successfully')
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

        <Input
          value={player.fullname}
          name="player"
          readOnly
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
            value={playerDataToEdit.goals}
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
            value={playerDataToEdit.assists}
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
            value={playerDataToEdit.yellow_cards}
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
            value={playerDataToEdit.red_card}
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
            value={playerDataToEdit.min_played}
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
            value={playerDataToEdit.pen_saves}
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
            value={playerDataToEdit.pen_missed}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.pen_missed && (
            <p className="text-red-600 text-sm">{validationErrors.pen_missed}</p>
          )}
        </div>

        {/* Own Goals */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 uppercase">Own Goals</label>
          <Input
            type="number"
            name="own_goals"
            placeholder="Enter own goals"
            value={playerDataToEdit.own_goals}
            onChange={handleChange}
            min={0}
          />
          {validationErrors.own_goals && (
            <p className="text-red-600 text-sm">{validationErrors.own_goals}</p>
          )}
        </div>

        {/* Clean Sheets */}
        <div className="space-y-2 col-span-1">
          <Switch
            checked={playerDataToEdit.clean_sheets}
            onChange={(value) =>
              setPlayerToEdit((prev) => ({ ...prev, clean_sheets: value }))
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
                      onClick={handleUpdatePlayer}
                      className={`!bg-black text-white ${isLoading && "opacity-70"}`}
                  >
                        <Plus/>
                      {isLoading ? "Updating..." : "Update Player"}
                  </Button>
              </div>
    </div>
  );
}
