import { Flag, LayoutDashboard, Settings, User, Users } from "lucide-react"

export const menu = [
    {
        url : '/',
        name : 'Home'
    },
    {
        url : '/dashboard',
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
        icon : Users
    },
    {
        name : 'Players',
        url : '/dashboard/players',
        icon : User
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