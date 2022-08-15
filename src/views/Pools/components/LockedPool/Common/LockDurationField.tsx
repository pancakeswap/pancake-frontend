import { useState, useEffect, useMemo } from 'react'
import { Text, Flex, Button, Input, Box, Message, MessageText } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { ONE_WEEK_DEFAULT, MAX_LOCK_DURATION } from 'config/constants/pools'
import { secondsToWeeks, weeksToSeconds } from '../../utils/formatSecondsToWeeks'
import { LockDurationFieldPropsType } from '../types'

const DURATIONS = [1, 5, 10, 25]

const StyledInput = styled(Input)`
  text-align: right;
  margin-right: 8px;
`

const LockDurationField: React.FC<React.PropsWithChildren<LockDurationFieldPropsType>> = ({
  duration,
  setDuration,
  isOverMax,
  currentDuration,
  currentDurationLeft,
}) => {
  const { t } = useTranslation()
  const [isMaxSelected, setIsMaxSelected] = useState(false)

  const maxAvailableDuration = currentDurationLeft ? MAX_LOCK_DURATION - currentDurationLeft : MAX_LOCK_DURATION

  useEffect(() => {
    if (isMaxSelected) {
      setDuration(maxAvailableDuration)
    }
  }, [isMaxSelected, maxAvailableDuration, setDuration])

  // When user extends the duration due to time passed when approving
  // transaction the extended duration will be a couple of seconds off to max duration,
  // therefore it is better to compare based on weeks
  const currentDurationInWeeks = useMemo(() => currentDuration && secondsToWeeks(currentDuration), [currentDuration])

  const maxDurationInWeeks = useMemo(() => secondsToWeeks(MAX_LOCK_DURATION), [])

  return (
    <>
      <Box mb="16px">
        <Flex mb="8px">
          <Text fontSize="12px" color="secondary" bold mr="2px" textTransform="uppercase">
            {t('Add')}
          </Text>
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('duration')}
          </Text>
        </Flex>
        <Flex flexWrap="wrap">
          {DURATIONS.map((week) => {
            const weekSeconds = weeksToSeconds(week)
            return (
              <Button
                key={week}
                onClick={() => {
                  setIsMaxSelected(false)
                  setDuration(weekSeconds)
                }}
                mt="4px"
                mr={['2px', '2px', '4px', '4px']}
                scale="sm"
                disabled={weekSeconds > maxAvailableDuration}
                variant={weekSeconds === duration ? 'subtle' : 'tertiary'}
              >
                {week}W
              </Button>
            )
          })}
          <Button
            key="max"
            onClick={() => {
              setIsMaxSelected(true)
            }}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            disabled={maxAvailableDuration < ONE_WEEK_DEFAULT}
            variant={isMaxSelected ? 'subtle' : 'tertiary'}
          >
            {t('Max')}
          </Button>
        </Flex>
      </Box>
      <Flex justifyContent="center" alignItems="center" mb="8px">
        <StyledInput
          value={secondsToWeeks(duration)}
          autoComplete="off"
          pattern="^[0-9]+$"
          inputMode="numeric"
          onChange={(e) => {
            setIsMaxSelected(false)
            const weeks = _toNumber(e?.target?.value)

            // Prevent large number input which cause NaN
            // Why 530, just want to avoid user get laggy experience
            // For example, allow user put 444 which they still get warning no more than 52
            if (e.currentTarget.validity.valid && weeks < 530) {
              setDuration(weeksToSeconds(_toNumber(e?.target?.value)))
            }
          }}
        />
        <Text>{t('Week')}</Text>
      </Flex>
      {isOverMax && (
        <Text fontSize="12px" textAlign="right" color="failure">
          {t('Total lock duration exceeds 52 weeks')}
        </Text>
      )}
      {currentDurationLeft && currentDurationInWeeks === maxDurationInWeeks && !isMaxSelected ? (
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
