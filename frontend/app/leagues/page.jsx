"use client"
import Header from "@/components/sections/Header";
import Button from "@/components/ui/Button";
import LeagueCard from "@/components/ui/cards/LeagueCard";
import { usePopup } from "@/hooks/usePopup";
import { verifySession } from "@/store/features/auth/authSlice";
import { getAllLeagues } from "@/store/features/leagues/leagueSlice";
import { ExternalLink, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LeaguesPage() {
  const { user, isLoading: authLoading } = useSelector(state => state.auth);
  const { leagues, isLoading } = useSelector(state => state.leagues);
  const dispatch = useDispatch();
  const router = useRouter();
  const { openPopup } = usePopup();

  useEffect(() => {
    dispatch(verifySession());
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      dispatch(getAllLeagues());
    }
  }, [user, authLoading]);

  const handleOpenAddLeaguePopup = () => {
    openPopup({
      title: "Create a new league",
      component: "CreateNewLeaguePopup",
    });
  };


  const handleOpenJoinLeaguePopup = () => {
    openPopup({
      title: "Join a league",
      component: "JoinLeaguePopup",
    });
  };

  return (
    <>
      <Header isSticky />
      <div className="px-4 md:px-20 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">My Leagues</h3>
          <div className="flex items-center gap-2">
            <Button className="!bg-black text-white" onClick={handleOpenJoinLeaguePopup}>
              Join League <ExternalLink size={18} />
            </Button>
            <Button className="border border-black" onClick={handleOpenAddLeaguePopup}>
              Create League <Plus size={18} />
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-gray-500">Loading leagues...</p>
        ) : leagues.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg font-medium">No leagues yet</p>
            <p className="text-sm">Create or join a league to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leagues.map(l => (
              <LeagueCard key={l.id_league} league={l}/>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
