"use client";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/table";
import Select from "@/components/ui/Select"; 
import { usePopup } from "@/hooks/usePopup";
import { Edit, Plus, Trash, ChevronLeft, ChevronRight } from "lucide-react"; // Added Icons
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlayers } from "@/store/features/players/playersSlice";
import { getAllTeams } from "@/store/features/teams/teamsSlice";

export default function PlayersPage() {
    const { openPopup } = usePopup();
    const dispatch = useDispatch();

    // Filter States
    const [playerNameSearch, setPlayerNameSearch] = useState(""); 
    const [selectedTeamId, setSelectedTeamId] = useState("all");
    const [selectedPosition, setSelectedPosition] = useState("all");

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { isLoading, players } = useSelector((state) => state.players);
    const { teams } = useSelector(state => state.teams);

    const positionOptions = [
        { value: "all", label: "All Positions" },
        { value: "GK", label: "Goalkeeper" },
        { value: "DEF", label: "Defender" },
        { value: "MID", label: "Midfielder" },
        { value: "FWD", label: "Forward" },
    ];

    const teamOptions = useMemo(() => {
        const options = teams.map(team => ({
            value: String(team.team_id),
            label: team.team_name
        }));
        return [{ value: "all", label: "All Teams" }, ...options];
    }, [teams]);

    useEffect(() => {
        dispatch(getAllPlayers()).unwrap();
        dispatch(getAllTeams()).unwrap();
    }, [dispatch]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [playerNameSearch, selectedTeamId, selectedPosition]);

    // --- FILTER LOGIC ---
    const filteredPlayers = useMemo(() => {
        if (!players) return [];
        return players.filter((player) => {
            const matchesTeam = selectedTeamId === "all" || String(player.team_id) === selectedTeamId;
            const matchesPosition = selectedPosition === "all" || player.position === selectedPosition;
            const matchesSearch = player.fullname?.toLowerCase().includes(playerNameSearch.toLowerCase());
            return matchesTeam && matchesPosition && matchesSearch;
        });
    }, [players, playerNameSearch, selectedTeamId, selectedPosition]);

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPlayers.slice(start, start + itemsPerPage);
    }, [filteredPlayers, currentPage]);

    const handleSearch = (e) => setPlayerNameSearch(e.target.value);
    const handleTeamChange = (value) => setSelectedTeamId(value);
    const handlePositionChange = (value) => setSelectedPosition(value);

    const handleOpenEditPopup = (player) => {
        openPopup({
            title: "Edit Player",
            component: "EditPlayerPopup",
            props: { player }
        })
    }

    const handleOpenDeleteConfirmation = (id) => {
        openPopup({
            title: "Delete Player",
            component: "DeletePlayerPopup",
            props: { id }
        })
    }

    return (
        <DashboardLayout>
            <div className="space-y-7">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Players</h1>
                        <p className="text-gray-700">Manage AFCON2025 players</p>
                    </div>

                    <Button
                        onClick={() =>
                            openPopup({
                                title: "Add new Player",
                                component: "AddPlayerPopup",
                            })
                        }
                        className="!bg-black text-white text-sm"
                    >
                        <Plus size={15} /> Add Player
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search player name..."
                        onChange={handleSearch}
                        value={playerNameSearch}
                        className="flex-1"
                    />
                    <Select options={teamOptions} value={selectedTeamId} onChange={handleTeamChange} />
                    <Select options={positionOptions} value={selectedPosition} onChange={handlePositionChange} />
                </div>

                {/* Table */}
                <div className="space-y-4">
                    {isLoading ? (
                        <p>...Loading Players</p>
                    ) : paginatedData?.length === 0 ? (
                        <p>No Players found</p>
                    ) : (
                        <>
                            <Table
                                data={paginatedData} // Using paginated data here
                                columns={{
                                    player_image: (value) => (
                                        <img src={value} alt="" className="size-12 rounded-full p-1 border-1 object-cover" />
                                    ),
                                    fullname: (value) => <span className="font-medium">{value}</span>,
                                    position: (value) => <span className="text-sm text-gray-600">{value}</span>,
                                    team: (value) => (
                                        <img src={value} alt="" className="w-14 h-9 rounded shadow-sm" />
                                    ),
                                    action: (_, row) => (
                                        <div className="flex items-center gap-2">
                                            <Button className="!p-0" onClick={() => handleOpenEditPopup(row)}>
                                                <Edit size={18} />
                                            </Button>
                                            <Button className="!p-0 !text-red-500" onClick={() => handleOpenDeleteConfirmation(row.player_id)}>
                                                <Trash size={18} />
                                            </Button>
                                        </div>
                                    ),
                                }}
                            />

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between border-t pt-4">
                                <p className="text-sm text-gray-600">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPlayers.length)} of {filteredPlayers.length} players
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="!bg-white !text-black border disabled:opacity-50"
                                    >
                                        <ChevronLeft size={18} />
                                    </Button>
                                    <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                                    <Button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="!bg-white !text-black border disabled:opacity-50"
                                    >
                                        <ChevronRight size={18} />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}