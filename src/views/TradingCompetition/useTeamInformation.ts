import { useState, useEffect } from 'react'

export const useTeamInformation = (competitionId: number) => {
  const profileApiUrl = process.env.NEXT_PUBLIC_API_PROFILE
  const [globalLeaderboardInformation, setGlobalLeaderboardInformation] = useState(null)

  // 1. Storm
  const [team1LeaderboardInformation, setTeam1LeaderboardInformation] = useState({ teamId: 1, leaderboardData: null })
  // 2. Flippers
  const [team2LeaderboardInformation, setTeam2LeaderboardInformation] = useState({ teamId: 2, leaderboardData: null })
  // 3. Cakers
  const [team3LeaderboardInformation, setTeam3LeaderboardInformation] = useState({ teamId: 3, leaderboardData: null })

  useEffect(() => {
    const fetchGlobalLeaderboardStats = async () => {
      const res = await fetch(`${profileApiUrl}/api/leaderboard/${competitionId}/global`)
      const data = await res.json()
      setGlobalLeaderboardInformation(data)
    }

    const fetchTeamsLeaderboardStats = async (teamId: number, callBack: (data: any) => void) => {
      try {
        const res = await fetch(`${profileApiUrl}/api/leaderboard/${competitionId}/team/${teamId}`)
        const data = await res.json()
        callBack(data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchTeamsLeaderboardStats(1, (data) =>
      setTeam1LeaderboardInformation((prevState) => {
        return { ...prevState, leaderboardData: data }
      }),
    )
    fetchTeamsLeaderboardStats(2, (data) =>
      setTeam2LeaderboardInformation((prevState) => {
        return { ...prevState, leaderboardData: data }
      }),
    )
    fetchTeamsLeaderboardStats(3, (data) =>
      setTeam3LeaderboardInformation((prevState) => {
        return { ...prevState, leaderboardData: data }
      }),
    )
    fetchGlobalLeaderboardStats()
  }, [
    profileApiUrl,
    competitionId,
    setTeam1LeaderboardInformation,
    setTeam2LeaderboardInformation,
    setTeam3LeaderboardInformation,
  ])

  return {
    team1LeaderboardInformation,
    team2LeaderboardInformation,
    team3LeaderboardInformation,
    globalLeaderboardInformation,
  }
}
