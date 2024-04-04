import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Link, Text } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { GiftTooltip } from 'components/GiftTooltip/GiftTooltip'
import { TokenPairImage } from 'components/TokenImage'
import { Address, isAddressEqual } from 'viem'
import { bsc } from 'viem/chains'

const { FarmTokenInfo } = FarmWidget.FarmTable

export const FarmCell: React.FunctionComponent<
  React.PropsWithChildren<FarmWidget.FarmTableFarmTokenInfoProps & { chainId?: number; lpAddress?: Address }>
> = ({
  token,
  quoteToken,
  label,
  pid,
  isReady,
  isStaking,
  merklLink,
  hasBothFarmAndMerkl,
  merklApr,
  lpAddress,
  chainId,
}) => {
  const { t } = useTranslation()
  return (
    <Flex alignItems="center">
      <FarmTokenInfo
        pid={pid}
        label={label}
        token={token}
        quoteToken={quoteToken}
        isReady={isReady}
        isStaking={isStaking}
        merklLink={merklLink}
        hasBothFarmAndMerkl={hasBothFarmAndMerkl}
        merklApr={merklApr}
      >
        <TokenPairImage width={40} height={40} variant="inverted" primaryToken={token} secondaryToken={quoteToken} />
      </FarmTokenInfo>
      {chainId === bsc.id && lpAddress && isAddressEqual(lpAddress, '0xdD82975ab85E745c84e497FD75ba409Ec02d4739') ? (
        <GiftTooltip>
          <Box>
            <Text lineHeight="110%" as="span">
              {t('Stake CAKE, Earn PEPE in our')}
              <Link ml="4px" lineHeight="110%" display="inline !important" href="/pools?chain=bsc" target="_blank">
                PEPE Syrup Pool
              </Link>
              .
            </Text>
            <br />
            <br />
            <Text lineHeight="110%" as="span">
              {t(
                "If more PEPE-BNB LP is deposited in our Farm, we'll increase rewards for the PEPE Syrup Pool next month",
              )}
            </Text>
            .
          </Box>
        </GiftTooltip>
      ) : null}
    </Flex>
  )
}
