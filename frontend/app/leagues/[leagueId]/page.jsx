'use client'

import Header from "@/components/sections/Header";
import { verifySession } from "@/store/features/auth/authSlice";
import { getLeague } from "@/store/features/leagues/leagueSlice";
import { Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LeaguePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { leagueId } = useParams();

  const { user, isLoading: authLoading } = useSelector(state => state.auth);
  const { currentLeague, isLoading: leagueLoading } = useSelector(state => state.leagues);

  const members = currentLeague?.members || [];

  const membersToShow = useMemo(() => 
    members.map(({ fullname, team_name, total_pts }) => ({
      name: fullname,
      team_name,
      total_pts
    }))
  , [members]);

  useEffect(() => { dispatch(verifySession()); }, [dispatch]);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && leagueId) dispatch(getLeague(leagueId));
  }, [user, leagueId, dispatch]);

  
  if (authLoading || leagueLoading) {
    return (
      <>
        <Header isSticky />
        <div className="px-20 py-10 text-center text-gray-500">
          Loading league...
        </div>
      </>
    );
  }

  if (!currentLeague?.league) {
    return (
      <>
        <Header isSticky />
        <div className="px-20 py-10 text-center text-red-500">
          League not found
        </div>
      </>
    );
  }

  const { league } = currentLeague;

  return (
    <>
      <Header isSticky />
      <div className="px-20 py-6">
        <div className="flex items-center gap-3">
          <div>
            <h4 className="font-semibold text-3xl">{league.league_name}</h4>
            <div className="flex items-center gap-1 text-md text-gray-500">
              <Users size={16} />
              {league.members_count} members
            </div>
          </div>
        </div>

        <ul className="mt-6 space-y-2 divide-y divide-gray-300">
          {membersToShow.map(m => (
            <li key={m.name} className="p-2 flex justify-between items-center">
              <div className="space-y"> 
                    <h4 className="text-xl font-semibold">
                        {m.team_name}
                    </h4>
                    <span>
                        {m.name}
                    </span> 
                    
              </div>
              <span>{m.total_pts} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

