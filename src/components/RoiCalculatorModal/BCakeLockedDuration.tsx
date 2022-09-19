import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Input, Message, MessageText, Text } from '@pancakeswap/uikit'
import { MAX_LOCK_DURATION, ONE_WEEK_DEFAULT } from 'config/constants/pools'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import styled from 'styled-components'
import { secondsToWeeks, weeksToSeconds } from '../../views/Pools/components/utils/formatSecondsToWeeks'

const DURATIONS = [1, 5, 10, 25, 52]

const StyledInput = styled(Input)`
  text-align: right;
  margin-right: 8px;
  width: 50%;
  box-sizing: border-box;
`

interface LockDurationFieldProps {
  duration: number
  setDuration: (duration: number) => void
  isOverMax: boolean
  currentDuration?: number
  currentDurationLeft?: number
}

const LockDurationField: React.FC<React.PropsWithChildren<LockDurationFieldProps>> = ({
  duration,
  setDuration,
  isOverMax,
  currentDuration,
  currentDurationLeft,
}) => {
  const { t } = useTranslation()

  const maxAvailableDuration = currentDurationLeft ? MAX_LOCK_DURATION - currentDurationLeft : MAX_LOCK_DURATION

  // When user extends the duration due to time passed when approving
  // transaction the extended duration will be a couple of seconds off to max duration,
  // therefore it is better to compare based on weeks
  const currentDurationInWeeks = useMemo(() => currentDuration && secondsToWeeks(currentDuration), [currentDuration])

  const maxDurationInWeeks = useMemo(() => secondsToWeeks(MAX_LOCK_DURATION), [])

  return (
    <>
      <Box mb="16px" mt="16px">
        <Flex mb="8px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('locked for')}
          </Text>
        </Flex>
        <Flex flexWrap="wrap" justifyContent="space-between">
          {DURATIONS.map((week) => {
            const weekSeconds = weeksToSeconds(week)
            return (
              <Button
                key={week}
                onClick={() => {
                  setDuration(weekSeconds)
                }}
                pl="12px"
                pr="12px"
                scale="sm"
                disabled={weekSeconds > maxAvailableDuration}
                variant={weekSeconds === duration ? 'subtle' : 'light'}
              >
                {week}W
              </Button>
            )
          })}
        </Flex>
      </Box>
      <Flex justifyContent="center" alignItems="center" mb="8px">
        <StyledInput
          value={secondsToWeeks(duration)}
          autoComplete="off"
          pattern="^[0-9]+$"
          inputMode="numeric"
          scale="sm"
          onChange={(e) => {
            const weeks = _toNumber(e?.target?.value)
            if (e.currentTarget.validity.valid && weeks < 53) {
              setDuration(weeksToSeconds(_toNumber(e?.target?.value)))
            }
          }}
        />
        <Button
          key="max"
          onClick={() => {
            setDuration(currentDuration)
          }}
          scale="sm"
          disabled={maxAvailableDuration < ONE_WEEK_DEFAULT}
          variant="light"
          width="50%"
        >
          {t('My Duration')}
        </Button>
      </Flex>
      {isOverMax && (
        <Text fontSize="12px" textAlign="right" color="failure">
          {t('Total lock duration exceeds 52 weeks')}
        </Text>
      )}
      {currentDurationLeft && currentDurationInWeeks === maxDurationInWeeks ? (
        <Message variant="warning">
          <MessageText maxWidth="240px">
            {t('Recommend choosing "MAX" to renew your staking position in order to keep similar yield boost.')}
          </MessageText>
        </Message>
      ) : null}
    </>
  )
}

export default LockDurationField
