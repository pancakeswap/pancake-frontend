import { Text, Flex, Button, Input, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { secondsToWeeks, weeksToSeconds } from '../utils/formatSecondsToWeeks'

const DURATIONS = [1, 5, 10, 25, 52]

const StyledInput = styled(Input)`
  text-align: right;
  margin-right: 8px;
`

const LockDurationField = ({ duration, setDuration, isOverMax }) => (
  <>
    <Box mb="16px">
      <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px" mb="8px">
        ADD DURATION
      </Text>
      <Flex flexWrap="wrap">
        {DURATIONS.map((week) => (
          <Button
            key={week}
            onClick={() => setDuration(weeksToSeconds(week))}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            variant={weeksToSeconds(week) === duration ? 'subtle' : 'tertiary'}
          >
            {week}W
          </Button>
        ))}
      </Flex>
    </Box>
    <Flex justifyContent="center" alignItems="center" mb="8px">
      <StyledInput
        value={secondsToWeeks(duration)}
        autoComplete="off"
        pattern="^[0-9]+$"
        inputMode="numeric"
        onChange={(e) => {
          if (e.currentTarget.validity.valid) {
            setDuration(weeksToSeconds(Number(e?.target?.value)))
          }
        }}
      />
      <Text>Week</Text>
    </Flex>
    {isOverMax && (
      <Text fontSize="12px" textAlign="right" color="failure">
        Total lock duration exceeds 52 weeks
      </Text>
    )}
  </>
)

export default LockDurationField
