import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Token } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { AutoRow, Button, Dots, Flex, Modal, ModalV2, PreTitle, Tag, Text, useModalV2 } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import { LightGreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { LiquidityCardRow } from 'components/LiquidityCardRow'
import { DoubleCurrencyLogo } from 'components/Logo'
import { RangeTag } from 'components/RangeTag'
import { useToken } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useState } from 'react'
import { unwrappedToken } from 'utils/wrappedCurrency'
import PositionListItem from 'views/AddLiquidityV3/formViews/V3FormView/components/PoolListItem'
import { AddLiquidityV3Modal } from 'views/AddLiquidityV3/Modal'
import { useAccount } from 'wagmi'
import { removedPairsAtom } from './Step2'

export function Step4() {
  const { address: account } = useAccount()
  const { t } = useTranslation()

  const { chainId } = useActiveChainId()

  const { positions, loading: v3Loading } = useV3Positions(account)
  const [open, setOpen] = useState(false)

  const [removedPairs] = useAtom(removedPairsAtom)

  const removedPairsCurrentChainAndAccount = removedPairs[chainId as ChainId]?.[account]

  const removedPairsCurrentChainAsArray = Object.keys(removedPairsCurrentChainAndAccount || {})

  const addLiquidityModal = useModalV2()

  const native = useNativeCurrency()

  return (
    <AppBody style={{ maxWidth: '700px' }} m="auto">
      <AppHeader title={t('Your Liquidity')} subtitle={t('List of your liquidity positions')} />
      <AtomBox bg="gradientCardHeader" style={{ minHeight: '400px' }} pt="16px" px="16px">
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
              {({ currencyBase, currencyQuote, removed, outOfRange, feeAmount, setInverted, subtitle }) => (
                <LiquidityCardRow
                  feeAmount={feeAmount}
                  currency0={currencyQuote}
                  currency1={currencyBase}
                  tokenId={p.tokenId}
                  pairText={
                    !currencyQuote || !currencyBase ? (
                      <Dots>{t('Loading')}</Dots>
                    ) : (
                      `${currencyQuote.symbol}-${currencyBase.symbol} LP`
                    )
                  }
                  tags={
                    <>
                      {p.isStaked && (
                        <Tag outline variant="warning" mr="8px">
                          Farming
                        </Tag>
                      )}
                      <RangeTag removed={removed} outOfRange={outOfRange} />
                    </>
                  }
                  subtitle={subtitle}
                  onSwitch={() => setInverted((prev) => !prev)}
                />
              )}
            </PositionListItem>
          ))
        )}
      </AtomBox>
      <ModalV2 isOpen={open} closeOnOverlayClick onDismiss={() => setOpen(false)}>
        <Modal title={t('List of removed v2 liquidity')} onDismiss={() => setOpen(false)}>
          <PreTitle mb="12px">{t('Previous LP')}</PreTitle>
          {removedPairsCurrentChainAsArray.map((tokenAddresses) => (
            <Flex key={tokenAddresses} alignItems="center" justifyContent="space-between" mb="8px">
              <PairSelection tokenAddresses={tokenAddresses} />
            </Flex>
          ))}
          <Button width="100%" onClick={addLiquidityModal.onOpen} mt="24px">
            {t('Add Other Pairs')}
          </Button>
        </Modal>
      </ModalV2>
      <AtomBox p="24px">
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : removedPairsCurrentChainAsArray.length === 0 ? (
          <>
            <Button width="100%" onClick={addLiquidityModal.onOpen}>
              {t('Add Liquidity')}
            </Button>
          </>
        ) : (
          <CommitButton onClick={() => setOpen(true)} width="100%">
            {t('Add Liquidity')}
          </CommitButton>
        )}
      </AtomBox>
      <AddLiquidityV3Modal {...addLiquidityModal} currency0={native} />
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
  const [currency0, currency1] = [unwrappedToken(token0), unwrappedToken(token1)]

  return (
    <LightGreyCard>
      <Flex alignItems="center" justifyContent="space-between">
        <AutoRow>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
          <Text ml="8px" bold>
            {currency0?.symbol}/{currency1?.symbol}
          </Text>
        </AutoRow>
        <Button onClick={addLiquidityModal.onOpen}>{t('Add')}</Button>
      </Flex>
      <AddLiquidityV3Modal {...addLiquidityModal} currency0={currency0} currency1={currency1} />
    </LightGreyCard>
  )
}
