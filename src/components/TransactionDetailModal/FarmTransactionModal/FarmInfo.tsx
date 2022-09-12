import { Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { TransactionDetails } from 'state/transactions/reducer'
import { FarmTransactionStatus } from 'state/transactions/actions'

interface FarmInfoProps {
  pickedData?: TransactionDetails
}

const FarmPending: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()
  const { type, nonBscFarm } = pickedData
  const { amount, lpSymbol } = nonBscFarm
  const title = type === 'non-bsc-farm-stake' ? t('Staking') : t('Unstaking')

  return (
    <Box mb="24px">
      <Box>
        <Text as="span">{title}</Text>
        <Text bold as="span" m="0 4px">
          {`${amount} ${lpSymbol}`}
        </Text>
        <Text as="span">{t('in progress..')}</Text>
      </Box>
      <Text as="span" ml="4px">
        {t('It might take a couple of minutes for the cross-chain tx to confirm.')}
      </Text>
    </Box>
  )
}

const FarmResult: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()
  const { type, nonBscFarm } = pickedData
  const { amount, lpSymbol } = nonBscFarm
  const text = type === 'non-bsc-farm-stake' ? t('Token have been staked in the Farm!') : t('Token have been unstaked!')

  return (
    <Box mb="24px">
      <Text bold as="span">
        {`${amount} ${lpSymbol}`}
      </Text>
      <Text ml="4px" as="span">
        {text}
      </Text>
    </Box>
  )
}

const FarmError: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()
  const { type, nonBscFarm } = pickedData
  const { amount, lpSymbol } = nonBscFarm
  const text = type === 'non-bsc-farm-stake' ? t('The attempt to stake') : t('The attempt to unstake')
  const isFirstStepError = nonBscFarm.steps.find(
    (step) => step.step === 1 && step.status === FarmTransactionStatus.FAIL,
  )

  return (
    <Box mb="24px">
      {isFirstStepError ? (
        <Box>
          <Text bold as="span">
            {`${amount} ${lpSymbol}`}
          </Text>
          <Text as="span" ml="4px">
            {/* TODO: NonBSCFarm confirm wording */}
            {t('fail to stake, here shows the reason why and suggest what to do.')}
          </Text>
        </Box>
      ) : (
        <Box>
          <Text as="span">{text}</Text>
          <Text bold as="span" m="0 4px">
            {`${amount} ${lpSymbol}`}
          </Text>
          <Text as="span">{t('did not succeed on the BNB Chain side. Please copy the')}</Text>
          <Text bold as="span" m="0 4px">
            {t('Transaction ID')}
          </Text>
          <Text as="span">{t('below and look for assistance from our helpful Community Admins or Chefs.')}</Text>
        </Box>
      )}
    </Box>
  )
}

const FarmInfo: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  const { status } = pickedData.nonBscFarm
  if (status === FarmTransactionStatus.FAIL) {
    return <FarmError pickedData={pickedData} />
  }

  if (status === FarmTransactionStatus.PENDING) {
    return <FarmPending pickedData={pickedData} />
  }

  return <FarmResult pickedData={pickedData} />
}

export default FarmInfo
