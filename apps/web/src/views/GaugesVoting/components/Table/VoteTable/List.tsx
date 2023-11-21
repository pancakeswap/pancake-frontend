import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Percent } from '@pancakeswap/sdk'
import { SpaceProps } from 'styled-system'
import { ErrorIcon, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import dayjs from 'dayjs'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useEffect, useMemo, CSSProperties } from 'react'
import { Address } from 'viem'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useGaugeConfig } from 'views/GaugesVoting/hooks/useGaugePair'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'

import { PercentInput } from './PercentInput'
import { GaugeIdentifierDetails } from '../GaugesTable/List'

const ListItemContainer = styled(FlexGap)<{ borderBottom?: boolean }>`
  border-bottom: ${({ borderBottom = true, theme }) =>
    borderBottom ? `1px solid ${theme.colors.cardBorder}` : 'none'};
`

type Props = {
  style?: CSSProperties
  data: GaugeVoting
  value: string
  onChange: (value: string) => void
}

export function VoteListItem({ style, data, value, onChange, ...props }: Props & SpaceProps) {
  const { t } = useTranslation()
  const { balance: veCake } = useVeCakeBalance()

  const userVote = useUserVote(data)
  const voteDisabled = userVote?.voteLocked
  const powerPercent = useMemo(() => {
    return userVote?.power ? new Percent(userVote?.power, 10000).toSignificant(2) : undefined
  }, [userVote?.power])

  const onMax = () => {
    onChange('100')
  }

  const voteValue = useMemo(() => {
    if (voteDisabled) return powerPercent ?? ''
    return value ?? ''
  }, [voteDisabled, powerPercent, value])
  const votesAmount = useMemo(() => {
    const p = Number(voteValue || 0) * 100
    const amount = getBalanceNumber(veCake.times(p).div(10000))
    return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
  }, [veCake, voteValue])

  useEffect(() => {
    if (voteDisabled && !value) {
      onChange(voteValue)
    }
  }, [onChange, value, voteDisabled, voteValue])

  return (
    <ListItemContainer gap="1em" flexDirection="column" padding="1em" style={style} {...props}>
      <GaugeIdentifierDetails data={data} />
      <Flex justifyContent="space-between" alignSelf="stretch">
        <Text>{t('My Votes')}</Text>
        <FlexGap gap="0.25em" alignItems="center">
          {userVote?.voteLocked ? (
            <Tooltips
              content={t(
                'Gauge’s vote can not be changed more frequent than 10 days. You can update your vote for this gauge in: %distance%',
                {
                  distance: userVote?.lastVoteTime ? dayjs.unix(userVote?.lastVoteTime).add(10, 'day').fromNow() : '',
                },
              )}
            >
              <ErrorIcon height="20px" color="warning" mb="-2px" mr="2px" />
            </Tooltips>
          ) : null}
          <Text>{votesAmount} veCAKE</Text>
        </FlexGap>
      </Flex>
      <Flex alignSelf="stretch">
        <PercentInput
          style={{ width: '100%' }}
          disabled={voteDisabled}
          inputProps={{ disabled: voteDisabled }}
          onMax={onMax}
          value={voteValue}
          onUserInput={onChange}
        />
      </Flex>
    </ListItemContainer>
  )
}
