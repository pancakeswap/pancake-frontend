import { TeamsById } from '../state/types'
import teamsList from '../config/constants/teams'

export const teamsById: TeamsById = teamsList.reduce((accum, team) => {
  return {
    ...accum,
    [team.id]: team,
  }
}, {})
