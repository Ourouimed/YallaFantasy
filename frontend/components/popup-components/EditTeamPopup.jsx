'use client';
import { useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { updateTeam } from "@/store/features/teams/teamsSlice";
import { usePopup } from "@/hooks/usePopup";
import { useToast } from "@/hooks/useToast";

export default function EditTeamPopup({team}) {  
  const [teamToEdit, setTeamToEdit] = useState({
    id : team.team_id ,
    group: team.group_num,
    teamName: team.team_name,
    flag: team.flag, 
  });

  const [preview, setPreview] = useState(team.flag); 
  const [validationErrors , setValidationErrors] = useState({})
  

  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.teams)
  const { closePopup } = usePopup()
  const toast = useToast()

  // Group options
  const options = () => {
    const opts = [];
    for (let i = 1; i <= 6; i++) {
      opts.push({ value: `Group${i}`, label: `Group${i}` });
    }
    return opts;
  };


  const validateForm = ()=>{
        const newErrors = {}
        if (!teamToEdit.teamName.trim()) newErrors.teamName = "Team name is required";
        if (!teamToEdit.group.trim()) newErrors.group = "Group is required";
        if (!teamToEdit.flag) newErrors.flag = "Flag is required";
        setValidationErrors(newErrors)
        return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setTeamToEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGroupChange = (value) => {
    setTeamToEdit((prev) => ({ ...prev, group: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTeamToEdit((prev) => ({ ...prev, flag: file }));
    if (file) setPreview(URL.createObjectURL(file)); 
  };

  const handleUpdateTeam = async () => {
    if (!validateForm()) return false;
    try {
        const formData = new FormData();
        formData.append("teamName", teamToEdit.teamName);
        formData.append("group", teamToEdit.group);
        if (teamToEdit.flag) formData.append("flag", teamToEdit.flag);
        try {
            await dispatch(updateTeam({id : teamToEdit.id , formData})).unwrap(); 
            setPreview(null);
            setTeamToEdit({ group: "", teamName: "", flag: null });
            closePopup();
            toast.success('Team updated successfully')
        } catch (err) {
           console.log(err)
           toast.error(err)
        }

    }
    catch (err) {
        console.log(err)
        toast.error(err || 'Unknown error')
    }
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
                {validationErrors?.flag && <p className="text-red-600 text-sm">{validationErrors.flag}</p>}
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
          value={teamToEdit.teamName}
          onChange={handleChange}
        />
        {validationErrors?.teamName && <p className="text-red-600 text-sm">{validationErrors.teamName}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase">
          Group
        </label>
        <Select
          options={options()}
          className="w-full"
          value={teamToEdit.group}
          onChange={handleGroupChange}
          placeholder="Select group"
        />
        {validationErrors?.group && <p className="text-red-600 text-sm">{validationErrors.group}</p>}
      </div>

      

      <div className="flex justify-end">
        <Button disabled={isLoading} onClick={handleUpdateTeam} className={`!bg-black text-white ${isLoading && 'opacity-70'}`}>{isLoading ? 'Updating...' : 'Update Team'}</Button>
      </div>
    </div>
  );
}
