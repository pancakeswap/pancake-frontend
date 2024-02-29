import { ContextApi } from '@pancakeswap/localization'
import dayjs from 'dayjs'
import { MINIMUM_CHOICES } from './Choices'
import { FormState } from './types'

export const combineDateAndTime = (date: Date | null, time: Date | null) => {
  const dateDayJs = dayjs(date)
  const timeDayJs = dayjs(time)
  if (!dateDayJs.isValid() || !timeDayJs.isValid()) {
    return null
  }

  const dateStr = dateDayJs.format('YYYY-MM-DD')
  const timeStr = timeDayJs.format('HH:mm:ss')

  return dayjs(`${dateStr}T${timeStr}`).unix()
}

export const getFormErrors = (formData: FormState, t: ContextApi['t']) => {
  const { name, body, choices, startDate, startTime, endDate, endTime, snapshot } = formData
  const errors: { [key: string]: string[] } = {}
  const startDateDayJs = dayjs(startDate)
  const startTimeDayJs = dayjs(startTime)
  const endDateDayJs = dayjs(endDate)
  const endTimeDayJs = dayjs(endTime)

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

  if (!startDateDayJs.isValid()) {
    errors.startDate = [t('Please select a valid date')]
  }

  if (!startTimeDayJs.isValid()) {
    errors.startTime = [t('Please select a valid time')]
  }

  if (!endDateDayJs.isValid()) {
    errors.endDate = [t('Please select a valid date')]
  }

  if (!endTimeDayJs.isValid()) {
    errors.endTime = [t('Please select a valid time')]
  }

  const startDateTimestamp = combineDateAndTime(startDate, startTime)
  const endDateTimestamp = combineDateAndTime(endDate, endTime)

  if (endDateTimestamp && startDateTimestamp && endDateTimestamp < startDateTimestamp) {
    errors.endDate = Array.isArray(errors.endDate)
      ? [...errors.endDate, t('End date must be after the start date')]
      : (errors.endDate = [t('End date must be after the start date')])
  }

  if (snapshot === 0) {
    errors.snapshot = [t('Invalid snapshot')]
  }

  return errors
}
