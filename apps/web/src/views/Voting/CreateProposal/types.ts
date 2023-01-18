import { ChoiceIdValue } from './Choices'

export interface FormState {
  name: string
  body: string
  choices: ChoiceIdValue[]
  startDate: Date
  startTime: Date
  endDate: Date
  endTime: Date
  snapshot: number
}
