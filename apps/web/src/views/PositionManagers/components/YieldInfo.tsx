import styled from 'styled-components'
import { memo, useMemo } from 'react'
import { Box, RowBetween, Text, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { AutoCompoundTag } from './Tags'

interface Props {
  apr: string
  withCakeReward?: boolean
  autoCompound?: boolean
  onAprClick?: () => void
}

const AprText = styled(Text)`
  text-underline-offset: 0.125em;
  text-decoration: dotted underline;
`

export const YieldInfo = memo(function YieldInfo({ apr, withCakeReward, autoCompound }: Props) {
  const { t } = useTranslation()

  const earning = useMemo(() => (withCakeReward ? ['CAKE', t('Fees')].join(' + ') : t('Fees')), [withCakeReward, t])

  return (
    <Box>
      <RowBetween>
        <Text>{t('APR')}:</Text>
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <AprText color="success" bold>
            {`${apr}%`}
          </AprText>
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
