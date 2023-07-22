import { ViewableGuildData } from '../../../../../src/api'
import { DiscordLocale } from '../../../../../src/constants/common/DiscordLocale'
import { GuildExplicitContentFilterLevels } from '../../../../../src/constants'

export interface GuildData extends ViewableGuildData {
  preferredLocale: DiscordLocale
  rulesChannelId?: string
  publicUpdatesChannelId?: string
  systemChannelId?: string
  ownerId: string
  membersCount: number
  explicitContentFilter: GuildExplicitContentFilterLevels
}
