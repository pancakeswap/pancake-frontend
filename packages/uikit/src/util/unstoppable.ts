// import UD resolution JS Library
import Resolution from "@unstoppabledomains/resolution";

/**
 * Function: Reverse Resolve Domain Name
 * Takes string public address as input
 * outputs an Unstoppable Domain name ** if Reverse Resolution has been enabled on the UD user side
 * @param {string} publicAddress - a wallet's address
 */
export async function reverseResolveUD(publicAddress: string) {
  const unstoppableResolution = new Resolution();
  const domain = await unstoppableResolution.reverse(publicAddress);
  return domain;
}
