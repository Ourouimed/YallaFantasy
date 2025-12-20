"use client"
import Header from "@/components/sections/Header";
import Button from "@/components/ui/Button";
import LeagueCard from "@/components/ui/cards/LeagueCard";
import { verifySession } from "@/store/features/auth/authSlice";
import { getAllLeagues } from "@/store/features/leagues/leagueSlice";
import { getTeam } from "@/store/features/my-team/myTeamSlice";
import { ArrowRightLeft, ChevronRight, ExternalLink, Shield, Shirt, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PlayPage() {
    const { user } = useSelector(state => state.auth)
    const authLoading = useSelector(state => state.auth.isLoading)
    const { my_team, isLoading } = useSelector(state => state.myTeam)
    const { leagues , isLoading : leagueLoading} = useSelector(state => state.leagues)
    const dispatch = useDispatch()
    const router = useRouter()
    useEffect(() => {
        dispatch(verifySession())

    }, [])

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
        else {
            dispatch(getTeam())
           dispatch(getAllLeagues());
        }

    }, [user, router, authLoading])
    return <>
        <Header isSticky />
        <div className="px-4 md:px-20 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[4fr_6fr] gap-2">
                <div className="rounded-xl border border-gray-300 space-y-2 divide-y divide-gray-300">
                    <div className="flex items-center gap-3 justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-main rounded-full aspect-square p-3">
                                <Shield size={45} className="text-third" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    {my_team?.team?.team_name || 'My Team'}
                                </h3>
                                <p>
                                    {user?.fullname}
                                </p>
                            </div>
                        </div>
                        {!my_team?.team && <Button isLink href={'/team-selection'} className='!bg-second text-white'>Create Team</Button>}
                    </div>

                    {my_team?.nextDeadline && <>
                        <div className="flex items-center gap-3 p-4">
                            <Button className='!bg-second !text-white flex-1' isLink href='/pick-team'>
                                <Shirt />
                                Pick Team
                            </Button>
                            <Button className='!bg-third !text-white flex-1' isLink href='/team-selection'>
                                <ArrowRightLeft />
                                transfers
                            </Button>
                        </div>
                    </>}
                </div>

                <div className="rounded-xl border border-gray-300 divide-y divide-gray-300">
                    <div className="flex items-center justify-between p-4">
                        <h4 className="text-2xl font-semibold">My leagues</h4>
                        <Button className="!bg-black !p-2 text-white text-sm " isLink href='./leagues'>
                            Create/Join league
                            <ChevronRight />
                        </Button>
                    </div>
                    <div>
                         {leagueLoading ? (
                                  <p className="text-gray-500">Loading leagues...</p>
                                ) : leagues.length === 0 ? (
                                  <div className="text-center py-10 text-gray-500">
                                    <p className="text-lg font-medium">No leagues yet</p>
                                    <p className="text-sm">Create or join a league to get started</p>
                                  </div>
                                ) : (
                                  <div className="space-y-2 p-2">
                                    {leagues.map(l => (
                                      <LeagueCard key={l.id_league} league={l}/>
                                    ))}
                                  </div>
                                )}
                    </div>
                </div>
            </div>
        </div>
    </>
}