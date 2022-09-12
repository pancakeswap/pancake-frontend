import { useCallback, useMemo } from 'react'
import { ChainId, Token } from '@pancakeswap/sdk'
import { BigNumber } from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import useToast from 'hooks/useToast'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import useCatchTxError from 'hooks/useCatchTxError'
import styled from 'styled-components'
import { FlexGap } from 'components/Layout/Flex'
import { TokenPairImage } from 'components/TokenImage'
import {
  Modal,
  InjectedModalProps,
  Flex,
  Box,
  Text,
  Button,
  Message,
  MessageText,
  ArrowForwardIcon,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { getBalanceAmount } from 'utils/formatBalance'
import { LightGreyCard } from 'components/Card'
import Balance from 'components/Balance'
import { ToastDescriptionWithTx } from 'components/Toast'
import useNonBscHarvestFarm from 'views/Farms/hooks/useNonBscHarvestFarm'
import { farmFetcher } from '../../../../apis/farms/src/helper'

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

interface MultiChainHarvestModalProp extends InjectedModalProps {
  pid: number
  token: Token
  quoteToken: Token
  earningsBigNumber: BigNumber
  earningsBusd: number
}

const MultiChainHarvestModal: React.FC<MultiChainHarvestModalProp> = ({
  pid,
  token,
  quoteToken,
  earningsBigNumber,
  earningsBusd,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { chainId } = useActiveWeb3React()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { onReward } = useNonBscHarvestFarm(pid)
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const displayBalance = getBalanceAmount(earningsBigNumber)
  const isBscNetwork = useMemo(() => chainId === ChainId.BSC, [chainId])

  const handleCancel = useCallback(() => {
    onDismiss?.()
  }, [])

  const handleSwitchNetwork = () => {
    const isTestnet = farmFetcher.isTestnet(chainId)
    const switchedChainId = isTestnet ? ChainId.BSC_TESTNET : ChainId.BSC
    switchNetworkAsync(switchedChainId)
  }

  const handleHarvest = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => onReward())
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )
      handleCancel()
    }
  }, [t, onReward, fetchWithCatchTxError, toastSuccess, handleCancel])

  return (
    <Modal
      title={isBscNetwork ? t('Harvest now!') : t('Switch chain to harvest')}
      style={{ maxWidth: '340px' }}
      onDismiss={handleCancel}
    >
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" mb="16px">
          <TokenWrapper>
            <TokenPairImage
              width={40}
              height={40}
              variant="inverted"
              primaryToken={token}
              secondaryToken={quoteToken}
            />
          </TokenWrapper>
          <Text bold fontSize="24px">
            {t('CAKE-BNB')}
          </Text>
        </Flex>
        {!isBscNetwork && (
          <Message mb="16px" variant="warning" icon={false} p="8px 12px">
            <MessageText>
              <FlexGap gap="12px">
                <FlexGap gap="6px">
                  <ChainLogo chainId={chainId} /> <ArrowForwardIcon color="#D67E0A" />
                  <ChainLogo chainId={ChainId.BSC} />
                </FlexGap>
                <span>{t('Harvest on BNB Smart Chain')}</span>
              </FlexGap>
            </MessageText>
          </Message>
        )}
        <LightGreyCard padding="16px">
          <Box mb="8px">
            <Text fontSize="12px" color="secondary" bold as="span">
              {t('CAKE')}
            </Text>
            <Text fontSize="12px" color="textSubtle" ml="4px" bold as="span">
              {t('Earned')}
            </Text>
          </Box>
          <Box>
            <Balance bold decimals={5} fontSize="20px" lineHeight="110%" value={displayBalance?.toNumber()} />
            <Balance
              mb="16px"
              prefix="~"
              unit=" USD"
              decimals={2}
              value={earningsBusd}
              fontSize="12px"
              color="textSubtle"
            />
            {isBscNetwork ? (
              <Button
                width="100%"
                variant="secondary"
                disabled={isPending}
                endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
                onClick={handleHarvest}
              >
                {isPending ? t('Harvesting') : t('Harvest')}
              </Button>
            ) : (
              <Button width="100%" variant="secondary" onClick={handleSwitchNetwork}>
                {t('Switch to BNB Smart Chain')}
              </Button>
            )}
          </Box>
        </LightGreyCard>
      </Flex>
    </Modal>
  )
}

export default MultiChainHarvestModal
