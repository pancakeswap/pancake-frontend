import { Text, Flex, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const CannotBidMessage: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { tooltip, targetRef, tooltipVisible } = useTooltip(
    <>
      <Text mb="16px">{t('Only whitelisted project wallets can bid in the auction to create Community Farms.')}</Text>
      <Text mb="16px">{t('Bidding is only possible while the auction is live.')}</Text>
      <Text>
        {t(
          'If you’re sure your project should be able to bid in this auction, make sure you’re connected with the correct (whitelisted) wallet.',
        )}
      </Text>
    </>,
    { placement: 'bottom' },
  )
  return (
    <Flex justifyContent="center" alignItems="center">
      <Text color="textSubtle" small mr="8px">
        {t('Why cant I bid for a farm?')}
      </Text>
      <span ref={targetRef}>
        <HelpIcon color="textSubtle" height="16px" width="16px" />
      </span>
      {tooltipVisible && tooltip}
    </Flex>
  )
}

export default CannotBidMessage
