import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
// import { useTranslation } from 'contexts/Localization'
import Divider from 'components/Divider'
import { Ifo } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import ProgressStepper from './ProgressStepper'
import TotalPurchased from './TotalPurchased'
import TotalAvailableClaim from './TotalAvailableClaim'
import ReleasedTokenInfo from './ReleasedTokenInfo'
import IfoVestingFooter from './IfoVestingFooter'

interface IfoVestingCardProps {
  ifo: Ifo
  isLoading: boolean
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const IfoVestingCard: React.FC<IfoVestingCardProps> = ({ ifo, isLoading, publicIfoData, walletIfoData }) => {
  // const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Box>
        <ProgressStepper publicIfoData={publicIfoData} />
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
