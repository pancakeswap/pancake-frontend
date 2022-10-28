import { Box, lightColors, Progress, Text } from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  totalTicketsDistributed: number
  maxSupply: number
  totalSupplyMinted: number
}

const saleProgressTextMapping = (t: ContextApi['t'], saleStatus: SaleStatusEnum, remaining: string, total: string) => {
  const data = {
    remaining,
    total,
  }

  switch (saleStatus) {
    case SaleStatusEnum.Pending:
    case SaleStatusEnum.Premint:
      return ''
    case SaleStatusEnum.Presale:
      return t('%remaining% of %total% remaining', data)
    case SaleStatusEnum.Sale:
      return t('%remaining% of %total% remaining', data)
    case SaleStatusEnum.DrawingRandomness:
      return t('Randomizing NFT allocation with Chainlink', data)
    case SaleStatusEnum.Claim:
      return t('%remaining% of %total% claimed', data)
    default:
      return ''
  }
}

const SaleProgress: React.FC<React.PropsWithChildren<PreEventProps>> = ({
  t,
  saleStatus,
  totalTicketsDistributed,
  totalSupplyMinted,
  maxSupply,
}) => {
  const displaySaleProgress = saleStatus > SaleStatusEnum.Premint
  const isClaimingPhase = saleStatus === SaleStatusEnum.Claim
  const supplyRemaining = maxSupply - totalTicketsDistributed
  const remainingTickets = isClaimingPhase ? totalSupplyMinted : supplyRemaining
  const supplyRemainingPercentage = Math.round((remainingTickets / maxSupply) * 100)
  const isMintCompleted = totalSupplyMinted === maxSupply && isClaimingPhase
  return displaySaleProgress ? (
    <Box mb="24px">
      {isMintCompleted && (
        <Text color={lightColors.warning} mb="40px" bold>
          {t('Claiming Complete!')}
        </Text>
      )}
      <Text color={lightColors.invertedContrast} mb="24px" bold>
        {isMintCompleted
          ? t('All 10,000 Pancake Squad NFTs have now been minted!')
          : saleProgressTextMapping(t, saleStatus, remainingTickets.toString(), maxSupply.toString())}
      </Text>
      {!isMintCompleted && (
        <Progress
          variant="round"
          primaryStep={isClaimingPhase ? supplyRemainingPercentage : 100 - supplyRemainingPercentage}
          useDark={false}
        />
      )}
    </Box>
  ) : null
}

export default SaleProgress
