'use client';
import { useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import axios from "axios";
import Button from "../ui/Button";

export default function AddTeamPopup() {
  const [team, setTeam] = useState({
    group: "",
    teamName: "",
    flag: null, 
  });

  const [preview, setPreview] = useState(null); 

  // Group options
  const options = () => {
    const opts = [];
    for (let i = 1; i <= 12; i++) {
      opts.push({ value: `Group${i}`, label: `Group${i}` });
    }
    return opts;
  };

  const handleChange = (e) => {
    setTeam((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGroupChange = (value) => {
    setTeam((prev) => ({ ...prev, group: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTeam((prev) => ({ ...prev, flag: file }));
    setPreview(URL.createObjectURL(file)); // show preview
  };

  const handleCreateTeam = async () => {
    const formData = new FormData();
    formData.append("teamName", team.teamName);
    formData.append("group", team.group);
    if (team.flag) formData.append("flag", team.flag);

    
  };

  return (
    <div className="space-y-4">
        <div className="space-y-2">
            {preview && (
                <div className="w-28 h-28 mx-auto overflow-hidden rounded-md border border-gray-300 shadow-sm">
                <img
                    src={preview}
                    alt="flag preview"
                    className="w-full h-full object-cover"
                />
                </div>
            )}

            <label className="block text-xs font-medium text-gray-700 uppercase">
                Team Flag
            </label>

            <label
                htmlFor="flagInput"
                className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-third hover:bg-red-500/10 transition duration-300 text-gray-600 text-sm relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                handleFileChange({ target: { files: [file] } });
                }}
            >
                <p>Drag & drop your flag here</p>
                <p className="mt-1 text-xs text-gray-400">or click to select file</p>
                <input
                    id="flagInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </label>
        </div>



      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Team Name
        </label>
        <Input
          type="text"
          placeholder="Enter team name here"
          name="teamName"
          value={team.teamName}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Group
        </label>
        <Select
          options={options()}
          className="w-full"
          value={team.group}
          onChange={handleGroupChange}
          placeholder="Select group"
        />
      </div>

      

      <div className="flex justify-end">
        <Button onClick={handleCreateTeam} className='!bg-black text-white'>Create Team</Button>
      </div>
    </div>
  );
}
