import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, BalanceInput, BalanceInputProps, Box, Button, FlexGap, Grid, Image, Text } from '@pancakeswap/uikit'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'
import { cakeLockWeeksAtom } from 'state/vecake/atoms'
import { LockWeeksDataSet } from './DataSet'
import { useWriteIncreaseLockWeeksCallback } from '../hooks/useContractWrite'

const weeks = [1, 5, 10, 25, 52]
const WeekInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const handleWeekSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { week } = e.currentTarget.dataset
      if (week) {
        onUserInput(week)
      }
    },
    [onUserInput],
  )
  return (
    <>
      <BalanceInput
        width="100%"
        inputProps={{ style: { textAlign: 'left', marginTop: '1px', marginBottom: '1px' }, disabled }}
        value={value}
        onUserInput={onUserInput}
        unit={t('Weeks')}
      />
      <FlexGap justifyContent="space-between" gap="4px" width="100%">
        {weeks.map((week) => (
          <Button
            key={week}
            data-week={week}
            disabled={disabled}
            onClick={handleWeekSelect}
            scale="sm"
            style={{ flex: 1 }}
            variant={String(week) === value ? 'subtle' : 'light'}
          >
            {t('%week%W', { week })}
          </Button>
        ))}
      </FlexGap>
    </>
  )
}

export const LockWeeksForm: React.FC<{
  fieldOnly?: boolean
  expired?: boolean
}> = ({ fieldOnly, expired }) => {
  const { t } = useTranslation()
  const [value, onChange] = useAtom(cakeLockWeeksAtom)
  return (
    <AutoRow alignSelf="start" gap="16px">
      <FlexGap gap="8px" alignItems="center">
        <Box width={40}>
          <Image src="/images/cake-staking/lock.png" height={40} width={40} />
        </Box>
        <FlexGap gap="4px">
          <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
            {t('add')}
          </Text>
          <Text color="secondary" textTransform="uppercase" fontSize={16} bold>
            {t('duration')}
          </Text>
        </FlexGap>
      </FlexGap>

      <WeekInput value={value} onUserInput={onChange} />

      {fieldOnly ? null : (
        <>
          <LockWeeksDataSet />

          {expired ? (
            <Grid gridTemplateColumns="1fr 1fr" width="100%" gridGap="16px">
              <Button variant="secondary"> {t('Unlock')} </Button>
              <Button disabled={!value || Number(value) <= 0}> {t('Renew Lock')} </Button>
            </Grid>
          ) : (
            <SubmitLockButton />
          )}
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = () => {
  const { t } = useTranslation()
  const cakeLockWeeks = useAtomValue(cakeLockWeeksAtom)
  const disabled = useMemo(() => !cakeLockWeeks || cakeLockWeeks === '0', [cakeLockWeeks])
  const increaseLockWeeks = useWriteIncreaseLockWeeksCallback()

  return (
    <Button disabled={disabled} width="100%" onClick={increaseLockWeeks}>
      {t('Extend Lock')}
    </Button>
  )
}
