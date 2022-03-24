import { Text, Flex, Button, Input, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'

const DURATIONS = [1, 5, 10, 25, 52]

const StyledInput = styled(Input)`
  text-align: right;
  margin-right: 8px;
`

const LockDurationField = ({ duration, setDuration }) => (
  <>
    <Box mb="16px">
      <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px" mb="8px">
        LOCK DURATION
      </Text>
      <Flex flexWrap="wrap">
        {DURATIONS.map((d) => (
          <Button
            onClick={() => setDuration(d)}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            variant={d === duration ? 'subtle' : 'tertiary'}
          >
            {d}W
          </Button>
        ))}
      </Flex>
    </Box>
    <Flex justifyContent="center" alignItems="center">
      <StyledInput
        value={duration}
        autoComplete="off"
        pattern="^[0-9]+$"
        inputMode="numeric"
        onChange={(e) => {
          if (e.currentTarget.validity.valid) {
            setDuration(Number(e?.target?.value))
          }
        }}
      />
      <Text>Week</Text>
    </Flex>
  </>
)

export default LockDurationField
