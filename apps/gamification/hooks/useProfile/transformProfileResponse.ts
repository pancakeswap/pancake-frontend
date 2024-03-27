import { ContractProfileResponse, Profile } from './type'

export const transformProfileResponse = (profileResponse: undefined | ContractProfileResponse): Partial<Profile> => {
  if (!profileResponse) {
    return {
      userId: 0,
      points: 0,
      teamId: 0,
      tokenId: 0,
      collectionAddress: '0x',
      isActive: false,
    }
  }

  return {
    userId: Number(profileResponse[0]),
    points: Number(profileResponse[1]),
    teamId: Number(profileResponse[2]),
    tokenId: Number(profileResponse[4]),
    collectionAddress: profileResponse[3],
    isActive: profileResponse[5],
  }
}
