import { useTranslation } from '@pancakeswap/localization'
import { ErrorIcon, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { CSSProperties } from 'react'
import styled from 'styled-components'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'

import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { GaugeIdentifierDetails } from '../GaugesTable/List'
import { PercentInput } from './PercentInput'
import { useRowVoteState } from './hooks/useRowVoteState'
import { RowProps } from './types'

const ListItemContainer = styled(FlexGap)<{ borderBottom?: boolean }>`
  border-bottom: ${({ borderBottom = true, theme }) =>
    borderBottom ? `1px solid ${theme.colors.cardBorder}` : 'none'};
`

type Props = {
  style?: CSSProperties
} & RowProps

export function VoteListItem({ style, data, vote, onChange, ...props }: Props) {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const userVote = useUserVote(data)
  const { currentVoteWeight, previewVoteWeight, voteValue, voteLocked } = useRowVoteState({
    data,
    vote,
    onChange,
  })

  const onMax = () => {
    onChange('MAX_VOTE')
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
                    ? dayjs.unix(Number(userVote?.lastVoteTime)).add(10, 'day').from(currentTimestamp, true)
                    : '',
                },
              )}
            >
              <ErrorIcon height="20px" color="warning" mb="-2px" mr="2px" />
            </Tooltips>
          ) : null}
          <Text>{voteLocked ? currentVoteWeight : previewVoteWeight} veCAKE</Text>
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
