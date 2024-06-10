export enum UploadImageType {
  CAMPAIGN = 'CAMPAIGN',
  QUEST = 'QUEST',
}

export interface ImageResponseDto {
  id: string // UUID
  type: UploadImageType
}
