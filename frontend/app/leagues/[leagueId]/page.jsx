'use client'

import Header from "@/components/sections/Header";
import Button from "@/components/ui/Button";
import { usePopup } from "@/hooks/usePopup";
import { verifySession } from "@/store/features/auth/authSlice";
import { getLeague } from "@/store/features/leagues/leagueSlice";
import { Clipboard, Settings, Users, Trophy, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LeaguePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { leagueId } = useParams();


  const { openPopup } = usePopup()

  const { user, isLoading: authLoading } = useSelector(state => state.auth);
  const { currentLeague, isLoading: leagueLoading } = useSelector(state => state.leagues);

  const members = currentLeague?.members || [];
  const [copied, setCopied] = useState(false);

  const membersToShow = useMemo(
    () =>
      members.map(({ fullname, team_name, total_pts }) => ({
        name: fullname,
        team_name,
        total_pts
      })),
    [members]
  );

  useEffect(() => {
    dispatch(verifySession());
  }, [dispatch]);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && leagueId) dispatch(getLeague(leagueId));
  }, [user, leagueId, dispatch]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(leagueId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

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
      <div className="px-4 md:px-20 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">{league.league_name}</h2>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <Users size={16} />
              <span>{league.members_count} members</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
              <span className="font-medium">Code:</span>
              <span className="font-mono">{leagueId}</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-gray-600 hover:text-black transition"
              >
                <Clipboard size={16} />
                {copied && (
                  <span className="text-green-600 text-xs font-medium">
                    Copied!
                  </span>
                )}
              </button>
            </div>

            {league?.isAdmin && <div className="flex items-center gap-4">
                  <button className='cursor-pointer' onClick={()=>{
                      openPopup({title : 'Edit League' , component: 'EditLeaguePopup' , props : {
                        league_name : league.league_name ,
                        league_id : leagueId
                      }})
                    }}>
                      <Settings size={18} />
                  </button>

                  <button className='cursor-pointer' onClick={()=>{
                    openPopup({
                      title : 'Delete League',
                      component : 'DeleteLeaguePopup' ,
                      props : { name : league.league_name , id : leagueId}
                    })
                  }}>
                    <Trash size={18} />
                  </button>
              </div>}
          </div>
        </div>

        {/* Members list */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-300">
          <ul className="divide-y">
            {membersToShow.map((m, i) => (
              <li
                key={m.name}
                className="flex items-center justify-between px-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-semibold text-gray-500">
                    {i + 1}
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg">{m.team_name}</h4>
                    <p className="text-sm text-gray-500">{m.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-semibold">
                  <Trophy size={16} className="text-yellow-500" />
                  {m.total_pts} pts
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  );
}
