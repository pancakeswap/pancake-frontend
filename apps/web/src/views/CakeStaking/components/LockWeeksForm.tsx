import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, BalanceInput, BalanceInputProps, Box, Button, FlexGap, Image, Text } from '@pancakeswap/uikit'
import { MAX_VECAKE_LOCK_WEEKS } from 'config/constants/veCake'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'
import { cakeLockWeeksAtom } from 'state/vecake/atoms'
import styled from 'styled-components'
import { useWriteIncreaseLockWeeksCallback } from '../hooks/useContractWrite'
import { useWriteWithdrawCallback } from '../hooks/useContractWrite/useWriteWithdrawCallback'
import { useMaxUnlockWeeks } from '../hooks/useMaxUnlockTime'
import { useCakeLockStatus } from '../hooks/useVeCakeUserInfo'
import { LockWeeksDataSet } from './DataSet'

const weeks = [
  {
    value: 1,
    label: '1W',
  },
  {
    value: 4,
    label: '1M',
  },
  {
    value: 26,
    label: '6M',
  },
  {
    value: 52,
    label: '1Y',
  },
  {
    value: 208,
    label: '4Y',
  },
]

const ButtonBlocked = styled(Button)`
  flex: 1;
  white-space: nowrap;
`

const WeekInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const { cakeLockExpired, cakeUnlockTime } = useCakeLockStatus()
  const showMax = useMemo(() => (cakeLockExpired ? false : cakeUnlockTime > 0), [cakeLockExpired, cakeUnlockTime])
  const weekOptions = useMemo(() => {
    return showMax ? weeks.slice(0, weeks.length - 1) : weeks
  }, [showMax])
  const maxUnlockWeeks = useMaxUnlockWeeks(MAX_VECAKE_LOCK_WEEKS, cakeLockExpired ? 0 : cakeUnlockTime)
  const onInput = useCallback(
    (v: string) => {
      if (Number(v) > maxUnlockWeeks) {
        onUserInput(String(maxUnlockWeeks))
      } else {
        onUserInput(v)
      }
    },
    [maxUnlockWeeks, onUserInput],
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

  const appendComponent = (
    <Box width={40} mr={12}>
      <Image src="/images/cake-staking/lock.png" height={37} width={34} />
    </Box>
  )
  return (
    <>
      <BalanceInput
        width="100%"
        mb="8px"
        inputProps={{
          style: { textAlign: 'left', marginTop: '1px', marginBottom: '1px' },
          disabled,
          max: MAX_VECAKE_LOCK_WEEKS,
          pattern: '^[0-9]*$',
        }}
        value={value}
        appendComponent={appendComponent}
        onUserInput={onInput}
        unit={t('Weeks')}
      />
      {disabled ? null : (
        <FlexGap justifyContent="space-between" flexWrap="wrap" gap="4px" width="100%">
          {weekOptions.map(({ value: v, label }) => (
            <ButtonBlocked
              key={v}
              data-week={v}
              disabled={disabled || maxUnlockWeeks < v}
              onClick={handleWeekSelect}
              scale="sm"
              variant={Number(value) === v ? 'subtle' : 'light'}
            >
              {label}
            </ButtonBlocked>
          ))}

          {showMax ? (
            <ButtonBlocked
              data-week={maxUnlockWeeks}
              disabled={disabled || maxUnlockWeeks <= 0}
              onClick={handleWeekSelect}
              scale="sm"
              variant={Number(value) === maxUnlockWeeks ? 'subtle' : 'light'}
            >
              {t('Max')}
            </ButtonBlocked>
          ) : null}
        </FlexGap>
      )}
    </>
  )
}

interface LockWeeksFormProps {
  fieldOnly?: boolean
  expired?: boolean
  disabled?: boolean
  hideLockWeeksDataSetStyle?: boolean
  customVeCakeCard?: null | JSX.Element
  onDismiss?: () => void
}

export const LockWeeksForm: React.FC<React.PropsWithChildren<LockWeeksFormProps>> = ({
  fieldOnly,
  expired,
  disabled,
  customVeCakeCard,
  hideLockWeeksDataSetStyle,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const [value, onChange] = useAtom(cakeLockWeeksAtom)

  return (
    <AutoRow alignSelf="start">
      <FlexGap gap="4px" alignItems="center" mb="4px">
        <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
          {t('add')}
        </Text>
        <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
          {t('duration')}
        </Text>
      </FlexGap>

      <WeekInput value={value} onUserInput={onChange} disabled={disabled} />

      {customVeCakeCard}

      {fieldOnly ? null : (
        <>
          {disabled ? null : <LockWeeksDataSet hideLockWeeksDataSetStyle={hideLockWeeksDataSetStyle} />}

          {expired ? (
            <FlexGap width="100%" mt="16px" gap="16px">
              <SubmitUnlockButton />
              <SubmitRenewButton />
            </FlexGap>
          ) : (
            <SubmitLockButton disabled={disabled} onDismiss={onDismiss} />
          )}
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = ({ disabled, onDismiss }: { disabled?: boolean; onDismiss?: () => void }) => {
  const { t } = useTranslation()
  const cakeLockWeeks = useAtomValue(cakeLockWeeksAtom)
  const _disabled = useMemo(() => !cakeLockWeeks || cakeLockWeeks === '0' || disabled, [cakeLockWeeks, disabled])
  const increaseLockWeeks = useWriteIncreaseLockWeeksCallback(onDismiss)

  return (
    <Button mt="16px" disabled={_disabled} width="100%" onClick={increaseLockWeeks}>
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
      {t('Renew Lock')}
    </ButtonBlocked>
  )
}
