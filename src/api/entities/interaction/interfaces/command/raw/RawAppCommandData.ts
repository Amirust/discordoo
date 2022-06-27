import { AppCommandTypes } from '@src/constants'
import { BigBitFieldResolvable, BitFieldResolvable, RawAppCommandOptionData } from '@src/api'
import { Locale } from '@src/constants/common/Locale'

export interface RawAppCommandData {
  /** unique id of the command */
  id: string
  /** 1-32 character name */
  name: string
  /** localization dictionary for `name` field. Values follow the same restrictions as name */
  name_localizations?: Record<Locale, string>
  /** 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands */
  description: string
  /** localization dictionary for `description` field. Values follow the same restrictions as description */
  description_localizations?: Record<Locale, string>
  /** autoincrementing version identifier updated during substantial record changes */
  version: string
  /** unique id of the parent application */
  application_id: string
  /** the type of command, defaults `1` (`CHAT_INPUT`) if not set */
  type?: AppCommandTypes
  /** guild id of the command, if not global */
  guild_id?: string
  /** parameters for the command, max of 25 */
  options?: RawAppCommandOptionData[]
  /** set of permissions represented as a bit set */
  default_member_permissions?: BigBitFieldResolvable
  /**
   * indicates whether the command is available in DMs with the app, only for globally-scoped commands.
   * by default, commands are visible.
   */
  dm_permission?: boolean
}