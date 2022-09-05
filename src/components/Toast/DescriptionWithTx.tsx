import { Link, Text } from '@pancakeswap/uikit'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from 'utils/truncateHash'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
  customizeChainId?: number
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({
  txHash,
  children,
  customizeChainId,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const supportChainId = customizeChainId ?? chainId

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={getBlockExploreLink(txHash, 'transaction', supportChainId)}>
          {t('View on %site%', { site: getBlockExploreName(supportChainId) })}: {truncateHash(txHash, 8, 0)}
        </Link>
      )}
    </>
  )
}

export default DescriptionWithTx
