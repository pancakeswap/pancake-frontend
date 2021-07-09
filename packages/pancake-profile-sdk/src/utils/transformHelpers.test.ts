import {
  transformProfileResponse,
  getAchievementTitle,
  getAchievementDescription,
  ProfileResponse,
} from "./transformHelpers";
import { Campaign } from "../types";

describe("transformHelpers", () => {
  it("transformProfileResponse returns correct profile data", () => {
    const rawProfileResponse: ProfileResponse = {
      0: "123",
      1: "500",
      2: "2",
      3: "0x12345",
      4: "15",
      5: true,
    };
    const profile = transformProfileResponse(rawProfileResponse);
    expect(profile).toEqual({
      userId: 123,
      points: 500,
      teamId: 2,
      tokenId: 15,
      nftAddress: "0x12345",
      isActive: true,
    });
  });

  describe("getAchievementTitle", () => {
    it("returns correct title for IFO", () => {
      const campaign: Campaign = {
        id: "55666",
        type: "ifo",
        title: "Belt",
      };
      const title = getAchievementTitle(campaign);
      expect(title).toEqual({
        id: 999,
        fallback: "IFO Shopper: Belt",
        data: {
          name: "Belt",
        },
      });
    });
    it("returns default title for other campaign types", () => {
      const campaign: Campaign = {
        id: "55666",
        type: "teambattle",
        title: "Easter Gold",
      };
      const title = getAchievementTitle(campaign);
      expect(title).toBe("Easter Gold");
    });
    it("returns 'Unidentified campaign <campaignId>' title if campaign is not found in config", () => {
      const title = getAchievementTitle(undefined, "1234");
      expect(title).toBe("Unidentified campaign 1234");
    });
  });

  describe("getAchievementDescription", () => {
    it("returns correct description for IFO", () => {
      const campaign: Campaign = {
        id: "55666",
        type: "ifo",
        title: "Belt",
      };
      const description = getAchievementDescription(campaign);
      expect(description).toEqual({
        id: 999,
        fallback: "Committed more than $5 worth of LP in the Belt IFO",
        data: {
          name: "Belt",
        },
      });
    });
    it("returns default description for other campaign types", () => {
      const campaign: Campaign = {
        id: "55666",
        type: "teambattle",
        title: "Easter Gold",
        description: "Random description",
      };
      const description = getAchievementDescription(campaign);
      expect(description).toBe("Random description");
    });
    it("returns 'Achievement metadata is not found' description if campaign is not found in config", () => {
      const description = getAchievementDescription(undefined);
      expect(description).toBe("Achievement metadata is not found");
    });
  });
});
