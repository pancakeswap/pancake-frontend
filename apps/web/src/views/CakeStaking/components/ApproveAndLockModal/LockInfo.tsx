import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import { FlexGap, Text, TokenImage } from '@pancakeswap/uikit'

type LockInfoProps = {
  amount: string
  week: string | number
}

export const LockInfo: React.FC<LockInfoProps> = ({ amount, week }) => {
  const { t } = useTranslation()
  return (
    <FlexGap gap="4px" width="100%" alignItems="center" justifyContent="center">
      <TokenImage
        src={`https://pancakeswap.finance/images/tokens/${CAKE[ChainId.BSC].address}.png`}
        height={20}
        width={20}
        title={CAKE[ChainId.BSC].symbol}
      />
      <Text fontSize="14px">{`${amount} CAKE`}</Text>

      <Text fontSize={12} color="textSubtle">
        {t('to be locked')}
      </Text>

      <Text fontSize="14px">{t('%week% weeks', { week })}</Text>
    </FlexGap>
  )
}
