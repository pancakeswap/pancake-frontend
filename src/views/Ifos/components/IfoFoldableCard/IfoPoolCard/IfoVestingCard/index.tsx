import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from 'components/Divider'
import ProgressStepper from './ProgressStepper'
import TotalPurchased from './TotalPurchased'
import TotalAvailableClaim from './TotalAvailableClaim'
import ReleasedTokenInfo from './ReleasedTokenInfo'
import IfoVestingFooter from './IfoVestingFooter'

const IfoVestingCard: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Box>
        <ProgressStepper
          steps={[{ text: 'Sales ended' }, { text: 'Cliff' }, { text: 'Vesting end' }]}
          activeStepIndex={1}
        />
        <TotalPurchased />
        <ReleasedTokenInfo />
        <Divider />
        <TotalAvailableClaim />
        <Text mb="24px" color="textSubtle" fontSize="14px">
          You’ve already claimed 48.5733 XYZ
        </Text>
        <Button mb="24px" width="100%">
          Claim
        </Button>
      </Box>
      <IfoVestingFooter />
    </Flex>
  )
}

export default IfoVestingCard
