import { AppCommandOptionData } from '@src/api'
import {
  AppCommandOptionBooleanData,
  AppCommandOptionChannelData,
  AppCommandOptionIntegerData,
  AppCommandOptionMentionableData,
  AppCommandOptionNumberData,
  AppCommandOptionRoleData,
  AppCommandStringOptionData,
  AppCommandOptionUserData,
} from '@src/api/entities/interaction/interfaces/command/common/AppCommandOptionData'

export class MixinSlashCommandOptions {
  public options: AppCommandOptionData[] = []
  public addStringOption(option: AppCommandStringOptionData): this {
    this.options.push(option)
    return this
  }
  public addNumberOption(option: AppCommandOptionNumberData): this {
    this.options.push(option)
    return this
  }
  public addIntegerOption(option: AppCommandOptionIntegerData): this {
    this.options.push(option)
    return this
  }
  public addChannelOption(option: AppCommandOptionChannelData): this {
    this.options.push(option)
    return this
  }
  public addRoleOption(option: AppCommandOptionRoleData): this {
    this.options.push(option)
    return this
  }
  public addUserOption(option: AppCommandOptionUserData): this {
    this.options.push(option)
    return this
  }
  public addMentionableOption(option: AppCommandOptionMentionableData): this {
    this.options.push(option)
    return this
  }
  public addBooleanOption(option: AppCommandOptionBooleanData): this {
    this.options.push(option)
    return this
  }
}
