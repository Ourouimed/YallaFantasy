"use client";
import Header from "@/components/sections/Header";
import { getAllPlayers } from "@/store/features/players/playersSlice";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatLocalTime } from "@/utils/formatDate";
import PlayerLinupCard from "@/components/ui/cards/PlayerLinupCard";
import { useToast } from "@/hooks/useToast";
import PlayerListCard from "@/components/ui/cards/PlayerListCard";
import { getTeam, saveTeam } from "@/store/features/my-team/myTeamSlice";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select"; 
import { verifySession } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";
import ChipCard from "@/components/ui/cards/ChipCard";
import { Infinity } from "lucide-react";

export default function TeamSelection() {
  const { players } = useSelector((state) => state.players);
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { my_team, isLoading } = useSelector((state) => state.myTeam);
  const dispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();

  // --- FILTER & SORT STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPos, setFilterPos] = useState("ALL");
  const [filterTeam, setFilterTeam] = useState("ALL");
  const [sortBy, setSortBy] = useState("desc");

  const availableSpots = { GK: 2, DEF: 5, MID: 5, FWD: 3 };

  const [teamSelection, setTeamSelection] = useState({
    bank: 100,
    team_name: "",
    total_selected: 0,
    players: { GK: [], DEF: [], MID: [], FWD: [] },
  });

  const [initialPlayerIds, setInitialPlayerIds] = useState(new Set());

  useEffect(() => {
    dispatch(verifySession());
  }, [dispatch]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      dispatch(getTeam());
      dispatch(getAllPlayers());
    }
  }, [user, router, authLoading, dispatch]);

  useEffect(() => {
    if (my_team && my_team.players) {
      const flatPlayers = Object.values(my_team.players).flat();
      setInitialPlayerIds(new Set(flatPlayers.map((p) => p.player_id)));

      setTeamSelection({
        bank: my_team.team?.balance ?? 100,
        team_name: my_team?.team?.team_name || "",
        total_selected: flatPlayers.length,
        players: my_team.players,
        nextDeadline: my_team.nextDeadline,
      });
    }
  }, [my_team]);

  const posOptions = [
    { label: "All Positions", value: "ALL" },
    { label: "Goalkeepers", value: "GK" },
    { label: "Defenders", value: "DEF" },
    { label: "Midfielders", value: "MID" },
    { label: "Forwards", value: "FWD" },
  ];

  const sortOptions = [
    { label: "Price: High to Low", value: "desc" },
    { label: "Price: Low to High", value: "asc" },
  ];

  const teamOptions = useMemo(() => {
    const teams = players.map((p) => p.team_name).filter(Boolean);
    const unique = Array.from(new Set(teams)).sort();
    return [{ label: "All Teams", value: "ALL" }, ...unique.map((t) => ({ label: t, value: t }))];
  }, [players]);

  const filteredAndSortedPlayers = useMemo(() => {
    let list = [...players];
    if (searchTerm) {
      list = list.filter((p) => p.fullname.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterPos !== "ALL") {
      list = list.filter((p) => p.position === filterPos);
    }
    if (filterTeam !== "ALL") {
      list = list.filter((p) => p.team_name === filterTeam);
    }
    list.sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return sortBy === "desc" ? priceB - priceA : priceA - priceB;
    });
    return list;
  }, [players, searchTerm, filterPos, filterTeam, sortBy]);

  const transferStats = useMemo(() => {
    // UPDATED: Using server-side unlimited flag
    const isUnlimited = my_team?.team?.unlimited_transfers;

    const currentFlatPlayers = Object.values(teamSelection.players).flat();
    const playersOutCount = Array.from(initialPlayerIds).filter(
      (id) => !currentFlatPlayers.find((p) => p.player_id === id)
    ).length;

    // UPDATED: Using server-side free transfers count
    const freeTransfers = my_team?.team?.free_transfers || 0;
    const extraTransfers = Math.max(0, playersOutCount - freeTransfers);
    const pointHit = isUnlimited ? 0 : extraTransfers * 4;

    return { isUnlimited, playersOutCount, pointHit, freeTransfers };
  }, [teamSelection.players, initialPlayerIds, my_team]);

  const selectedPlayerIds = useMemo(() => {
    return new Set(Object.values(teamSelection.players).flat().map((p) => p.player_id));
  }, [teamSelection.players]);

  const handleAddPlayerToSquad = (player) => {
    const price = parseFloat(player.price) || 0;
    const pos = player.position;
    const currentPosPlayers = teamSelection.players[pos];
    const allSelected = Object.values(teamSelection.players).flat();

    if (selectedPlayerIds.has(player.player_id)) return toast.info("Player already selected");
    if (currentPosPlayers.length >= availableSpots[pos]) return toast.info(`Full on ${pos}s`);
    if (teamSelection.bank < price) return toast.info("Insufficient funds");
    if (allSelected.filter((p) => p.team_name === player.team_name).length >= 3) {
      return toast.info("Max 3 players per real-world team");
    }

    setTeamSelection((prev) => ({
      ...prev,
      bank: Number((prev.bank - price).toFixed(1)),
      total_selected: prev.total_selected + 1,
      players: { ...prev.players, [pos]: [...prev.players[pos], player] },
    }));
  };

  const handleRemovePlayerFromSquad = (player) => {
    const price = parseFloat(player.price) || 0;
    setTeamSelection((prev) => ({
      ...prev,
      bank: Number((prev.bank + price).toFixed(1)),
      total_selected: prev.total_selected - 1,
      players: {
        ...prev.players,
        [player.position]: prev.players[player.position].filter((p) => p.player_id !== player.player_id),
      },
    }));
  };

  const getLineupWithEmpty = (pos) => {
    const selected = teamSelection.players[pos] || [];
    return [...selected, ...Array(availableSpots[pos] - selected.length).fill(null)];
  };

  const handleSaveTeam = async () => {
    try {
      const payload = {
        ...teamSelection,
        point_hit: transferStats.pointHit,
        transfers_made: transferStats.playersOutCount,
      };
      await dispatch(saveTeam(payload)).unwrap();
      toast.success("Team saved successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to save team");
    }
  };

  return (
    <>
      <Header isSticky />
      <div className="px-4 md:px-20 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6">
          {/* TOP INFO BAR */}
          <div className="lg:col-span-full p-4 border rounded-lg bg-main/5 border-main/30">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">
                  Round: {my_team?.nextDeadline?.round_title} -{" "}
                  {formatLocalTime(my_team?.nextDeadline?.round_deadline)}
                </h4>
                <div className="flex gap-6 mt-2 items-center">
                  <p className="text-sm text-gray-500">
                    Bank: <span className="font-bold text-green-600">${teamSelection.bank}m</span>
                  </p>
                  
                  {/* UPDATED TRANSFER UI */}
                  <div className="flex gap-4 items-center border-l border-gray-300 pl-4">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Free Transfers:</span>
                      <span className="text-sm font-bold text-gray-700">
                        {transferStats.isUnlimited ? (
                          <Infinity size={20} className="text-third" />
                        ) : (
                          transferStats.freeTransfers
                        )}
                      </span>
                    </div>

                    {!transferStats.isUnlimited && (
                      <div className="flex gap-2 items-center">
                        <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Made:</span>
                        <span className={`text-sm font-bold ${transferStats.playersOutCount > transferStats.freeTransfers ? 'text-red-500' : 'text-gray-700'}`}>
                          {transferStats.playersOutCount}
                        </span>
                      </div>
                    )}

                    {transferStats.pointHit > 0 && (
                      <div className="bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <span className="text-xs font-bold text-red-600">Cost: -{transferStats.pointHit}pts</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-main">{teamSelection.total_selected} / 15</span>
                <p className="text-xs uppercase text-gray-400">Players Selected</p>
              </div>
            </div>
          </div>

          {/* LIST COLUMN */}
          <div className="space-y-3">
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm p-4 space-y-2">
              <Input
                placeholder="Your team name"
                value={teamSelection.team_name}
                onChange={(e) => setTeamSelection((prev) => ({ ...prev, team_name: e.target.value }))}
              />
              <Button
                className="!bg-main text-white w-full"
                disabled={teamSelection.total_selected !== 15 || isLoading}
                onClick={handleSaveTeam}
              >
                {isLoading
                  ? "Saving..."
                  : `Save Team ${transferStats.pointHit > 0 ? `(-${transferStats.pointHit} pts)` : ""}`}
              </Button>
            </div>

            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="p-4 border-b border-gray-300 bg-gray-50 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-700">Available Players</h3>
                  <span className="text-xs text-gray-400">{filteredAndSortedPlayers.length} results</span>
                </div>
                <Input
                  placeholder="Search by player name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!bg-white"
                />
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Select options={posOptions} value={filterPos} onChange={setFilterPos} className="!p-0" />
                    <Select options={teamOptions} value={filterTeam} onChange={setFilterTeam} className="!p-0" />
                  </div>
                  <Select options={sortOptions} value={sortBy} onChange={setSortBy} className="!p-0" />
                </div>
              </div>

              <div className="divide-y divide-gray-300 max-h-[600px] overflow-y-auto">
                {filteredAndSortedPlayers.length > 0 ? (
                  filteredAndSortedPlayers.map((player) => (
                    <PlayerListCard
                      key={player.player_id}
                      player={player}
                      disabled={selectedPlayerIds.has(player.player_id)}
                      onClick={() => handleAddPlayerToSquad(player)}
                    />
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-400 text-sm">No players match your filters.</div>
                )}
              </div>
            </div>
          </div>

          {/* PITCH COLUMN */}
          <div className="w-full space-y-4">
            {my_team?.team?.chips && (
              <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-5 gap-1">
                {my_team.team.chips.map(({ chip_name, used_at }) => (
                  <ChipCard
                    key={chip_name}
                    title={chip_name}
                    used_at={used_at}
                    isAvailble={!transferStats.isUnlimited}
                  />
                ))}
              </div>
            )}
            <div className="relative bg-emerald-600 p-6 rounded-2xl flex flex-col justify-between min-h-[700px] shadow-inner border-4 border-emerald-700">
              {["GK", "DEF", "MID", "FWD"].map((pos) => (
                <div key={pos} className="flex flex-wrap justify-center gap-4">
                  {getLineupWithEmpty(pos).map((p, i) =>
                    p ? (
                      <div
                        key={p.player_id}
                        onClick={() => handleRemovePlayerFromSquad(p)}
                        className="cursor-pointer hover:scale-105 transition-transform"
                      >
                        <PlayerLinupCard player={p} />
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="size-16 rounded-full border-2 border-dashed border-white/20 bg-black/5 flex items-center justify-center text-white/40 text-xs font-bold"
                      >
                        {pos}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}