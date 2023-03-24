import { useTranslation } from '@pancakeswap/localization'
import { Text, Link } from '@pancakeswap/uikit'

const XCADWarning = () => {
  const { t } = useTranslation()

  // Break translation sentences into pieces because the current translation approach doesn't support Link interpolation.
  return (
    <>
      <Text>
        {t('XCAD is now using a new bridge provider and has migrated to a new XCAD token on BSC.')}
        <br />
        {t(
          'You can obtain the new token either by swapping your old tokens on PancakeSwap or bridging them to ETH and back to BSC using the new bridge provider.',
        )}
        <br />
        {t('For more info, click')}{' '}
        <Link
          style={{ display: 'inline' }}
          external
          href="https://blog.xcadnetwork.com/xcad-network-bsc-token-migration-wormhole-partnership-3c73aaabe4ba"
        >
          {t('here')}
        </Link>
        <br />
        <Link external href="https://bscscan.com/token/0xa026ad2ceda16ca5fc28fd3c72f99e2c332c8a26">
          {t('New token contract address')}.
        </Link>
      </Text>
    </>
  )
}

export default XCADWarning
