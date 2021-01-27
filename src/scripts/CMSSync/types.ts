export enum SettingsType {
  'IFO' = 'IFO',
  'POOL' = 'POOL',
  'FARM' = 'FARM',
}

export interface SettingsObject {
  name: string
  link: string
  type: SettingsType
}
