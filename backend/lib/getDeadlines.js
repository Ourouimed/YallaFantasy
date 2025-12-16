const getDeadlines = (rounds)=>{
    const now = new Date()

    const sorted = rounds.sort(
        (a, b) => new Date(a.round_deadline) - new Date(b.round_deadline)
    )

    const nextRound = sorted.find(r => new Date(r.round_deadline) > now)
    const prevRound = [...sorted].reverse().find(r => new Date(r.round_deadline) <= now)

    return { nextRound, prevRound }
}

module.exports = { getDeadlines }
