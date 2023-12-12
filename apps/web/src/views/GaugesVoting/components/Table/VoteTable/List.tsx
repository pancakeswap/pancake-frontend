import { useTranslation } from '@pancakeswap/localization'
import { ErrorIcon, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { CSSProperties, useMemo } from 'react'
import styled from 'styled-components'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'

import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { GaugeIdentifierDetails } from '../GaugesTable/List'
import { PercentInput } from './PercentInput'
import { useRowVoteState } from './hooks/useRowVoteState'
import { DEFAULT_VOTE, RowProps } from './types'

const ListItemContainer = styled(FlexGap)<{ borderBottom?: boolean }>`
  border-bottom: ${({ borderBottom = true, theme }) =>
    borderBottom ? `1px solid ${theme.colors.cardBorder}` : 'none'};
`

type Props = {
  style?: CSSProperties
} & RowProps

export function VoteListItem({ style, data, vote = { ...DEFAULT_VOTE }, onChange, ...props }: Props) {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const userVote = useUserVote(data)
  const { cakeLockedAmount } = useCakeLockStatus()
  const cakeLocked = useMemo(() => cakeLockedAmount > 0n, [cakeLockedAmount])
  const { currentVoteWeight, previewVoteWeight, voteValue, voteLocked, willUnlock, changeHighlight } = useRowVoteState({
    data,
    vote,
    onChange,
  })

  const onMax = () => {
    onChange(vote, true)
  }

  return (
    <ListItemContainer gap="1em" flexDirection="column" padding="1em" style={style} {...props}>
      <GaugeIdentifierDetails data={data} />
      <Flex justifyContent="space-between" alignSelf="stretch">
        <Text>{t('My Votes')}</Text>
        <FlexGap gap="0.25em" alignItems="center">
          {voteLocked ? (
            <Tooltips
              content={t(
                'Gauge’s vote can not be changed more frequent than 10 days. You can update your vote for this gauge in: %distance%',
                {
                  distance: userVote?.lastVoteTime
                    ? dayjs.unix(Number(userVote?.lastVoteTime)).add(10, 'day').from(dayjs.unix(currentTimestamp), true)
                    : '',
                },
              )}
            >
              <ErrorIcon height="20px" color="warning" mb="-2px" mr="2px" />
            </Tooltips>
          ) : null}
          <Text
            bold={changeHighlight}
            color={voteLocked || willUnlock || !cakeLocked ? (changeHighlight ? 'textSubtle' : 'textDisabled') : ''}
          >
            {voteLocked ? currentVoteWeight : previewVoteWeight} veCAKE
          </Text>
        </FlexGap>
      </Flex>
      <Flex alignSelf="stretch">
        <PercentInput
          style={{ width: '100%' }}
          disabled={voteLocked}
          inputProps={{ disabled: voteLocked }}
          onMax={onMax}
          value={voteValue}
          onUserInput={(v) => onChange({ ...vote, power: v })}
        />
      </Flex>
    </ListItemContainer>
  )
}
