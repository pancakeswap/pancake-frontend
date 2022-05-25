import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from 'components/Divider'
import { Ifo, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import ProgressStepper from './ProgressStepper'
import TotalPurchased from './TotalPurchased'
import TotalAvailableClaim from './TotalAvailableClaim'
import ReleasedTokenInfo from './ReleasedTokenInfo'
import IfoVestingFooter from './IfoVestingFooter'

interface IfoVestingCardProps {
  poolId: PoolIds
  ifo: Ifo
  isLoading: boolean
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const IfoVestingCard: React.FC<IfoVestingCardProps> = ({ poolId, ifo, isLoading, publicIfoData, walletIfoData }) => {
  const { t } = useTranslation()
  const { token } = ifo

  return (
    <Flex flexDirection="column">
      <Box>
        <ProgressStepper publicIfoData={publicIfoData} />
        <TotalPurchased ifo={ifo} poolId={poolId} walletIfoData={walletIfoData} />
        <ReleasedTokenInfo />
        <Divider />
        <TotalAvailableClaim ifo={ifo} />
        <Text mb="24px" color="textSubtle" fontSize="14px">
          {t('You’ve already claimed %amount% %symbol%', { symbol: token.symbol, amount: '52.1234' })}
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
