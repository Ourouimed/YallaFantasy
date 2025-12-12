'use client';
import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeams } from "@/store/features/teams/teamsSlice"; 
import { usePopup } from "@/hooks/usePopup";
import { useToast } from "@/hooks/useToast";
import { createPlayer } from "@/store/features/players/playersSlice";

export default function AddPlayerPopup() {
  const [player, setPlayer] = useState({
    fullname: "",
    price: "",
    team_id: "",
    player_image: null,
    player_number : '',
    position : ""
  });

  const [preview, setPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const { closePopup } = usePopup();
  const toast = useToast();

  const { teams } = useSelector((state) => state.teams);
  const { isLoading } = useSelector((state) => state.players);

  useEffect(() => {
    dispatch(getAllTeams());
  }, []);

  const teamOptions = teams.map(team => ({
    value: team.team_id,
    label: team.team_name
  }));

  const positionOption = [
    { value: 'FWD' , label : 'FWD'} , 
    { value: 'MID' , label : 'MID'} ,
    { value: 'DEF' , label : 'DEF'} , 
    { value: 'GK' , label : 'GK'} 
  ]

  const handleChange = (e) => {
    setPlayer(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGroupChange = (value) => {
    setPlayer(prev => ({ ...prev, team_id: value }));
  };

  const handlePositionChange = (value) => {
    setPlayer(prev => ({ ...prev, position: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPlayer(prev => ({ ...prev, player_image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const errors = {};

    if (!player.fullname.trim()) errors.fullname = "Player name is required";
    if (!player.price || Number(player.price) <= 0) errors.price = "Valid price is required";
    if (!player.player_number || Number(player.player_number) <= 0 || Number(player.player_number) > 28) errors.player_number = "Number must be between 1 & 28";
    if (!player.team_id) errors.team_id = "Team is required";
    if (!player.position) errors.position = "Position is required";
    if (!player.player_image) errors.player_image = "Player image is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePlayer = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("fullname", player.fullname);
    formData.append("price", player.price);
    formData.append("team_id", player.team_id);
    formData.append("player_image", player.player_image);
    formData.append("position", player.position);
    formData.append("player_number", player.player_number);

    try {
      await dispatch(createPlayer(formData)).unwrap();
      toast.success("Player created successfully");
      closePopup();

      setPlayer({
        fullname: "",
        price: "",
        team_id: "",
        player_image: null, 
        player_number : ""
      });

      setPreview(null);
    } catch (err) {
      toast.error(err || "Error creating player");
    }
  };

  return (
    <div className="space-y-4">

      {/* Image Preview */}
      <div className="space-y-2">
        {preview && (
          <div className="w-28 h-28 mx-auto rounded-md overflow-hidden border shadow">
            <img src={preview} className="w-full h-full object-cover rounded-full" />
          </div>
        )}

        <label className="text-xs font-medium text-gray-700 uppercase">
          Player Image
        </label>

        <label
          htmlFor="playerImage"
          className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-third hover:bg-red-500/10 transition duration-300 text-gray-600 text-sm relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
          }}
        >
          <p>Drag & drop image</p>
          <p className="mt-1 text-xs text-gray-400">or click to select</p>

          <input
            id="playerImage"
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />

          {validationErrors.player_image && (
            <p className="text-red-600 text-sm">{validationErrors.player_image}</p>
          )}
        </label>
      </div>

      {/* Player name */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Player Name
        </label>

        <Input
          name="fullname"
          placeholder="Enter player name"
          value={player.fullname}
          onChange={handleChange}
        />

        {validationErrors.fullname && (
          <p className="text-red-600 text-sm">{validationErrors.fullname}</p>
        )}
      </div>

      {/* Player position */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Player Position
        </label>

        <Select
          options={positionOption}
          value={player.position}
          onChange={handlePositionChange}
          placeholder="Select position"
        />

        {validationErrors.position && (
          <p className="text-red-600 text-sm">{validationErrors.position}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Price
        </label>

        <Input
          name="price"
          type="number"
          placeholder="Enter price"
          value={player.price}
          onChange={handleChange}
        />

        {validationErrors.price && (
          <p className="text-red-600 text-sm">{validationErrors.price}</p>
        )}
      </div>

      {/* Player Number */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Number
        </label>

        <Input
          name="player_number"
          type="number"
          min={1}
          max={28}
          placeholder="Enter number"
          value={player.player_number}
          onChange={handleChange}
        />

        {validationErrors.player_number && (
          <p className="text-red-600 text-sm">{validationErrors.player_number}</p>
        )}
      </div>

      {/* Team Select */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Team
        </label>

        <Select
          options={teamOptions}
          value={player.team_id}
          onChange={handleGroupChange}
          placeholder="Select team"
        />

        {validationErrors.team_id && (
          <p className="text-red-600 text-sm">{validationErrors.team_id}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          disabled={isLoading}
          onClick={handleCreatePlayer}
          className={`!bg-black text-white ${isLoading && "opacity-70"}`}
        >
          {isLoading ? "Creating..." : "Create Player"}
        </Button>
      </div>
    </div>
  );
}
