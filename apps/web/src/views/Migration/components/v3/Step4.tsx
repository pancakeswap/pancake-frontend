import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Percent, Token } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { AutoRow, Button, Card, Dots, Flex, Modal, ModalV2, PreTitle, Tag, Text } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import { LightGreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { DoubleCurrencyLogo } from 'components/Logo'
import { Bound } from 'config/constants/types'
import { useToken } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { PairState, usePair } from 'hooks/usePairs'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useState } from 'react'
import PositionListItem from 'views/AddLiquidityV3/formViews/V3FormView/components/PoolListItem'
import RangeTag from 'views/AddLiquidityV3/formViews/V3FormView/components/RangeTag'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import AddLiquidityV3 from 'views/AddLiquidityV3'
import currencyId from 'utils/currencyId'
import useStableConfig from 'views/Swap/StableSwap/hooks/useStableConfig'
import { useAccount } from 'wagmi'
import { removedPairsAtom } from './Step2'

export function Step4() {
  const { address: account } = useAccount()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { chainId } = useActiveChainId()

  const { positions, loading: v3Loading } = useV3Positions(account)
  const [open, setOpen] = useState(false)

  const [removedPairs] = useAtom(removedPairsAtom)

  const removedPairsCurrentChain = removedPairs[chainId as ChainId]

  const removedPairsCurrentChainAsArray = Object.entries(removedPairsCurrentChain || {})

  return (
    <AppBody style={{ maxWidth: '700px' }} m="auto">
      <AppHeader title="Your Liquidity" subtitle="List of your liquidity positions" />
      <AtomBox bg="gradientCardHeader" style={{ minHeight: '400px' }} pt="16px" px="24px">
        {!account ? (
          <Text color="textSubtle" pt="24px" textAlign="center" bold fontSize="16px">
            {t('Connect to a wallet to view your liquidity.')}
          </Text>
        ) : v3Loading ? (
          <Text color="textSubtle" pt="24px" textAlign="center" bold fontSize="16px">
            <Dots>{t('Loading')}</Dots>
          </Text>
        ) : !positions?.length ? (
          <AtomBox textAlign="center" pt="24px">
            <Text color="textSubtle" textAlign="center" bold fontSize="16px">
              {t('No liquidity found.')}
            </Text>
            <Image src="/images/decorations/liquidity.png" width={174} height={184} alt="liquidity-image" />
          </AtomBox>
        ) : (
          positions.map((p) => (
            <PositionListItem key={p.tokenId.toString()} positionDetails={p}>
              {({
                currencyBase,
                currencyQuote,
                removed,
                outOfRange,
                priceLower,
                tickAtLimit,
                priceUpper,
                feeAmount,
              }) => (
                <Card mb="8px" mx="24px">
                  <Flex justifyContent="space-between" p="16px">
                    <Flex flexDirection="column">
                      <Flex alignItems="center" mb="4px">
                        <DoubleCurrencyLogo currency0={currencyQuote} currency1={currencyBase} size={20} />
                        <Text bold ml="8px">
                          {!currencyQuote || !currencyBase ? (
                            <Dots>{t('Loading')}</Dots>
                          ) : (
                            `${currencyQuote.symbol}/${currencyBase.symbol}`
                          )}
                        </Text>
                        <Tag ml="8px" variant="secondary" outline>
                          {new Percent(feeAmount, 1_000_000).toSignificant()}%
                        </Tag>
                      </Flex>
                      <Text fontSize="14px" color="textSubtle">
                        Min {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale)} / Max:{' '}
                        {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale)} {currencyQuote?.symbol} per{' '}
                        {currencyBase?.symbol}
                      </Text>
                    </Flex>

                    <RangeTag removed={removed} outOfRange={outOfRange} />
                  </Flex>
                </Card>
              )}
            </PositionListItem>
          ))
        )}
      </AtomBox>
      <ModalV2 isOpen={open} closeOnOverlayClick onDismiss={() => setOpen(false)}>
        <Modal title="List of removed v2 liquidity" onDismiss={() => setOpen(false)}>
          <PreTitle color="subtle" mb="12px">
            Previous LP
          </PreTitle>
          {removedPairsCurrentChainAsArray.map(([tokenAddresses, isV2]) => (
            <Flex key={tokenAddresses} alignItems="center" justifyContent="space-between" mb="8px">
              {isV2 ? (
                <V2PairSelection tokenAddresses={tokenAddresses} />
              ) : (
                <StablePairSelection tokenAddresses={tokenAddresses} />
              )}
            </Flex>
          ))}
        </Modal>
      </ModalV2>
      <AtomBox p="24px">
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : removedPairsCurrentChainAsArray.length === 0 ? (
          <Button width="100%" disabled>
            No Previous Removed LP
          </Button>
        ) : (
          <CommitButton onClick={() => setOpen(true)} width="100%">
            {t('Add Liquidity')}
          </CommitButton>
        )}
      </AtomBox>
    </AppBody>
  )
}

function V2PairSelection({ tokenAddresses }: { tokenAddresses: string }) {
  const [token0Address, token1Address] = tokenAddresses.split('-')
  const [token0, token1] = [useToken(token0Address), useToken(token1Address)]
  const [pairState] = usePair(token0, token1)

  if (pairState === PairState.EXISTS) {
    return <PairSelection token0={token0} token1={token1} />
  }

  return null
}

function StablePairSelection({ tokenAddresses }: { tokenAddresses: string }) {
  const [token0Address, token1Address] = tokenAddresses.split('-')
  const [token0, token1] = [useToken(token0Address), useToken(token1Address)]
  const stablePair = useStableConfig({ tokenA: token0, tokenB: token1 })

  if (stablePair) {
    return <PairSelection token0={token0} token1={token1} />
  }
  return null
}

function PairSelection({ token0, token1 }: { token0: Token; token1: Token }) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <LightGreyCard>
      <Flex alignItems="center" justifyContent="space-between">
        <AutoRow>
          <DoubleCurrencyLogo currency0={token0} currency1={token1} size={20} />
          <Text ml="8px" bold>
            {token0?.symbol}/{token1?.symbol}
          </Text>
        </AutoRow>
        <Button onClick={() => setIsOpen(true)}>Add</Button>
      </Flex>
      <ModalV2 isOpen={isOpen} onDismiss={() => setIsOpen(false)} closeOnOverlayClick>
        <Modal title={t('Add Liquidity')} onDismiss={() => setIsOpen(false)}>
          <LiquidityFormProvider>
            <AddLiquidityV3
              currencyIdA={currencyId(token0)}
              currencyIdB={currencyId(token1)}
              preferredSelectType={SELECTOR_TYPE.V3}
            />
          </LiquidityFormProvider>
        </Modal>
      </ModalV2>
    </LightGreyCard>
  )
}
