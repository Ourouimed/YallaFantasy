import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useToast } from "@/hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import { usePopup } from "@/hooks/usePopup";
import { joinLeague } from "@/store/features/leagues/leagueSlice";

export default function JoinLeaguePopup (){
    const [leagueId , setLeagueId] = useState("")
    const { closePopup } = usePopup()
    const { isLoading } = useSelector(state => state.leagues)
    const toast = useToast()
    const dispatch = useDispatch()
    const handleJoinLeague = async ()=>{
       if (leagueId.trim().length >= 3 || leagueId.trim().length <= 30){
         try {
           await dispatch(joinLeague(leagueId)).unwrap()
           toast.success('League Joined successfully')
           closePopup()
            }
            catch (err){
                console.log(err)
                toast.error(err || 'Error')
            }
       }
       else {
            toast.error('League id must be between 3 and 30 characters')
       }
    }
    return <>
        <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">
                  League Id
                </label>

                
        
                <Input  
                  value={leagueId}
                  onChange={e=> {
                    setLeagueId(e.target.value)
                  }}
                  name="league_id"
                  placeholder='league id goes here'
                />
        
              
        </div>


         <div className="flex justify-end mt-3 gap-2">
                <Button className={`!bg-black text-white ${leagueId.trim().length < 3 || isLoading ? 'opacity-30 cursor-notallowed' : ''}`} 
                disabled={leagueId.trim().length < 3 || isLoading}
                onClick={handleJoinLeague}>
                    Join league
                </Button>
        </div>
    </>
}