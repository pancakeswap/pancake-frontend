import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const CommitButton = ({ children, ...props }: ButtonProps) => {
  const { isWrongNetwork } = useActiveChainId()
  const { t } = useTranslation()

  let childrenOrWrongNetworkText = children

  if (isWrongNetwork) {
    childrenOrWrongNetworkText = t('Wrong Network')
  }

  return <Button {...props}>{childrenOrWrongNetworkText}</Button>
}
