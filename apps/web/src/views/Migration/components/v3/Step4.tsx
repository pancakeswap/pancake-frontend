import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Percent, Token } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { AutoRow, Button, Card, Dots, Flex, Modal, ModalV2, PreTitle, Tag, Text, useModalV2 } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import { LightGreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { DoubleCurrencyLogo } from 'components/Logo'
import { Bound } from 'config/constants/types'
import { useToken } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useState } from 'react'
import PositionListItem from 'views/AddLiquidityV3/formViews/V3FormView/components/PoolListItem'
import { RangeTag } from 'components/RangeTag'
import { AddLiquidityV3Modal } from 'views/AddLiquidityV3/Modal'
import { unwrappedToken } from 'utils/wrappedCurrency'
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

  const removedPairsCurrentChainAndAccount = removedPairs[chainId as ChainId]?.[account]

  const removedPairsCurrentChainAsArray = Object.keys(removedPairsCurrentChainAndAccount || {})

  return (
    <AppBody style={{ maxWidth: '700px' }} m="auto">
      <AppHeader title={t('Your Liquidity')} subtitle={t('List of your liquidity positions')} />
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
                        {t('Min %minAmount%/ Max %maxAmount% %token% per %quoteToken%', {
                          minAmount: formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale),
                          maxAmount: formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale),
                          token: currencyBase?.symbol,
                          quoteToken: currencyQuote?.symbol,
                        })}
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
        <Modal title={t('List of removed v2 liquidity')} onDismiss={() => setOpen(false)}>
          <PreTitle color="subtle" mb="12px">
            {t('Previous LP')}
          </PreTitle>
          {removedPairsCurrentChainAsArray.map((tokenAddresses) => (
            <Flex key={tokenAddresses} alignItems="center" justifyContent="space-between" mb="8px">
              <PairSelection tokenAddresses={tokenAddresses} />
            </Flex>
          ))}
        </Modal>
      </ModalV2>
      <AtomBox p="24px">
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : removedPairsCurrentChainAsArray.length === 0 ? (
          <Button width="100%" disabled>
            {t('No Previous Removed LP')}
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

function PairSelection({ tokenAddresses }: { tokenAddresses: string }) {
  const [token0Address, token1Address] = tokenAddresses.split('-')
  const [token0, token1] = [useToken(token0Address), useToken(token1Address)]

  if (token0 && token1) {
    return <PairSelectionAddLiquidity token0={token0} token1={token1} />
  }

  return null
}

function PairSelectionAddLiquidity({ token0, token1 }: { token0: Token; token1: Token }) {
  const addLiquidityModal = useModalV2()
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
        <Button onClick={addLiquidityModal.onOpen}>{t('Add')}</Button>
      </Flex>
      <AddLiquidityV3Modal {...addLiquidityModal} token0={unwrappedToken(token0)} token1={unwrappedToken(token1)} />
    </LightGreyCard>
  )
}
