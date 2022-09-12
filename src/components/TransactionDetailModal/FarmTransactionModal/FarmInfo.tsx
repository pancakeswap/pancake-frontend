import { Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { TransactionDetails } from 'state/transactions/reducer'

interface FarmInfoProps {
  pickedData?: TransactionDetails
}

const FarmPending: React.FC<React.PropsWithChildren<any>> = () => {
  const { t } = useTranslation()
  return (
    <Box mb="24px">
      <Box>
        <Text as="span">{t('Staking')}</Text>
        <Text bold as="span" m="0 4px">
          {t('1.345 LP')}
        </Text>
        <Text as="span">{t('in progress..')}</Text>
      </Box>
      <Text as="span" ml="4px">
        {t('It might take a couple of minutes for the cross-chain tx to confirm.')}
      </Text>
    </Box>
  )
}

const FarmResult: React.FC<React.PropsWithChildren<any>> = () => {
  const { t } = useTranslation()
  return (
    <Box mb="24px">
      <Text as="span">{t('Staked')}</Text>
      <Text bold as="span" ml="4px">
        {t('1.345 LP Token')}
      </Text>
    </Box>
  )
}

const FarmError: React.FC<React.PropsWithChildren<any>> = () => {
  const { t } = useTranslation()
  return (
    <Box mb="24px">
      <Box>
        <Text bold as="span">
          {t(`1.345 XXXX-YYY LP Token`)}
        </Text>
        <Text as="span" ml="4px">
          {t('fail to stake, here shows the reason why and suggest what to do.')}
        </Text>
      </Box>

      {/* <Box>
        <Text as="span">
          {t('The attempt to stake')}
        </Text>
        <Text bold as="span" m="0 4px">
          {t('1.345 XXXX-YYY LP Token ')}
        </Text>
        <Text as="span">
          {t('did not succeed on the BNB Chain side. Please copy the transaction ID below and look for assistance from our helpful Community Admins or Chefs.')}
        </Text>
      </Box> */}
    </Box>
  )
}

const FarmInfo: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  // <FarmError />
  // <FarmPending/>

  return <FarmResult />
}

export default FarmInfo
