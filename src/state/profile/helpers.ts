import { Profile } from 'state/types'

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
    points: Number(numberPoints),
    teamId: Number(teamId),
    tokenId: Number(tokenId),
    nftAddress,
    isActive,
  }
}
