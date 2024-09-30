import { useTranslation } from '@pancakeswap/localization'
import { BscScanIcon, LinkExternal, LinkProps } from '@pancakeswap/uikit'
import { getBlockExploreLink } from '../../utils'

interface ViewOnExplorerButtonProps extends LinkProps {
  address: string
  chainId?: number
  type?: 'transaction' | 'token' | 'address' | 'block' | 'countdown'
  color?: string
  width?: string
}
export const ViewOnExplorerButton = ({
  address,
  chainId,
  color,
  width,
  type = 'address',
  ...props
}: ViewOnExplorerButtonProps) => {
  const { t } = useTranslation()

  return (
    <LinkExternal
      href={getBlockExploreLink(address, type, chainId)}
      target="_blank"
      rel="noopener noreferrer"
      title={t('View on Explorer')}
      showExternalIcon={false}
      {...props}
    >
      <BscScanIcon color={color} width={width} />
    </LinkExternal>
  )
}
