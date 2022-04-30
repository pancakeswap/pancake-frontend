import { Choice } from './Choices'

export interface FormState {
  name: string
  body: string
  choices: Choice[]
  startDate: Date
  startTime: Date
  endDate: Date
  endTime: Date
  snapshot: number
}
