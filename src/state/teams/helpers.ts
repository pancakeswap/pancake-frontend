import merge from 'lodash/merge'
import { getContract } from 'utils/web3'
import pancakeProfileAbi from 'config/abi/pancakeProfile.json'
import teamsList from 'config/constants/teams'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { Team } from 'config/constants/types'
import makeBatchRequest from 'utils/makeBatchRequest'
import { TeamsById, TeamResponse } from 'state/types'

const profileContract = getContract(pancakeProfileAbi, getPancakeProfileAddress())

export const getTeam = async (teamId: number): Promise<Team> => {
  try {
    const {
      0: teamName,
      2: numberUsers,
      3: numberPoints,
      4: isJoinable,
    } = await profileContract.methods.getTeamProfile(teamId).call()
    const staticTeamInfo = teamsList.find((staticTeam) => staticTeam.id === teamId)

    return merge({}, staticTeamInfo, {
      isJoinable,
      name: teamName,
      users: numberUsers,
      points: numberPoints,
    })
  } catch (error) {
    return null
  }
}

/**
 * Gets on-chain data and merges it with the existing static list of teams
 */
export const getTeams = async (): Promise<TeamsById> => {
  try {
    const teamsById = teamsList.reduce((accum, team) => {
      return {
        ...accum,
        [team.id]: team,
      }
    }, {})
    const nbTeams = await profileContract.methods.numberTeams().call()
    const calls = []

    for (let i = 1; i <= nbTeams; i++) {
      calls.push(profileContract.methods.getTeamProfile(i).call)
    }

    const teamData = (await makeBatchRequest(calls)) as TeamResponse[]
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
