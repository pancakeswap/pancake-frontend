import merge from 'lodash/merge'
import { getContract } from 'utils/erc20'
import pancakeProfileAbi from 'config/abi/pancakeProfile.json'
import teamsList from 'config/constants/teams'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { Team } from 'config/constants/types'
import multicall from 'utils/multicall'
import { TeamsById } from 'state/types'


export const getTeam = async (teamId: number): Promise<Team> => {
  const profileContract = getContract(getPancakeProfileAddress(), pancakeProfileAbi)
  try {
    const {
      0: teamName,
      2: numberUsers,
      3: numberPoints,
      4: isJoinable,
    } = await profileContract.getTeamProfile(teamId)
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
export const getTeams = async (): Promise<TeamsById> => {
  const profileContract = getContract(getPancakeProfileAddress(), pancakeProfileAbi)

  try {
    const teamsById = teamsList.reduce((accum, team) => {
      return {
        ...accum,
        [team.id]: team,
      }
    }, {})
    const nbTeams = await profileContract.numberTeams()
    const calls = []

    for (let i = 1; i <= nbTeams; i++) {
      calls.push({
        address: getPancakeProfileAddress(),
        name: 'getTeamProfile',
        params: [i]
      })
    }
    const teamData = await multicall(pancakeProfileAbi, calls)
    const onChainTeamData = teamData.reduce((accum, team, index) => {
      const { 0: teamName, 2: numberUsers, 3: numberPoints, 4: isJoinable } = team

      return {
        ...accum,
        [index + 1]: {
          name: teamName,
          users: Number(numberUsers),
          points: Number(numberPoints),
          isJoinable,
        },
      }
    }, {})

    return merge({}, teamsById, onChainTeamData)
  } catch (error) {
    return null
  }
}
