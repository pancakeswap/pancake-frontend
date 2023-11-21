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
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'
import { cakeLockWeeksAtom } from 'state/vecake/atoms'
import styled from 'styled-components'
import { useWriteIncreaseLockWeeksCallback } from '../hooks/useContractWrite'
import { useWriteWithdrawCallback } from '../hooks/useContractWrite/useWriteWithdrawCallback'
import { LockWeeksDataSet } from './DataSet'
import { useCakeLockStatus } from '../hooks/useVeCakeUserInfo'

const weeks = [4, 20, 40, 100, 208]

const ButtonBlocked = styled(Button)`
  flex: 1;
`

const WeekInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
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
      {disabled ? null : (
        <FlexGap justifyContent="space-between" flexWrap={isDesktop ? 'nowrap' : 'wrap'} gap="4px" width="100%">
          {weeks.map((week) => (
            <Button
              key={week}
              data-week={week}
              disabled={disabled}
              onClick={handleWeekSelect}
              scale={isDesktop ? 'sm' : 'xs'}
              style={{ flex: 1, fontSize: 14 }}
              variant={String(week) === value ? 'subtle' : 'light'}
            >
              {t('%week%W', { week })}
            </Button>
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
