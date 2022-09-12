import { useMemo } from 'react'
import styled from 'styled-components'
import { ChainId } from '@pancakeswap/sdk'
import { Flex, Box, Text, LinkExternal, RefreshIcon, WarningIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { chains } from 'utils/wagmi'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { FarmTransactionStatus, NonBscFarmTransactionStep } from 'state/transactions/actions'

const ChainContainer = styled(Flex)<{ chainId?: number }>`
  width: 147px;
  padding: 2px 7px;
  border-radius: 16px;
  background-color: ${({ chainId }) => (chainId ? ChainIdBackgroundColor[chainId] : '#14151A')};
`

const ChainIdBackgroundColor = {
  [ChainId.BSC]: '#14151A',
  [ChainId.BSC_TESTNET]: '#14151A',
  [ChainId.ETHEREUM]: '#627EEA',
  [ChainId.GOERLI]: '#627EEA',
}

interface HarvestDetailProps {
  step: NonBscFarmTransactionStep
}

const FarmDetail: React.FC<React.PropsWithChildren<HarvestDetailProps>> = ({ step }) => {
  const { t } = useTranslation()
  const isFail = step.status === FarmTransactionStatus.FAIL
  const isLoading = step.status === FarmTransactionStatus.PENDING
  const chainInfo = useMemo(() => chains.find((chain) => chain.id === step.chainId), [step])

  return (
    <Flex mb="16px" justifyContent="space-between">
      <ChainContainer>
        <ChainLogo width={20} height={20} chainId={step.chainId} />
        <Text color="white" fontSize="14px" ml="4px">
          {chainInfo?.name}
        </Text>
      </ChainContainer>
      <Box>
        {isLoading ? (
          <Flex>
            <Text color="textSubtle" bold fontSize="14px">
              {t('Loading')}
            </Text>
            <RefreshIcon ml="5px" color="textSubtle" spin />
          </Flex>
        ) : (
          <Box>
            {isFail ? (
              <WarningIcon color="failure" />
            ) : (
              <LinkExternal href={getBlockExploreLink(step.tx, 'transaction', step.chainId)}>
                {getBlockExploreName(step.chainId)}
              </LinkExternal>
            )}
          </Box>
        )}
      </Box>
    </Flex>
  )
}

export default FarmDetail
