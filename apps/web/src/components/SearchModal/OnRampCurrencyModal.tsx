import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
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
  RowBetween,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { ChainLogo } from '@pancakeswap/widgets-internal'
import isArray from 'lodash/isArray'
import Image from 'next/image'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Field } from 'state/buyCrypto/actions'
import { styled } from 'styled-components'
import { chainNameConverter } from 'utils/chainNameConverter'
import { chains } from 'utils/wagmi'
import { PopOverScreenContainer } from 'views/BuyCrypto/components/PopOverScreen/PopOverScreen'
import { selectCurrencyField, type OnRampChainId as ChainId } from 'views/BuyCrypto/constants'
import type { FiatCurrency, OnRampUnit } from 'views/BuyCrypto/types'
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
const NetworkItem = styled(RowBetween)<{ selected: boolean }>`
  padding: 0px 20px;
  height: 48px;
  width: 100%;
  display: flex;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: pointer;
  }
  opacity: ${({ selected }) => (!selected ? 0.8 : 1)};
`

export interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | FiatCurrency | null
  onCurrencySelect: (field: Field, newCurrency: Currency) => void
  otherSelectedCurrency?: Currency | FiatCurrency | null
  tokensToShow?:
    | {
        symbol: string
        name: string
      }[]
    | Currency[]
  mode: string
  unit: OnRampUnit
}

interface NetworksPopOverProps {
  showFilterNetworks: boolean
  onClick: () => void
  setActiveChain: (c: ChainId | undefined) => void
  activeChain: ChainId | undefined
}

const SearchModalNetworkPopOver = ({
  showFilterNetworks,
  onClick,
  setActiveChain,
  activeChain,
}: NetworksPopOverProps) => {
  const { t } = useTranslation()
  return (
    <>
      <PopOverScreenContainer showPopover={showFilterNetworks} onClick={onClick}>
        <ModalHeader>
          <ModalTitle>
            <Heading>{t('Token by network')}</Heading>
          </ModalTitle>
          <ModalCloseButton onDismiss={onClick} />
        </ModalHeader>
        <StyledModalBody style={{ paddingLeft: '0px', paddingRight: '0px', paddingTop: '0px' }}>
          <>
            {[chains[0], ...chains]
              .filter((chain) => {
                if (('testnet' in chain && chain.testnet) || chain.id === 204) return false
                return true
              })
              .map((chain, index: number) => {
                const isActive = activeChain === chain.id || (activeChain === undefined && index === 0)
                const rowText = index === 0 ? t('All Networks') : chainNameConverter(chain.name)
                const allNetworks = index === 0

                return (
                  <NetworkItem
                    key={chain.id}
                    style={{ justifyContent: 'space-between' }}
                    onClick={() => {
                      setActiveChain(allNetworks ? undefined : chain.id)
                      onClick()
                    }}
                    selected={isActive}
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
                      <Box paddingRight="18px">
                        <Dot style={{ height: '12px', width: '12px' }} show color="success" className="dot" />
                      </Box>
                    )}
                  </NetworkItem>
                )
              })}
          </>
        </StyledModalBody>
      </PopOverScreenContainer>
    </>
  )
}

export default function OnRampCurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  tokensToShow,
  mode,
  unit,
}: CurrencySearchModalProps) {
  const [activeChain, setActiveChain] = useState<ChainId | undefined>(undefined)
  const [showFilternetworks, setShowFilternetworks] = useState<boolean>(false)

  const { t } = useTranslation()

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      const field = selectCurrencyField(unit, mode)
      onCurrencySelect?.(field, currency)
      onDismiss?.()
    },
    [onDismiss, onCurrencySelect, mode, unit],
  )

  const newTokens = useMemo(() => {
    if (!tokensToShow || !isArray(tokensToShow)) return []
    if ((!activeChain && tokensToShow) || mode === 'onramp-fiat') return tokensToShow
    return tokensToShow?.filter((token) => activeChain! === (token as Currency).chainId)
  }, [activeChain, tokensToShow, mode])

  const { isMobile } = useMatchBreakpoints()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filterNetworksOnClick = useCallback(() => {
    setShowFilternetworks((f) => !f)
  }, [setShowFilternetworks])

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
      <SearchModalNetworkPopOver
        onClick={filterNetworksOnClick}
        activeChain={activeChain}
        setActiveChain={setActiveChain}
        showFilterNetworks={showFilternetworks}
      />
      <ModalHeader>
        <ModalTitle margin="12px">
          <Heading>{mode === 'onramp-fiat' ? t('Select a currency') : t('Select a Token to Purchase')}</Heading>
        </ModalTitle>
      </ModalHeader>
      <StyledModalBody>
        <OnRampCurrencySearch
          activeChain={activeChain}
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          tokensToShow={newTokens}
          mode={mode}
          onRampFlow
        />
        {mode !== 'onramp-fiat' && (
          <Footer>
            <Button scale="sm" variant="text" onClick={filterNetworksOnClick} className="filter-networks-button">
              {t('Select Tokens by network')}
            </Button>
          </Footer>
        )}
      </StyledModalBody>
    </StyledModalContainer>
  )
}
