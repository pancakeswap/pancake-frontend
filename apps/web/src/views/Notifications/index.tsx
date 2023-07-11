import { BottomDrawer, Flex, Modal, ModalV2, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useCallback, useContext, useEffect, useState } from 'react'
import AuthClient, { generateNonce } from "@walletconnect/auth-client";
// import { Web3Modal } from "@web3modal/standalone";
import { useWalletConnectClient } from 'contexts/PushContext'
import { useChainData } from 'contexts/ChainDataContext';
import Page from '../Page'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from '../Swap/styles'
import SignedInView from './components/SignedInForm/SignedInForm'
import DefaultView from './components/DefaultView/DefaultView';
import { useAccount } from 'wagmi';
import { DEFAULT_EIP155_METHODS, DEFAULT_EIP155_OPTIONAL_METHODS } from './utils/constants';
import { AccountAction } from './helpers';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


// 1. Get projectID at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

// 2. Configure web3Modal
// const web3Modal = new Web3Modal({
//   projectId,
//   walletConnectVersion: 2,
//   standaloneChains: ["eip155:1"],
// });

export default function Notifications() {
  const { connector, isConnected, address: account } = useAccount()
  

  return (
    <Page>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        {/* {isDesktop && (
          <HotTokenList handleOutputSelect={handleOutputSelect} />
        )} */}
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper>
              <AppBody>
            {account && <SignedInView strippedAddress={account} />}
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
