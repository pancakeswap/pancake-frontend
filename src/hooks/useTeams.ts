import { useEffect, useState } from 'react'
import { useToast } from 'state/hooks'
import { TeamResponse, transformTeamResponse } from 'state/profile/helpers'
import { Team } from 'state/types'
import { getProfileContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'

const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>(null)
  const { toastError } = useToast()

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const contract = getProfileContract()
        const nbTeams = await contract.methods.numberTeams().call()
        const calls = []

        for (let i = 1; i <= nbTeams; i++) {
          calls.push(contract.methods.getTeamProfile(i).call)
        }

        const teamData = await makeBatchRequest(calls)
        const transformedTeams = teamData.map((team, index) => ({
          id: index + 1,
          ...transformTeamResponse(team as TeamResponse),
        }))

        setTeams(transformedTeams)
      } catch (error) {
        toastError('Error', 'Unable to fetch team list')
      }
    }

    fetchTeams()
  }, [setTeams, toastError])

  return teams
}

export default useTeams
