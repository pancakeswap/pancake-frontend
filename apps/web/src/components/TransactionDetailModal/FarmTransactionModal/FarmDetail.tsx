import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, RefreshIcon, ScanLink, Text, WarningIcon } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { useMemo } from 'react'
import { ChainLinkSupportChains } from 'state/info/constant'
import { FarmTransactionStatus, CrossChainFarmTransactionStep } from 'state/transactions/actions'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { chains } from 'utils/wagmi'

interface HarvestDetailProps {
  status?: FarmTransactionStatus
  step: CrossChainFarmTransactionStep
}

const FarmDetail: React.FC<React.PropsWithChildren<HarvestDetailProps>> = ({ step, status }) => {
  const { t } = useTranslation()
  const isFail = step.status === FarmTransactionStatus.FAIL
  const isLoading = step.status === FarmTransactionStatus.PENDING
  const chainInfo = useMemo(() => chains.find((chain) => chain.id === step.chainId), [step])
  const isOneOfTheStepFail = status === FarmTransactionStatus.FAIL && isLoading

  return (
    <Flex mb="16px" justifyContent="space-between">
      <Flex>
        <ChainLogo width={20} height={20} chainId={step.chainId} />
        <Text fontSize="14px" ml="8px">
          {chainInfo?.name}
        </Text>
      </Flex>
      {!isOneOfTheStepFail && (
        <Box>
          {isLoading ? (
            <Flex>
              <Text color="textSubtle" bold fontSize="14px">
                {t('Loading')}
              </Text>
              <RefreshIcon ml="5px" color="textSubtle" spin />
            </Flex>
          ) : (
            <Flex>
              {isFail && <WarningIcon mr="4px" color="failure" />}
              {step.tx && (
                <ScanLink
                  useBscCoinFallback={ChainLinkSupportChains.includes(step.chainId)}
                  href={getBlockExploreLink(step.tx, 'transaction', step.chainId)}
                >
                  {getBlockExploreName(step.chainId)}
                </ScanLink>
              )}
            </Flex>
          )}
        </Box>
      )}
    </Flex>
  )
}

export default FarmDetail
