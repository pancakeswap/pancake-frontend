import { ChainId } from '@pancakeswap/chains'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import teamsList from 'config/constants/teams'
import { Team } from 'config/constants/types'
import fromPairs from 'lodash/fromPairs'
import merge from 'lodash/merge'
import { TeamsById } from 'state/types'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { getProfileContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'

export const getTeam = async (teamId: number): Promise<Team | null> => {
  try {
    const profileContract = getProfileContract()
    const {
      0: teamName,
      2: numberUsers,
      3: numberPoints,
      4: isJoinable,
    } = await profileContract.read.getTeamProfile([BigInt(teamId)])
    const staticTeamInfo = teamsList.find((staticTeam) => staticTeam.id === teamId)

    return merge({}, staticTeamInfo, {
      isJoinable,
      name: teamName,
      users: Number(numberUsers),
      points: Number(numberPoints),
    })
  } catch (error) {
    return null
  }
}

/**
 * Gets on-chain data and merges it with the existing static list of teams
 */
export const getTeams = async (): Promise<TeamsById | null> => {
  try {
    const profileContract = getProfileContract()
    const teamsById = fromPairs(teamsList.map((team) => [team.id, team]))
    const nbTeams = await profileContract.read.numberTeams()

    const calls = Array.from({ length: Number(nbTeams) }).map(
      (_, i) =>
        ({
          abi: pancakeProfileABI,
          address: getPancakeProfileAddress(),
          functionName: 'getTeamProfile',
          args: [BigInt(i + 1)] as const,
        } as const),
    )
    const client = publicClient({ chainId: ChainId.BSC })
    const teamData = await client.multicall({
      contracts: calls,
      allowFailure: false,
    })

    const onChainTeamData = fromPairs(
      teamData.map((team, index) => {
        const { 0: teamName, 2: numberUsers, 3: numberPoints, 4: isJoinable } = team

        return [
          index + 1,
          {
            name: teamName,
            users: Number(numberUsers),
            points: Number(numberPoints),
            isJoinable,
          },
        ]
      }),
    )

    return merge({}, teamsById, onChainTeamData)
  } catch (error) {
    return null
  }
}
