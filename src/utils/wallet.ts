// Set of helper functions to facilitate wallet setup

import { ExternalProvider } from '@ethersproject/providers'
import { ChainId } from '@pancakeswap/sdk'
import { BAD_SRCS } from 'components/Logo/Logo'
import { BASE_BSC_SCAN_URLS } from 'config'
import { BSC_RPC_URLS, BSC_TESTNET_RPC_URLS } from '../config/constants/rpc'

const NETWORK_CONFIG = {
  [ChainId.BSC]: {
    name: 'BNB Smart Chain Mainnet',
    scanURL: BASE_BSC_SCAN_URLS[ChainId.BSC],
    rpcUrls: BSC_RPC_URLS,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB Smart Chain Testnet',
    scanURL: BASE_BSC_SCAN_URLS[ChainId.BSC_TESTNET],
    rpcUrls: BSC_TESTNET_RPC_URLS,
  },
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chainId?: number, externalProvider?: ExternalProvider) => {
  const provider = externalProvider || window.ethereum
  if (!NETWORK_CONFIG[chainId]) {
    console.error('Invalid chain id')
    return false
  }
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: NETWORK_CONFIG[chainId].name,
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'bnb',
                  decimals: 18,
                },
                rpcUrls: NETWORK_CONFIG[chainId].rpcUrls,
                blockExplorerUrls: [`${NETWORK_CONFIG[chainId].scanURL}/`],
              },
            ],
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error)
          return false
        }
      }
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenLogo?: string,
) => {
  // better leave this undefined for default image instead of broken image url
  const image = tokenLogo ? (BAD_SRCS[tokenLogo] ? undefined : tokenLogo) : undefined

  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image,
      },
    },
  })

  return tokenAdded
}

export const canRegisterToken = () =>
  typeof window !== 'undefined' &&
  (window?.ethereum?.isMetaMask ||
    window?.ethereum?.isTrust ||
    window?.ethereum?.isCoinbaseWallet ||
    window?.ethereum?.isTokenPocket)
