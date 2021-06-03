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

export const isFormValid = (formData: FormState) => {
  const { name, body, choices, startDate, startTime, endDate, endTime, snapshot } = formData

  if (!name) {
    return false
  }

  if (!body) {
    return false
  }

  if (choices.length < MINIMUM_CHOICES) {
    return false
  }

  const hasEmptyChoice = choices.some((choice) => !choice.value)
  if (choices.length === MINIMUM_CHOICES && hasEmptyChoice) {
    return false
  }

  if (!isValid(startDate)) {
    return false
  }

  if (!isValid(startTime)) {
    return false
  }

  if (!isValid(endDate)) {
    return false
  }

  if (!isValid(endTime)) {
    return false
  }

  if (snapshot === 0) {
    return false
  }

  return true
}
