import React from 'react'
import { Box, Progress, Text } from '@pancakeswap/uikit'
import { BigNumber } from '@ethersproject/bignumber'
import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  totalTicketsDistributed: BigNumber
  maxSupply: BigNumber
  totalSupplyMinted: BigNumber
}

const SaleProgressTextMapping: Record<SaleStatusEnum, string> = {
  [SaleStatusEnum.Pending]: '',
  [SaleStatusEnum.Presale]: '%remaining% of %total% remaining',
  [SaleStatusEnum.Sale]: '%remaining% of %total% remaining',
  [SaleStatusEnum.DrawingRandomness]: 'Randomizing NFT allocation with Chainlink',
  [SaleStatusEnum.Premint]: '%remaining% of %total% minted',
  [SaleStatusEnum.Claim]: '%remaining% of %total% minted',
}

const SaleProgress: React.FC<PreEventProps> = ({ t, saleStatus, totalSupplyMinted, maxSupply }) => {
  const displaySaleProgress = saleStatus !== SaleStatusEnum.Pending
  const supplyRemaining = maxSupply.sub(totalSupplyMinted)
  const supplyRemainingPercentage = Number(supplyRemaining.div(maxSupply).toString())
  const isMintCompleted = totalSupplyMinted === maxSupply && saleStatus === SaleStatusEnum.Claim
  return displaySaleProgress ? (
    <Box mb="24px">
      {isMintCompleted && (
        <Text color="warning" mb="40px" bold>
          {t('Mint Complete')}
        </Text>
      )}
      <Text color="invertedContrast" mb="24px" bold>
        {isMintCompleted
          ? t('All 10,000 Pancake Squad NFTs have now been minted!')
          : t(SaleProgressTextMapping[saleStatus], {
              remaining: supplyRemaining.toString(),
              total: maxSupply.toString(),
            })}
      </Text>
      {!isMintCompleted && <Progress variant="round" primaryStep={supplyRemainingPercentage} />}
    </Box>
  ) : null
}

export default SaleProgress
