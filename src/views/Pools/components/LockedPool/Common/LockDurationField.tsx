import { Text, Flex, Button, Input, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { secondsToWeeks, weeksToSeconds } from '../utils/formatSecondsToWeeks'
import { LockDurationFieldPropsType } from '../types'

const DURATIONS = [1, 5, 10, 25, 52]

const StyledInput = styled(Input)`
  text-align: right;
  margin-right: 8px;
`

const LockDurationField: React.FC<LockDurationFieldPropsType> = ({ duration, setDuration, isOverMax }) => {
  const { t } = useTranslation()

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
        <Text>{t('Week')}</Text>
      </Flex>
      {isOverMax && (
        <Text fontSize="12px" textAlign="right" color="failure">
          {t('Total lock duration exceeds 52 weeks')}
        </Text>
      )}
    </>
  )
}

export default LockDurationField
