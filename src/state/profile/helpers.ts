import { Profile, Team } from 'state/types'

export type ProfileResponse = {
  0: string
  1: string
  2: string
  3: string
  4: string
  5: boolean
}

export const transformProfileResponse = (profileResponse: ProfileResponse): Partial<Profile> => {
  const { 0: userId, 1: numberPoints, 2: teamId, 3: nftAddress, 4: tokenId, 5: isActive } = profileResponse

  return {
    userId: Number(userId),
    numberPoints: Number(numberPoints),
    teamId: Number(teamId),
    tokenId: Number(tokenId),
    nftAddress,
    isActive,
  }
}

export type TeamResponse = {
  0: string
  1: string
  2: string
  3: string
  4: boolean
}

export const transformTeamResponse = (teamResponse: TeamResponse): Team => {
  const { 0: teamName, 1: teamDescription, 2: numberUsers, 3: numberPoints, 4: isJoinable } = teamResponse

  return {
    name: teamName,
    description: teamDescription,
    users: Number(numberUsers),
    points: Number(numberPoints),
    isJoinable,
  }
}
