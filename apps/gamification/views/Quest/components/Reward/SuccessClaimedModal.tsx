import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Box, Button, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { TokenWithChain } from 'components/TokenWithChain'
import { useFindTokens } from 'hooks/useFindTokens'
import { useMemo } from 'react'
import { Address } from 'viem'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'

interface SuccessClaimedModalProps extends InjectedModalProps {
  reward: undefined | QuestRewardType
  rewardAmount: any
}

export const SuccessClaimedModal: React.FC<SuccessClaimedModalProps> = ({ reward, rewardAmount, onDismiss }) => {
  const { t } = useTranslation()
  const currency = useFindTokens(reward?.currency?.network as ChainId, reward?.currency?.address as Address)

  const amountDisplay = useMemo(() => {
    const balance = getBalanceNumber(new BigNumber(rewardAmount ?? 0), currency.decimals)
    return new BigNumber(balance).lt(0.01)
      ? '< 0.01'
      : getFullDisplayBalance(new BigNumber(rewardAmount ?? 0), currency.decimals, 2)
  }, [currency, rewardAmount])

  return (
    <Modal title="" headerBorderColor="transparent" onDismiss={onDismiss}>
      <Flex mt="-24px" flexDirection="column">
        <Flex flexDirection="column">
          <Box margin="auto" width="64px">
            <TokenWithChain currency={currency} width={64} height={64} />
          </Box>
          <Flex mt="8px" justifyContent="center">
            <Text lineHeight="24px" fontSize="28px" bold>
              {amountDisplay}
            </Text>
            <Text style={{ alignSelf: 'flex-end' }} fontSize="20px" bold ml="4px">
              {currency.symbol}
            </Text>
          </Flex>
        </Flex>
        <Text color="textSubtle" m="17px 0 24px 0">
          {t('The reward has been successfully claimed!')}
        </Text>
        <Button m="auto" maxWidth="100%" width="240px" onClick={onDismiss}>
          {t('Great')}
        </Button>
      </Flex>
    </Modal>
  )
}
