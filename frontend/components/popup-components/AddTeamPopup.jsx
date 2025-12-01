import { useState } from "react"
import Input from "../ui/Input"
import Select from "../ui/Select"

export default function TeamPopup (){
    const [team , setTeam] = useState({
        group : ''
    })
    // Group options
    const options = ()=>{
        const opts = []
        for (let i=1 ; i <= 12 ; i++){
            opts.push({value : `Group${i}` , label : `Group${i}`})
        }
        return opts
    }
     const handleChange = (e)=>{
        setTeam(prev => ({...prev , [e.target.name] : e.target.value}))
     }

     
  const handleGroupChange = (value) => {
    setTeam(prev => ({ ...prev, group: value }));
  };
    return <>
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-medium text-gray-700 uppercase">
                    Team Name
                </label>
                <Input type='text' placeholder='Enter team name here'/>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-medium text-gray-700 uppercase">
                    Team Name
                </label>
                <Select options={options()} className='w-full' value={team.group} onChange={handleGroupChange} type='text' placeholder='Enter team name here'/>
            </div>
        </div>
        
    </>
}