import { Percent } from '@pancakeswap/sdk'
import styled from 'styled-components'
import { memo, useMemo } from 'react'
import { Box, RowBetween, Text, Flex, CalculateIcon, IconButton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { formatPercent } from '@pancakeswap/utils/formatFractions'
import { AutoCompoundTag } from './Tags'

interface Props {
  apr: Percent
  boostedApr?: Percent
  withCakeReward?: boolean
  autoCompound?: boolean
  onAprClick?: () => void
}

const AprText = styled(Text)<{ lineThrough?: boolean; underline?: boolean }>`
  text-underline-offset: 0.125em;

  text-decoration: ${(props) =>
    props.lineThrough || props.underline
      ? [props.underline ? 'dashed underline' : '', props.lineThrough ? 'solid line-through' : ''].join(' ')
      : 'none'};
`

export const YieldInfo = memo(function YieldInfo({ apr, boostedApr, withCakeReward, autoCompound, onAprClick }: Props) {
  const { t } = useTranslation()

  const aprToHighlight = boostedApr || apr
  const aprToCompare =
    boostedApr && apr ? (
      <AprText color="text" lineThrough ml="0.25em">
        {formatPercent(apr)}%
      </AprText>
    ) : null

  const earning = useMemo(() => (withCakeReward ? ['CAKE', t('Fees')].join(' + ') : t('Fees')), [withCakeReward, t])

  return (
    <Box>
      <RowBetween>
        <Text>{t('APR')}:</Text>
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <AprText color="success" bold underline>
            {formatPercent(aprToHighlight)}%
          </AprText>
          {aprToCompare}
          <IconButton variant="text" scale="sm" onClick={onAprClick}>
            <CalculateIcon color="textSubtle" ml="0.25em" width="1.5em" />
          </IconButton>
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
