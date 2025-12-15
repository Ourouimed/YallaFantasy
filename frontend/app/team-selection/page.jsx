'use client';

import Header from "@/components/sections/Header";
import Table from "@/components/ui/table";
import { getAllPlayers } from "@/store/features/players/playersSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function TeamSelection (){
    const { players } = useSelector(state => state.players)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getAllPlayers()).unwrap();
    }, []);

    const playersToShow = players.map(p=> ({
        player : {
            player_image : p.player_image, 
            fullname : p.fullname ,
            team_name : p.team_name
        } ,
        price : '$' + p.price , 
        position : p.position
        
    }))

    console.log(playersToShow)
    return <>
        <Header isSticky/>
        <div className="px-20 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[5fr_7fr] gap-3">
                {players.lenght === 0 ? 
                <p>No players found</p> 
                : 
                       <div>
                        <h3 className="text-2xl font-semibold mb-3">Players Selection</h3>
                         <Table data={playersToShow} columns={{
                            player : ({player_image , fullname , team_name})=> (<div className="flex items-center gap-3">
                                    <img src={player_image} className="size-12 rounded-full p-1 border-1"/>
                                    <div>
                                        <h4 className="font-semibold">{fullname}</h4>
                                        <span className="text-xs">{team_name}</span>
                                    </div>
                                </div>)
                            
                        }}/>
                       </div>
                }


                <div className="w-full">
                    hello
                </div>
            </div>
        </div>
    </>
}