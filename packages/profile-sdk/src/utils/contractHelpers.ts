import { ethers, Contract } from "ethers";
import erc721Abi from "../abi/erc721.json";
import profileABI from "../abi/pancakeProfile.json";
import { getPancakeProfileAddress } from "./addressHelpers";

const getContract = (abi: string, address: string, provider: ethers.providers.Provider): Contract => {
  return new ethers.Contract(address, abi, provider);
};

export const getErc721Contract = (address: string, provider: ethers.providers.Provider): Contract => {
  return getContract(erc721Abi as unknown as string, address, provider);
};

export const getProfileContract = (provider: ethers.providers.Provider, chainId: number): Contract => {
  return getContract(profileABI as unknown as string, getPancakeProfileAddress(chainId), provider);
};
