import { Flex, Message, MessageText, ModalContainer, ModalV2, InfoFilledIcon } from '@pancakeswap/uikit'
import { useCallback, useMemo, useState } from 'react'
import '@kyberswap/pancake-liquidity-widgets/dist/style.css'
import { useTheme } from 'styled-components'
import { useWalletClient } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTransactionAdder } from 'state/transactions/hooks'
import { Pool } from '@pancakeswap/v3-sdk'
import { Currency } from '@pancakeswap/sdk'
import dynamic from 'next/dynamic'
import noop from 'lodash/noop'

interface ZapLiquidityProps {
  tickLower?: number
  tickUpper?: number
  pool?: Pool | null
  baseCurrency?: Currency | null
  quoteCurrency?: Currency | null
}

const LiquidityWidget = dynamic(
  () => import('@kyberswap/pancake-liquidity-widgets').then((mod) => mod.LiquidityWidget),
  { ssr: false },
)

const ZapLiquidityWidget: React.FC<ZapLiquidityProps> = ({
  tickLower,
  tickUpper,
  pool,
  baseCurrency,
  quoteCurrency,
}) => {
  const { t } = useTranslation()

  const { isDark } = useTheme()

  const { account, chainId } = useActiveWeb3React()

  const { data: walletClient } = useWalletClient()

  const addTransaction = useTransactionAdder()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const poolAddress = useMemo(() => pool && Pool.getAddress(pool.token0, pool.token1, pool.fee), [pool])

  const handleOnDismiss = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleOnClick = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleTransaction = useCallback(
    (txHash: string) => {
      addTransaction(
        { hash: txHash },
        {
          type: 'zap-liquidity-v3',
          summary: `Zap in for ${baseCurrency?.symbol} - ${quoteCurrency?.symbol}`,
          translatableSummary: {
            text: 'Zap in for %lpSymbol%',
            data: { lpSymbol: `${baseCurrency?.symbol} - ${quoteCurrency?.symbol}` },
          },
        },
      )
      setIsModalOpen(false)
    },
    [addTransaction, baseCurrency?.symbol, quoteCurrency?.symbol],
  )

  return (
    <>
      <Message variant="primary" padding="8px" icon={<InfoFilledIcon color="secondary" />}>
        <Flex flexDirection="column" style={{ gap: 8 }}>
          <MessageText lineHeight="120%" fontSize={16}>
            {t('Try Zap V3 to automatically balance the deposit tokens while adding V3 liquidity.')}
          </MessageText>
          <span
            onClick={handleOnClick}
            role="presentation"
            style={{ whiteSpace: 'nowrap', textDecoration: 'underline', cursor: 'pointer' }}
          >
            <MessageText fontWeight={600} fontSize={16}>
              {t('Click here to start')} {'>>'}
            </MessageText>
          </span>
        </Flex>
      </Message>

      <ModalV2 closeOnOverlayClick isOpen={isModalOpen} onDismiss={handleOnDismiss}>
        <ModalContainer>
          <LiquidityWidget
            onConnectWallet={noop}
            walletClient={walletClient}
            account={account ?? undefined}
            networkChainId={chainId}
            chainId={chainId}
            initTickLower={tickLower ? +tickLower : undefined}
            initTickUpper={tickUpper ? +tickUpper : undefined}
            poolAddress={poolAddress ?? '0x'}
            theme={isDark ? 'dark' : 'light'}
            feePcm={pool?.fee}
            onDismiss={handleOnDismiss}
            onTxSubmit={handleTransaction}
            source="zap-widget-demo"
          />
        </ModalContainer>
      </ModalV2>
    </>
  )
}

export default ZapLiquidityWidget
