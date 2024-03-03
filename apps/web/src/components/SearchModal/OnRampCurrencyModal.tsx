import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import {
  Box,
  Button,
  Heading,
  InjectedModalProps,
  MODAL_SWIPE_TO_CLOSE_VELOCITY,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import MenuItem from '@pancakeswap/uikit/components/MenuItem/MenuItem'
import { ChainLogo } from '@pancakeswap/widgets-internal'
import isArray from 'lodash/isArray'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Field } from 'state/buyCrypto/actions'
import { styled } from 'styled-components'
import { chainNameConverter } from 'utils/chainNameConverter'
import { chains } from 'utils/wagmi'
import { Dot } from 'views/Notifications/styles'
import OnRampCurrencySearch from './OnRampCurrencySearch'

const Footer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
`

const StyledModalContainer = styled(ModalContainer)`
  width: 100%;
  min-width: 320px;
  max-width: 420px !important;
  min-height: calc(var(--vh, 1vh) * 90);
  ${({ theme }) => theme.mediaQueries.md} {
    min-height: auto;
  }
`

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
  box-shadow: 6px 20px 12px 8px rgba(74, 74, 104, 0.1);
`
const NetworkFilterOverlay = styled(Box)<{ showFilterNetworks: boolean }>`
  position: absolute;
  width: 100%;
  background-color: #e2d2ff;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ showFilterNetworks }) => (!showFilterNetworks ? '0' : '0.8')};
  pointer-events: ${({ showFilterNetworks }) => (showFilterNetworks ? 'auto' : 'none')};
`

export interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (field: Field, newCurrency: Currency) => void
  otherSelectedCurrency?: Currency | null
  tokensToShow?:
    | {
        symbol: string
        name: string
      }[]
    | Currency[]
  mode: string
}

export default function OnRampCurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  tokensToShow,
  mode,
}: CurrencySearchModalProps) {
  const [activeChain, setActiveChain] = useState<ChainId | undefined>(undefined)
  const [showFilternetworks, setShowFilternetworks] = useState<boolean>(false)

  const { t } = useTranslation()

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      const field = mode === 'onramp-fiat' ? Field.OUTPUT : Field.INPUT
      onCurrencySelect?.(field, currency)
      onDismiss?.()
    },
    [onDismiss, onCurrencySelect, mode],
  )

  const newTokens = useMemo(() => {
    if (!tokensToShow || !isArray(tokensToShow)) return []
    if ((!activeChain && tokensToShow) || mode === 'onramp-fiat') return tokensToShow
    return tokensToShow?.filter((token) => activeChain! === (token as Currency).chainId)
  }, [activeChain, tokensToShow, mode])

  const { isMobile } = useMatchBreakpoints()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  const filternetworksOnClick = useCallback(() => {
    setShowFilternetworks((f) => !f)
  }, [setShowFilternetworks])

  useEffect(() => {
    if (!wrapperRef.current) return
    setHeight(wrapperRef.current.offsetHeight - 330)
  }, [])

  return (
    <StyledModalContainer
      position="relative"
      drag={isMobile ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = 'none'
      }}
      // @ts-ignore
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss()
      }}
      ref={wrapperRef}
    >
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
              .map((chain, index: number) => {
                const isActive = activeChain === chain.id || (activeChain === undefined && index === 0)
                const rowText = index === 0 ? t('All Networks') : chainNameConverter(chain.name)
                const allNetworks = index === 0

                return (
                  <MenuItem
                    key={chain.id}
                    style={{ justifyContent: 'space-between', marginLeft: '-16px' }}
                    onClick={() => {
                      setActiveChain(allNetworks ? undefined : chain.id)
                      filternetworksOnClick()
                    }}
                  >
                    <Box display="flex">
                      {allNetworks ? (
                        <Image alt="pcs-logo-network-filter" src="/logo.png" width={24} height={24} />
                      ) : (
                        <ChainLogo chainId={chain.id} />
                      )}
                      <Text color={isActive ? 'text' : 'textSubtle'} bold={isActive} pl="12px">
                        {rowText}
                      </Text>
                    </Box>

                    {isActive && (
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

      <ModalHeader>
        <ModalTitle margin="12px">
          <Heading>{t('Select a Token to Purchase')}</Heading>
        </ModalTitle>
      </ModalHeader>
      <StyledModalBody>
        <OnRampCurrencySearch
          activeChain={activeChain}
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          height={height}
          tokensToShow={newTokens}
          mode={mode}
          onRampFlow
        />
        {mode !== 'onramp-fiat' && (
          <Footer>
            <Button scale="sm" variant="text" onClick={filternetworksOnClick} className="filter-networks-button">
              {t('Select Tokens by network')}
            </Button>
          </Footer>
        )}
      </StyledModalBody>
    </StyledModalContainer>
  )
}
