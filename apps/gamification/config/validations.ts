import { string as zString } from 'zod'

export const zQuestId = zString().regex(/^[a-fA-F0-9]{32}$/)

export const zAddress = zString().regex(/^0x[a-fA-F0-9]{40}$/)
