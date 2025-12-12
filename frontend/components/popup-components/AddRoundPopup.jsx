import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { createRound } from "@/store/features/rounds/roundsSlice";
import { useToast } from "@/hooks/useToast";
import { usePopup } from "@/hooks/usePopup";

export default function AddRoundPopup (){
    const [round, setRound] = useState({
        round_id: "",
        round_deadline : "" ,
        round_title : "",
      });
    const [validationErrors , setValidationErrors] = useState({})
    const { isLoading } = useSelector(state => state.rounds)
    const dispatch = useDispatch()
    const toast = useToast()
    const { closePopup } = usePopup()

    const handleChange = (e) => {
        setRound(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateForm = () => {
        const errors = {};

        if (!round.round_id.trim()) errors.round_id = "Round id is required";
        if (!round.round_title.trim()) errors.round_title = "Round title is required";
        if (!round.round_deadline.trim()) errors.round_deadline = "Round deadline is required";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateRound = async ()=>{
        if (!validateForm) return ;
        try {
            await dispatch(createRound(round)).unwrap()
            toast.success('Round created successfully')
            closePopup()
        }
        catch (err) {
            toast.error(err)
        }

    }
    return (
    <div className="space-y-4">
        {/* Round Id */}
        <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 uppercase" htmlFor="round_id">
                Round Id
            </label>
            <Input
                name="round_id"
                placeholder="Enter round id"
                value={round.round_id}
                onChange={handleChange}
            />
            {validationErrors.round_id && (
                <p className="text-red-600 text-sm">{validationErrors.round_id}</p>
            )}
        </div>


        {/* Round title */}
        <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 uppercase" htmlFor="round_title">
                Round title
            </label>
            <Input
                name="round_title"
                placeholder="Enter round title"
                value={round.round_title}
                onChange={handleChange}
            />
            {validationErrors.round_title && (
                <p className="text-red-600 text-sm">{validationErrors.round_title}</p>
            )}
        </div>

        {/* Round Deadline */}
        <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 uppercase" htmlFor="round_deadline">
                Round deadline
            </label>
            <Input
                type='datetime-local'
                name="round_deadline"
                value={round.round_deadline}
                onChange={handleChange}
            />
            {validationErrors.round_deadline && (
                <p className="text-red-600 text-sm">{validationErrors.round_deadline}</p>
            )}
        </div>


        <div className="flex justify-end">
                <Button
                  disabled={isLoading}
                  onClick={handleCreateRound}
                  className={`!bg-black text-white ${isLoading && "opacity-70"}`}
                >
                  {isLoading ? "Creating..." : "Create Round"}
                </Button>
        </div>
    </div>)
}