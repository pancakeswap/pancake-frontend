import { ContextApi } from '@pancakeswap/localization'
import { format, parseISO, isValid } from 'date-fns'
import { MINIMUM_CHOICES } from './Choices'
import { FormState } from './types'

export const combineDateAndTime = (date: Date, time: Date) => {
  if (!isValid(date) || !isValid(time)) {
    return null
  }

  const dateStr = format(date, 'yyyy-MM-dd')
  const timeStr = format(time, 'HH:mm:ss')

  return parseISO(`${dateStr}T${timeStr}`).getTime() / 1e3
}

export const getFormErrors = (formData: FormState, t: ContextApi['t']) => {
  const { name, body, choices, startDate, startTime, endDate, endTime, snapshot } = formData
  const errors: { [key: string]: string[] } = {}

  if (!name) {
    errors.name = [t('%field% is required', { field: 'Title' })]
  }

  if (!body) {
    errors.body = [t('%field% is required', { field: 'Body' })]
  }

  if (choices.length < MINIMUM_CHOICES) {
    errors.choices = [t('Please create a minimum of %num% choices', { num: MINIMUM_CHOICES })]
  }

  const hasEmptyChoice = choices.some((choice) => !choice.value)
  if (choices.length === MINIMUM_CHOICES && hasEmptyChoice) {
    errors.choices = Array.isArray(errors.choices)
      ? [...errors.choices, t('Choices must not be empty')]
      : (errors.choices = [t('Choices must not be empty')])
  }

  if (!isValid(startDate)) {
    errors.startDate = [t('Please select a valid date')]
  }

  if (!isValid(startTime)) {
    errors.startTime = [t('Please select a valid time')]
  }

  if (!isValid(endDate)) {
    errors.endDate = [t('Please select a valid date')]
  }

  if (!isValid(endTime)) {
    errors.endTime = [t('Please select a valid time')]
  }

  const startDateTimestamp = combineDateAndTime(startDate, startTime)
  const endDateTimestamp = combineDateAndTime(endDate, endTime)

  if (endDateTimestamp < startDateTimestamp) {
    errors.endDate = Array.isArray(errors.endDate)
      ? [...errors.endDate, t('End date must be after the start date')]
      : (errors.endDate = [t('End date must be after the start date')])
  }

  if (snapshot === 0) {
    errors.snapshot = [t('Invalid snapshot')]
  }

  return errors
}
