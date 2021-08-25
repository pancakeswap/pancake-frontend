import React from 'react'
import { Link, Text } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import truncateWalletAddress from 'utils/truncateWalletAddress'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
}

const DescriptionWithTx: React.FC<DescriptionWithTxProps> = ({ description, txHash }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <>
      {description && <Text as="p">{description}</Text>}
      {txHash && (
        <Link external href={getBscScanLink(txHash, 'transaction', chainId)}>
          {t('View on BscScan:')} {truncateWalletAddress(txHash, 8, 0)}
        </Link>
      )}
    </>
  )
}

export default DescriptionWithTx
