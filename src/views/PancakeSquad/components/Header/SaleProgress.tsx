import React from 'react'
import { Box, lightColors, Progress, Text } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  totalTicketsDistributed: number
  maxSupply: number
  totalSupplyMinted: number
}

const SaleProgressTextMapping: Record<SaleStatusEnum, string> = {
  [SaleStatusEnum.Pending]: '',
  [SaleStatusEnum.Premint]: '',
  [SaleStatusEnum.Presale]: '%remaining% of %total% remaining',
  [SaleStatusEnum.Sale]: '%remaining% of %total% remaining',
  [SaleStatusEnum.DrawingRandomness]: 'Randomizing NFT allocation with Chainlink',
  [SaleStatusEnum.Claim]: '%remaining% of %total% minted',
}

const SaleProgress: React.FC<PreEventProps> = ({
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
          : t(SaleProgressTextMapping[saleStatus], {
              remaining: remainingTickets.toString(),
              total: maxSupply.toString(),
            })}
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
