import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { usePopup } from "@/hooks/usePopup";
import { deleteTeamByid } from "@/store/features/teams/teamsSlice";
import { useToast } from "@/hooks/useToast";

export default function DeleteTeamPopup ({id}){
    const dispatch = useDispatch()
    const { isLoading } = useSelector(state => state.teams)
    const { closePopup } = usePopup()
    const toast = useToast()

    const handleDeleteTeam = async()=>{
        try {
            await dispatch(deleteTeamByid(id)).unwrap()
            closePopup()
            toast.success('Toast deleted successfully')
        }
        catch (err){
            toast.error(err)
        }
        
    }
    return <>
        <h4>Are you sure you want to delete {id}?</h4>
        <div className="flex justify-end mt-3 gap-2">
            <Button className='!bg-slate-200 text-black !px-6 !py-2' disabled={isLoading} onClick={closePopup}>Cancel</Button>
            <Button className={`!bg-red-500 text-white !px-6 !py-2 ${isLoading && 'opacity-70'}`} disabled={isLoading} onClick={handleDeleteTeam}>
                {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
        </div>
    </>
}