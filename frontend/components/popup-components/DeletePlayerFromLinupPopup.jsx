import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { usePopup } from "@/hooks/usePopup";
import { useToast } from "@/hooks/useToast";
import { deletPlayerFromLinup } from "@/store/features/matches/matchesSlice";

export default function DeletePlayerFromLinupPopup ({player_id ,  match_id , team_side}){
    const dispatch = useDispatch() 
    const { isLoading } = useSelector(state => state.matches)
    const { closePopup } = usePopup()
    const toast = useToast()

    const handleDeleteTeam = async()=>{
        try {
            await dispatch(deletPlayerFromLinup({player_id ,  match_id , team_side })).unwrap()
            closePopup()
            toast.success('Player deleted successfully')
        }
        catch (err){
            console.log(err)
            toast.error(err)
        }
        
    }
    return <>
        <h4>Are you sure you want to delete {player_id}?</h4>
        <div className="flex justify-end mt-3 gap-2">
            <Button className='!bg-slate-200 text-black !px-6 !py-2' disabled={isLoading} onClick={closePopup}>Cancel</Button>
            <Button className={`!bg-red-500 text-white !px-6 !py-2 ${isLoading && 'opacity-70'}`} disabled={isLoading} onClick={handleDeleteTeam}>
                {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
        </div>
    </>
}