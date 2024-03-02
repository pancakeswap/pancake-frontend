import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Heading, ModalBody, ModalCloseButton, ModalHeader, ModalTitle, Text } from '@pancakeswap/uikit'
import MenuItem from '@pancakeswap/uikit/components/MenuItem/MenuItem'
import { ChainLogo } from '@pancakeswap/widgets-internal'
import { useState } from 'react'
import { styled } from 'styled-components'
import { chainNameConverter } from 'utils/chainNameConverter'
import { chains } from 'utils/wagmi'
import { Dot } from 'views/Notifications/styles'

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`
const FilterdNetworkWrapper = styled(Box)<{ showFilterNetworks: boolean }>`
  position: absolute;
  width: 100%;
  background: white;
  height: 100%;
  z-index: 1000;
  transition: bottom 0.3s ease-in-out;
  bottom: ${({ showFilterNetworks }) => (!showFilterNetworks ? '-100%' : '-15%')};
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  box-shadow: 6px 6px 6px 10px rgba(74, 74, 104, 0.1);
`
const NetworkFilterOverlay = styled(Box)<{ showFilterNetworks: boolean }>`
  position: absolute;
  width: 100%;
  background-color: #f7f2ff;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ showFilterNetworks }) => (!showFilterNetworks ? '0' : '0.7')};
`

export interface NetworksFilterPopupProps {
  setActiveChain: (chainId: ChainId) => void
  activeChain: ChainId
  filternetworksOnClick: () => void
}

export default function NetworksFilterPopup({
  filternetworksOnClick,
  activeChain,
  setActiveChain,
}: NetworksFilterPopupProps) {
  const [showFilternetworks, setShowFilternetworks] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <>
      <NetworkFilterOverlay showFilterNetworks={showFilternetworks} onClick={filternetworksOnClick} />
      <FilterdNetworkWrapper showFilterNetworks={showFilternetworks}>
        <ModalHeader>
          <ModalTitle>
            <Heading>{t('Token by network')}</Heading>
          </ModalTitle>
          <ModalCloseButton onDismiss={filternetworksOnClick} />
        </ModalHeader>
        <StyledModalBody>
          <>
            {chains
              .filter((chain) => {
                if ('testnet' in chain && chain.testnet) {
                  return false
                }
                if (chain.id === 56) return true
                return true
              })
              .map((chain) => {
                const isActive = activeChain !== chain.id
                return (
                  <MenuItem
                    key={chain.id}
                    // @ts-ignore
                    style={{ justifyContent: 'space-between', marginLeft: '-16px' }}
                    onClick={() => {
                      setActiveChain(chain.id)
                      filternetworksOnClick()
                    }}
                  >
                    <Box display="flex">
                      <ChainLogo chainId={chain.id} />
                      <Text color={chain.id === 56 ? 'secondary' : 'text'} bold={chain.id === 56} pl="12px">
                        {chainNameConverter(chain.name)}
                      </Text>
                    </Box>

                    {!isActive && (
                      <Box>
                        <Dot style={{ height: '8px', width: '8px' }} show color="success" className="dot" />
                      </Box>
                    )}
                  </MenuItem>
                )
              })}
          </>
        </StyledModalBody>
      </FilterdNetworkWrapper>
    </>
  )
}
