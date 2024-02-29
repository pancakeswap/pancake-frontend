import { ChoiceIdValue } from './Choices'

export interface FormState {
  name: string
  body: string
  choices: ChoiceIdValue[]
  startDate: Date | null
  startTime: Date | null
  endDate: Date | null
  endTime: Date | null
  snapshot: number
}
