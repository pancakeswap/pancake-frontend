import { useTranslation } from '@pancakeswap/localization'
import {
  AutoRow,
  BalanceInput,
  BalanceInputProps,
  Box,
  Button,
  FlexGap,
  Image,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { MAX_VECAKE_LOCK_WEEKS } from 'config/constants/veCake'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'
import { cakeLockWeeksAtom } from 'state/vecake/atoms'
import styled from 'styled-components'
import { useWriteIncreaseLockWeeksCallback } from '../hooks/useContractWrite'
import { useWriteWithdrawCallback } from '../hooks/useContractWrite/useWriteWithdrawCallback'
import { useCakeLockStatus } from '../hooks/useVeCakeUserInfo'
import { LockWeeksDataSet } from './DataSet'

const weeks = [4, 20, 40, 100, 208]

const ButtonBlocked = styled(Button)`
  flex: 1;
`

const WeekButton = styled(Button)`
  flex: 1;
  fontsize: 12;

  ${({ theme }) => theme.mediaQueries.md} {
    fontsize: 14;
    padding: 0 10px;
  }
`

const WeekInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const onInput = useCallback(
    (v: string) => {
      if (Number(v) > MAX_VECAKE_LOCK_WEEKS) {
        onUserInput(String(MAX_VECAKE_LOCK_WEEKS))
      } else {
        onUserInput(v)
      }
    },
    [onUserInput],
  )
  const handleWeekSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { week } = e.currentTarget.dataset
      if (week) {
        onInput(week)
      }
    },
    [onInput],
  )
  return (
    <>
      <BalanceInput
        width="100%"
        inputProps={{
          style: { textAlign: 'left', marginTop: '1px', marginBottom: '1px' },
          disabled,
          max: MAX_VECAKE_LOCK_WEEKS,
          pattern: '^[0-9]*$',
        }}
        value={value}
        onUserInput={onInput}
        unit={t('Weeks')}
      />
      {disabled ? null : (
        <FlexGap justifyContent="space-between" flexWrap="wrap" gap="4px" width="100%">
          {weeks.map((week) => (
            <WeekButton
              key={week}
              data-week={week}
              disabled={disabled}
              onClick={handleWeekSelect}
              scale={isDesktop ? 'sm' : 'xs'}
              variant={String(week) === value ? 'subtle' : 'light'}
            >
              {t('%week%W', { week })}
            </WeekButton>
          ))}
        </FlexGap>
      )}
    </>
  )
}

export const LockWeeksForm: React.FC<{
  fieldOnly?: boolean
  expired?: boolean
  disabled?: boolean
}> = ({ fieldOnly, expired, disabled }) => {
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

      <WeekInput value={value} onUserInput={onChange} disabled={disabled} />

      {fieldOnly ? null : (
        <>
          {disabled ? null : <LockWeeksDataSet />}

          {expired ? (
            <FlexGap width="100%" gap="16px">
              <SubmitUnlockButton />
              <SubmitRenewButton />
            </FlexGap>
          ) : (
            <SubmitLockButton disabled={disabled} />
          )}
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = ({ disabled }) => {
  const { t } = useTranslation()
  const cakeLockWeeks = useAtomValue(cakeLockWeeksAtom)
  const _disabled = useMemo(() => !cakeLockWeeks || cakeLockWeeks === '0' || disabled, [cakeLockWeeks, disabled])
  const increaseLockWeeks = useWriteIncreaseLockWeeksCallback()

  return (
    <Button disabled={_disabled} width="100%" onClick={increaseLockWeeks}>
      {t('Extend Lock')}
    </Button>
  )
}

const SubmitUnlockButton = () => {
  const { t } = useTranslation()
  const unlock = useWriteWithdrawCallback()
  const { cakeLockedAmount } = useCakeLockStatus()

  if (!cakeLockedAmount) {
    return null
  }

  return (
    <ButtonBlocked variant="secondary" onClick={unlock}>
      {t('Unlock')}
    </ButtonBlocked>
  )
}

const SubmitRenewButton = () => {
  const { t } = useTranslation()
  const cakeLockWeeks = useAtomValue(cakeLockWeeksAtom)
  const disabled = useMemo(() => !cakeLockWeeks || Number(cakeLockWeeks) <= 0, [cakeLockWeeks])

  const renew = useWriteIncreaseLockWeeksCallback()

  return (
    <ButtonBlocked disabled={disabled} onClick={renew}>
      {' '}
      {t('Renew Lock')}{' '}
    </ButtonBlocked>
  )
}
