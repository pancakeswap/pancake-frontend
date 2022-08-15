import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  ButtonProps,
  MetamaskIcon,
  TrustWalletIcon,
  CoinbaseWalletIcon,
  TokenPocketIcon,
} from '@pancakeswap/uikit'
import { registerToken, canRegisterToken } from '../../utils/wallet'

export enum AddToWalletTextOptions {
  NO_TEXT,
  TEXT,
  TEXT_WITH_ASSET,
}

export interface AddToWalletButtonProps {
  tokenAddress: string
  tokenSymbol: string
  tokenDecimals: number
  tokenLogo: string
  textOptions?: AddToWalletTextOptions
  marginTextBetweenLogo?: string
}

const getWalletIcon = (marginTextBetweenLogo: string) => {
  const iconProps = {
    width: '16px',
    ...(marginTextBetweenLogo && { ml: marginTextBetweenLogo }),
  }
  if (window?.ethereum?.isTrust) {
    return <TrustWalletIcon {...iconProps} />
  }
  if (window?.ethereum?.isCoinbaseWallet) {
    return <CoinbaseWalletIcon {...iconProps} />
  }
  if (window?.ethereum?.isTokenPocket) {
    return <TokenPocketIcon {...iconProps} />
  }
  if (window?.ethereum?.isMetaMask) {
    return <MetamaskIcon {...iconProps} />
  }
  return null
}

const getWalletName = () => {
  if (window?.ethereum?.isTrust) {
    return 'Trust Wallet'
  }
  if (window?.ethereum?.isCoinbaseWallet) {
    return 'Coinbase Wallet'
  }
  if (window?.ethereum?.isTokenPocket) {
    return 'TokenPocket Wallet'
  }
  if (window?.ethereum?.isMetaMask) {
    return 'Metamask'
  }
  return null
}

const AddToWalletButton: React.FC<React.PropsWithChildren<AddToWalletButtonProps & ButtonProps>> = ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenLogo,
  textOptions = AddToWalletTextOptions.NO_TEXT,
  marginTextBetweenLogo = '0px',
  ...props
}) => {
  const { t } = useTranslation()

  if (!canRegisterToken()) return null
  return (
    <Button {...props} onClick={() => registerToken(tokenAddress, tokenSymbol, tokenDecimals, tokenLogo)}>
      {textOptions !== AddToWalletTextOptions.NO_TEXT &&
        (textOptions === AddToWalletTextOptions.TEXT
          ? t('Add to %wallet%', { wallet: getWalletName() })
          : t('Add %asset% to %wallet%', { asset: tokenSymbol, wallet: getWalletName() }))}
      {getWalletIcon(marginTextBetweenLogo)}
    </Button>
  )
}

export default AddToWalletButton
