import { ethers } from "ethers";
import { existingAddress1 } from "../../mocks/mockAddresses";

const getProfileContract = jest.fn(() => {
  return {
    hasRegistered: jest.fn((callAddress: string) => {
      if (callAddress === existingAddress1) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }),
    getUserProfile: jest.fn((callAddress: string) => {
      if (callAddress === existingAddress1) {
        return Promise.resolve({
          0: 123,
          1: 3000,
          2: 2,
          3: "0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07",
          4: 555,
          5: true,
        });
      }
      return Promise.resolve(null);
    }),
    getTeamProfile: jest.fn((teamId: number) => {
      if (teamId === 2) {
        return Promise.resolve({
          0: "Fearsome Flippers",
          2: ethers.BigNumber.from(77000),
          3: ethers.BigNumber.from(341500),
          4: true,
        });
      }
      return Promise.resolve(null);
    }),
  };
});

const getErc721Contract = jest.fn(() => {
  return {
    tokenURI: jest.fn(() => {
      return Promise.resolve("ipfs://QmYsTqbmGA3H5cgouCkh8tswJAQE1AsEko9uBZX9jZ3oTC/sleepy.json");
    }),
  };
});

module.exports = { getProfileContract, getErc721Contract };
