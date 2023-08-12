import { PresenceActivityTypes } from '@src/constants'

export interface PresenceActivityUpdateData {
  name: string
  type: PresenceActivityTypes
  state?: string
  url?: string
}
