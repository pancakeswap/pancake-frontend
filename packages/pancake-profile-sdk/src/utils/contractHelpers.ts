import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import erc721Abi from "../abi/erc721.json";
import profileABI from "../abi/pancakeProfile.json";
import { getPancakeProfileAddress } from "./addressHelpers";

const getContract = (abi: AbiItem, address: string, web3: Web3): Contract => {
  return new web3.eth.Contract(abi, address);
};

export const getErc721Contract = (address: string, web3?: Web3): Contract => {
  return getContract(erc721Abi as unknown as AbiItem, address, web3);
};

export const getProfileContract = (web3: Web3, chainId: number): Contract => {
  return getContract(profileABI as unknown as AbiItem, getPancakeProfileAddress(chainId), web3);
};
