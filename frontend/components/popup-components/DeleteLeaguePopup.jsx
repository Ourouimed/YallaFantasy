import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import { usePopup } from "@/hooks/usePopup";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { deleteLeagueById } from "@/store/features/leagues/leagueSlice";

export default function DeleteLeaguePopup ({name , id}){
    const dispatch = useDispatch()
    const { isLoading } = useSelector(state => state.players)
    const { closePopup } = usePopup()
    const toast = useToast()
    const router  = useRouter()

    const handleDeleteLeaue = async()=>{
        try {
            await dispatch(deleteLeagueById(id)).unwrap()
            closePopup()
            router.push('/leagues')
            toast.success('League deleted successfully')
        }
        catch (err){
            toast.error(err)
        }
        
    }
    return <>
        <h4>Are you sure you want to delete {name}?</h4>
        <div className="flex justify-end mt-3 gap-2">
            <Button className='!bg-slate-200 text-black !px-6 !py-2' disabled={isLoading} onClick={closePopup}>Cancel</Button>
            <Button className={`!bg-red-500 text-white !px-6 !py-2 ${isLoading && 'opacity-70'}`} disabled={isLoading} onClick={handleDeleteLeaue}>
                {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
        </div>
    </>
}