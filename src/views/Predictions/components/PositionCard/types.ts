export enum PositionType {
  UP = 'up',
  DOWN = 'down',
}
export type PositionStatus = 'expired' | 'live' | 'soon'

export interface Position {
  status: PositionStatus
}
