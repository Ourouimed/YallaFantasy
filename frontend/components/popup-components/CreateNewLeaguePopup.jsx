import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useToast } from "@/hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import { usePopup } from "@/hooks/usePopup";
import { createLeague } from "@/store/features/leagues/leagueSlice";

export default function CreateNewLeaguePopup (){
    const [leagueName , setLeagueName] = useState("")
    const { closePopup } = usePopup()
    const { isLoading } = useSelector(state => state.leagues)
    const toast = useToast()
    const dispatch = useDispatch()
    const handleCreateLeague = async ()=>{
       if (leagueName.trim().length >= 3 || leagueName.trim().length <= 30){
         try {
           await dispatch(createLeague(leagueName)).unwrap()
           toast.success('League created successfully')
           closePopup()
            }
            catch (err){
                console.log(err)
                toast.error(err || 'Error')
            }
       }
       else {
            toast.error('League name must be between 3 and 30 characters')
       }
    }
    return <>
        <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  League Name
                </label>

                
        
                <Input  
                  value={leagueName}
                  onChange={e=> {
                    setLeagueName(e.target.value)
                  }}
                  name="league_name"
                  placeholder='league name goes here'
                />
        
              
        </div>


         <div className="flex justify-end mt-3 gap-2">
                <Button className={`!bg-black text-white ${leagueName.trim().length < 3 || isLoading ? 'opacity-30 cursor-notallowed' : ''}`} 
                disabled={leagueName.trim().length < 3 || isLoading}
                onClick={handleCreateLeague}>
                    Create league
                </Button>
        </div>
    </>
}