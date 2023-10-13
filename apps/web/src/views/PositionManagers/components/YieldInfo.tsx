import { styled } from 'styled-components'
import { memo, useMemo } from 'react'
import { Box, RowBetween, Text, Flex, Skeleton, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { AutoCompoundTag } from './Tags'
import { AprResult } from '../hooks'

interface Props {
  apr: AprResult
  isAprLoading: boolean
  withCakeReward?: boolean
  autoCompound?: boolean
  onAprClick?: () => void
}

const AprText = styled(Text)`
  text-underline-offset: 0.125em;
  text-decoration: dotted underline;
`

export const YieldInfo = memo(function YieldInfo({ apr, isAprLoading, withCakeReward, autoCompound }: Props) {
  const { t } = useTranslation()

  const earning = useMemo(() => (withCakeReward ? ['CAKE', t('Fees')].join(' + ') : t('Fees')), [withCakeReward, t])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('Combined APR')}:{' '}
        <Text style={{ display: 'inline-block' }} bold>
          {`${apr.combinedApr}%`}
        </Text>
      </Text>
      <ul>
        <li>
          {t('CAKE APR')}:{' '}
          <Text style={{ display: 'inline-block' }} bold>
            {`${apr.cakeYieldApr}%`}
          </Text>
        </li>
        <li>
          {t('LP APR')}:{' '}
          <Text style={{ display: 'inline-block' }} bold>
            {apr.lpApr}%
          </Text>
        </li>
      </ul>
      <Text lineHeight="120%" mt="20px">
        {t('Calculated based on previous 7 days average data.')}
      </Text>
    </>,
    {
      placement: 'top',
    },
  )

  return (
    <Box>
      <RowBetween>
        <Text>{t('APR')}:</Text>
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          {apr && !isAprLoading ? (
            <AprText color="success" ref={targetRef} bold>
              {`${apr.combinedApr}%`}
              {tooltipVisible && tooltip}
            </AprText>
          ) : (
            <Skeleton width={50} height={20} />
          )}
        </Flex>
      </RowBetween>
      <RowBetween>
        <Text>{t('Earn')}:</Text>
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <Text color="text">{earning}</Text>
          {autoCompound && <AutoCompoundTag ml="0.5em" />}
        </Flex>
      </RowBetween>
    </Box>
  )
})
