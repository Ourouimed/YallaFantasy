import { FootballIcon } from "@/components/icons/football"
import { Flag, LayoutDashboard, Settings, Trophy, User } from "lucide-react"

export const menu = [
    {
        url : '/',
        name : 'Home'
    },
    {
        url : '/overview',
        name : 'Play'
    },
    {
        url : '/rules',
        name : 'How to play'
    },
    {
        url : '/groups',
        name : 'Groups'
    },
    {
        url : '/matches',
        name : 'Matches'
    },
    {
        url : '/leagues',
        name : 'Leagues'
    }
]

export const adminMenu = [
    {
        name : 'Dashboard',
        url : '/dashboard',
        icon : LayoutDashboard
    },
    {
        name : 'Rounds',
        url : '/dashboard/rounds',
        icon : Trophy
    },
    {
        name : 'Players',
        url : '/dashboard/players',
        icon : User
    },
    {
        name : 'Matches',
        url : '/dashboard/matches',
        icon : FootballIcon
    },
    {
        name : 'National teams',
        url : '/dashboard/teams',
        icon : Flag
    },
    {
        name : 'Settings',
        url : '/dashboard/settings',
        icon : Settings
    },
]