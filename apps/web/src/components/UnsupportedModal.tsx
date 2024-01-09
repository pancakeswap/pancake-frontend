import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import { AutoColumn, InjectedModalProps, Link, Modal, Text } from '@pancakeswap/uikit'
import { AutoRow } from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useUnsupportedTokens } from '../hooks/Tokens'

interface Props extends InjectedModalProps {
  currencies: (Currency | undefined)[]
}

export const UnsupportedModal: React.FC<React.PropsWithChildren<Props>> = ({ currencies, onDismiss }) => {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return wrappedCurrency(currency, chainId)
        })
      : []

  const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()

  return (
    <Modal title={t('Unsupported Assets')} onDismiss={onDismiss}>
      <AutoColumn gap="lg">
        {tokens.map((token) => {
          return (
            token &&
            unsupportedTokens &&
            Object.keys(unsupportedTokens).includes(token.address) && (
              <AutoColumn key={token.address?.concat('not-supported')} gap="12px">
                <AutoRow gap="5px" align="center">
                  <CurrencyLogo currency={token} size="24px" />
                  <Text>{token.symbol}</Text>
                </AutoRow>
                {chainId && (
                  <Link
                    external
                    small
                    color="primaryDark"
                    href={getBlockExploreLink(token.address, 'address', chainId)}
                  >
                    {token.address}
                  </Link>
                )}
              </AutoColumn>
            )
          )
        })}
        <AutoColumn gap="lg">
          <Text>
            {t(
              'Some assets are not available through this interface because they may not work well with our smart contract or we are unable to allow trading for legal reasons.',
            )}
          </Text>
        </AutoColumn>
      </AutoColumn>
    </Modal>
  )
}
