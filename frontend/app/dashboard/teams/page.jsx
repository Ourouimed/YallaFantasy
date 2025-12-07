"use client";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/table";
import Select from "@/components/ui/Select"; 
import { usePopup } from "@/hooks/usePopup";
import { getAllTeams } from "@/store/features/teams/teamsSlice";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TeamsPage() {
    const { openPopup } = usePopup();
    const dispatch = useDispatch();

    const [teamTosearch, setTeamToSearch] = useState("");
    const [filteredGroup, setFilteredGroup] = useState("all");

    const { isLoading, teams } = useSelector((state) => state.teams);

    // Group select options
    const groupOptions = [
        { value: "all", label: "All Groups" },
        { value: "Group1", label: "Group 1" },
        { value: "Group2", label: "Group 2" },
        { value: "Group3", label: "Group 3" },
        { value: "Group4", label: "Group 4" },
        { value: "Group5", label: "Group 5" },
        { value: "Group6", label: "Group 6" }
    ];

    useEffect(() => {
        dispatch(getAllTeams()).unwrap();
    }, []);

    const handleSearch = (e) => {
        setTeamToSearch(e.target.value);
    };

    const handleGroupChange = (value) => {
        setFilteredGroup(value);
    };

    const filteredTeams = teams
        ?.filter((team) =>
            team.team_name.toLowerCase().includes(teamTosearch.toLowerCase())
        )
        .filter((team) =>
            filteredGroup === "all"
                ? true
                : team.group_num === filteredGroup
        );

    return (
        <DashboardLayout>
            <div className="space-y-7">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">National teams</h1>
                        <p className="text-gray-700">Manage AFCON2025 teams</p>
                    </div>

                    <Button
                        onClick={() =>
                            openPopup({
                                title: "Add new national team",
                                component: "AddTeamPopup",
                            })
                        }
                        className="!bg-black text-white text-sm"
                    >
                        <Plus size={15} /> Add Team
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search a team"
                        onChange={handleSearch}
                        value={teamTosearch}
                    />

                    <Select
                        options={groupOptions}
                        value={filteredGroup}
                        onChange={handleGroupChange}
                        placeholder="Filter by group"
                    />
                </div>

                {/* Table */}
                <div>
                    {isLoading ? (
                        <p>...Loading teams</p>
                    ) : filteredTeams?.length === 0 ? (
                        <p>No teams found</p>
                    ) : (
                        <Table
                            data={filteredTeams}
                            columns={{
                                flag: (value) => (
                                    <img src={value} className="w-9 h-6 rounded" />
                                ),
                                action: (_, row) => (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            className="!p-0"
                                            onClick={() => handleOpenEditPopup(row)}
                                        >
                                            <Edit size={18} />
                                        </Button>

                                        <Button
                                            className="!p-0 !text-red-500"
                                            onClick={() =>
                                                handleOpenDeleteConfirmation(row.team_id)
                                            }
                                        >
                                            <Trash size={18} />
                                        </Button>
                                    </div>
                                ),
                            }}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
