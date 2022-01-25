import { Campaign, TranslatableText, Profile } from "../types";

export type ProfileResponse = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: boolean;
};

export const transformProfileResponse = (profileResponse: ProfileResponse): Partial<Profile> => {
  const { 0: userId, 1: numberPoints, 2: teamId, 3: nftAddress, 4: tokenId, 5: isActive } = profileResponse;

  return {
    userId: Number(userId),
    points: Number(numberPoints),
    teamId: Number(teamId),
    tokenId: Number(tokenId),
    nftAddress,
    isActive,
  };
};

export const getAchievementTitle = (campaign?: Campaign, campaignId?: string): TranslatableText => {
  if (!campaign) {
    return `Unidentified campaign ${campaignId}`;
  }
  switch (campaign.type) {
    case "ifo":
      return {
        id: 999,
        fallback: `IFO Shopper: ${campaign.title}`,
        data: {
          name: campaign.title as string,
        },
      };
    default:
      return campaign.title;
  }
};

export const getAchievementDescription = (campaign?: Campaign): TranslatableText => {
  if (!campaign) {
    return "Achievement metadata is not found";
  }
  switch (campaign.type) {
    case "ifo":
      return {
        id: 999,
        fallback: `Committed more than $5 worth of LP in the ${campaign.title} IFO`,
        data: {
          name: campaign.title as string,
        },
      };
    default:
      return campaign.description;
  }
};
