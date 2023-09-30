import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, BscScanIcon, CheckmarkCircleIcon, Link, Text } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import { Address } from 'viem'
import { StepTitleAnimationContainer } from './ApproveModalContent'
import { FadePresence } from './Logos'

interface SwaReceiptContents {
  getBlockExploreLink: (
    data: string | number,
    type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
    chainIdOverride?: number,
  ) => string
  getBlockExploreName: (
    chainIdOverride?: number,
  ) => 'BscScan' | 'Etherscan' | 'Blockscout' | 'opBNBScan' | 'PolygonScan' | 'zkExplorer' | 'Arbiscan' | 'Basescan'
  truncateHash: (address: string, startLength?: any, endLength?: any) => string
  txHash: string
  chainId: ChainId
  children: ReactNode
}
export const SwapTransactionReceiptModalContent = ({
  getBlockExploreLink,
  getBlockExploreName,
  truncateHash,
  txHash,
  chainId,
  children,
}: SwaReceiptContents) => {
  const { t } = useTranslation()

  return (
    <Box width="100%">
      <FadePresence>
        <Box margin="auto auto 22px auto" width="fit-content">
          <CheckmarkCircleIcon color="success" width={80} height={80} />
        </Box>
      </FadePresence>
      <AutoColumn justify="center">
        <StepTitleAnimationContainer gap="md">
          <Text bold textAlign="center">
            {t('Transaction receipt')}
          </Text>
          {chainId && (
            <Link external small href={getBlockExploreLink(txHash, 'transaction', chainId)}>
              {t('View on %site%', { site: getBlockExploreName(chainId) })}: {truncateHash(txHash, 8, 0)}
              {chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />}
            </Link>
          )}
        </StepTitleAnimationContainer>
        {children}
      </AutoColumn>
    </Box>
  )
}
