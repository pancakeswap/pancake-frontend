import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'
import { ErrorIcon, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import dayjs from 'dayjs'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { CSSProperties, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'

import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { GaugeIdentifierDetails } from '../GaugesTable/List'
import { PercentInput } from './PercentInput'
import { MaxVote, UserVote } from './types'

const ListItemContainer = styled(FlexGap)<{ borderBottom?: boolean }>`
  border-bottom: ${({ borderBottom = true, theme }) =>
    borderBottom ? `1px solid ${theme.colors.cardBorder}` : 'none'};
`

type Props = {
  style?: CSSProperties
  data: GaugeVoting
  vote?: UserVote
  onChange: (value: MaxVote | UserVote) => void
}

export function VoteListItem({ style, data, vote, onChange, ...props }: Props & SpaceProps) {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { balance: veCake } = useVeCakeBalance()

  const userVote = useUserVote(data)
  const voteDisabled = userVote?.voteLocked
  const powerPercent = useMemo(() => {
    return userVote?.power ? new Percent(userVote?.power, 10000).toSignificant(2) : undefined
  }, [userVote?.power])

  const onMax = () => {
    onChange('MAX_VOTE')
  }

  const voteValue = useMemo(() => {
    if (voteDisabled) return powerPercent ?? ''
    return vote?.power ?? ''
  }, [voteDisabled, powerPercent, vote?.power])
  const votesAmount = useMemo(() => {
    const p = Number(voteValue || 0) * 100
    const amount = getBalanceNumber(veCake.times(p).div(10000))
    return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
  }, [veCake, voteValue])

  useEffect(() => {
    if (voteDisabled && !vote?.power) {
      onChange({
        power: voteValue,
        locked: true,
      })
    }
  }, [onChange, vote?.power, voteDisabled, voteValue])

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
                  distance: userVote?.lastVoteTime
                    ? dayjs.unix(userVote?.lastVoteTime).add(10, 'day').from(currentTimestamp, true)
                    : '',
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
          onUserInput={(v) => onChange({ ...vote, power: v })}
        />
      </Flex>
    </ListItemContainer>
  )
}
