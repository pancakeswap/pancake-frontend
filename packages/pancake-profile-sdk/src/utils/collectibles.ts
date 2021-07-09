import { ethers } from "ethers";
import Nfts, { nftSources } from "../constants/nfts";
import { IPFS_GATEWAY } from "../constants/common";
import { Nft, NftUriData } from "../types";
import { getNftAddress } from "./addressHelpers";
import { getErc721Contract } from "./contractHelpers";

/**
 * Gets the identifier key based on the nft address
 * Helpful for looking up the key when all you have is the address
 */
export const getIdentifierKeyFromAddress = (nftAddress: string, chainId: number): string | null => {
  const nftSource = Object.values(nftSources).find((nftSourceEntry) => {
    const address = getNftAddress(nftSourceEntry.address, chainId);
    return address === nftAddress;
  });

  return nftSource ? nftSource.identifierKey : null;
};

/**
 * Some sources like Pancake do not return HTTP tokenURI's
 */
export const getTokenUrl = (tokenUri: string): string => {
  if (tokenUri.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY}/ipfs/${tokenUri.slice(7)}`;
  }

  return tokenUri;
};

export const getTokenUriData = async (
  nftAddress: string,
  tokenId: number,
  provider: ethers.providers.JsonRpcProvider
): Promise<NftUriData | null> => {
  try {
    const contract = getErc721Contract(nftAddress, provider);
    const tokenUri = await contract.tokenURI(tokenId);
    const uriDataResponse = await fetch(getTokenUrl(tokenUri));

    if (!uriDataResponse.ok) {
      return null;
    }

    const uriData: NftUriData = await uriDataResponse.json();
    return uriData;
  } catch (error) {
    console.error("getTokenUriData", error);
    return null;
  }
};

export const getNftByTokenId = async (
  nftAddress: string,
  tokenId: number,
  provider: ethers.providers.JsonRpcProvider,
  chainId: number
): Promise<Nft | null> => {
  const uriData = await getTokenUriData(nftAddress, tokenId, provider);
  const identifierKey = getIdentifierKeyFromAddress(nftAddress, chainId);

  // Bail out early if we have no uriData, identifierKey, or the value does not
  // exist in the object
  if (!uriData) {
    return null;
  }

  if (!identifierKey) {
    return null;
  }

  if (!uriData[identifierKey]) {
    return null;
  }

  return Nfts.find((nft) => {
    return uriData[identifierKey].includes(nft.identifier);
  });
};
