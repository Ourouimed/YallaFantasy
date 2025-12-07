"use client";
import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeams } from "@/store/features/teams/teamsSlice";
import { updatePlayer } from "@/store/features/players/playersSlice";
import { usePopup } from "@/hooks/usePopup";
import { useToast } from "@/hooks/useToast";

export default function EditPlayerPopup({ player }) {
  const [playerToEdit, setPlayerToEdit] = useState({
    fullname: player.fullname,
    price: player.price,
    team_id: player.team_id,
    player_image: null, // new image only
  });

  const [preview, setPreview] = useState(player.player_image);
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const { closePopup } = usePopup();
  const toast = useToast();

  const { teams } = useSelector(state => state.teams);
  const { isLoading } = useSelector(state => state.players);

  useEffect(() => {
    dispatch(getAllTeams());
  }, []);

  const options = teams.map(t => ({
    value: t.team_id,
    label: t.team_name
  }));

  const validateForm = () => {
    const errors = {};

    if (!playerToEdit.fullname.trim()) errors.fullname = "Player name is required";
    if (!playerToEdit.price || Number(playerToEdit.price) <= 0)
      errors.price = "Valid price is required";
    if (!playerToEdit.team_id) errors.team_id = "Team is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setPlayerToEdit(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTeamChange = (value) => {
    setPlayerToEdit(prev => ({ ...prev, team_id: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPlayerToEdit(prev => ({ ...prev, player_image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpdatePlayer = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("fullname", playerToEdit.fullname);
    formData.append("price", playerToEdit.price);
    formData.append("team_id", playerToEdit.team_id);

    if (playerToEdit.player_image) {
      formData.append("player_image", playerToEdit.player_image);
    }

    try {
      await dispatch(updatePlayer({ id: player.player_id, formData })).unwrap();

      toast.success("Player updated successfully");
      closePopup();
    } catch (err) {
      toast.error(err || "Error updating player");
    }
  };

  return (
    <div className="space-y-4">

      {/* Image preview */}
      <div className="space-y-2">
        {preview && (
          <div className="w-28 h-28 mx-auto rounded-md overflow-hidden border shadow">
            <img src={preview} className="w-full h-full object-cover" />
          </div>
        )}

        <label className="text-xs font-medium text-gray-700 uppercase">
          Player Image
        </label>

        <label
          htmlFor="playerImageEdit"
          className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-third hover:bg-red-500/10 transition duration-300 text-gray-600 text-sm relative"
        >
          <p>Drag & drop image</p>
          <p className="mt-1 text-xs text-gray-400">or click to select</p>

          <input
            id="playerImageEdit"
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* fullname */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">Player Name</label>
        <Input
          name="fullname"
          value={playerToEdit.fullname}
          onChange={handleChange}
          placeholder="Enter player name"
        />
        {validationErrors.fullname && (
          <p className="text-red-600 text-sm">{validationErrors.fullname}</p>
        )}
      </div>

      {/* price */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">Price</label>
        <Input
          name="price"
          type="number"
          value={playerToEdit.price}
          onChange={handleChange}
          placeholder="Enter price"
        />
        {validationErrors.price && (
          <p className="text-red-600 text-sm">{validationErrors.price}</p>
        )}
      </div>

      {/* team select */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">Team</label>
        <Select
          value={playerToEdit.team_id}
          options={options}
          onChange={handleTeamChange}
          placeholder="Select team"
        />
        {validationErrors.team_id && (
          <p className="text-red-600 text-sm">{validationErrors.team_id}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          disabled={isLoading}
          onClick={handleUpdatePlayer}
          className={`!bg-black text-white ${isLoading && "opacity-70"}`}
        >
          {isLoading ? "Updating..." : "Update Player"}
        </Button>
      </div>
    </div>
  );
}
