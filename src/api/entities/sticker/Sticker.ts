import { StickerData } from '@src/api/entities/sticker/interfaces/StickerData'
import { StickerFormatTypes, StickerTypes } from '@src/constants'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { RawStickerData } from '@src/api/entities/sticker/interfaces/RawStickerData'
import { DiscordooError, idToDate, idToTimestamp, attach } from '@src/utils'
import { resolveGuildId, resolveUserId } from '@src/utils/resolve'
import { User } from '@src/api/entities/user'
import { CacheManagerGetOptions } from '@src/cache'
import { EntitiesUtil } from '@src/api'
import { StickerDeleteOptions } from '@src/api/entities/sticker/interfaces/StickerDeleteOptions'
import { StickerEditData } from '@src/api/entities/sticker/interfaces/StickerEditData'
import { StickerEditOptions } from '@src/api/entities/sticker/interfaces/StickerEditOptions'
import { RawStickerEditData } from '@src/api/entities/sticker/interfaces/RawStickerEditData'
import { Json } from '@src/api/entities/interfaces/Json'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { StickerPack } from '@src/api/entities/sticker/StickerPack'

export class Sticker extends AbstractEntity {
  public available?: boolean
  public description?: string
  public formatType!: StickerFormatTypes
  public guildId?: string
  public id!: string
  public name!: string
  public packId?: string
  public sortValue!: number
  public tags: string[] = []
  public type!: StickerTypes
  public userId?: string
  public deleted!: boolean

  async init(data: StickerData | RawStickerData): Promise<this> {

    attach(this, data, [
      'available',
      'description',
      [ 'formatType', 'format_type' ],
      [ 'guildId', 'guild_id' ],
      'id',
      'name',
      [ 'packId', 'pack_id' ],
      [ 'sortValue', 'sort_value' ],
      'type',
      'deleted',
    ])

    if (data.user) {
      this.userId = resolveUserId(data.user)
    } else if ('userId' in data) {
      this.userId = data.userId
    }

    if (data.tags) {
      this.tags = typeof data.tags === 'string' ? data.tags.split(', ') : data.tags
    }

    return this
  }

  async user(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.userId ? this.client.users.cache.get(this.userId, options) : undefined
  }

  get createdTimestamp(): number {
    return idToTimestamp(this.id)
  }

  get createdDate(): Date {
    return idToDate(this.id)
  }

  get url(): string {
    return this.client.internals.rest.cdn().sticker(this.id, this.formatType)
  }

  async fetch(): Promise<this> {
    const response = await this.client.internals.actions.getSticker(this.id)

    if (response.success) {
      await this.init(response.result)
    }

    return this
  }

  async fetchUser(): Promise<User | undefined> {
    const User = EntitiesUtil.get('User')

    if (!this.guildId) {
      if (this.userId) {
        const response = await this.client.internals.actions.getUser(this.userId)

        if (response.success) {
          return await new User(this.client).init(response.result)
        }

        return undefined
      } else {
        throw new DiscordooError('Sticker#fetchUser', 'Cannot fetch user without guild id or user id.')
      }
    }

    const response = await this.client.internals.actions.getGuildSticker(this.guildId, this.id)

    if (response.success) {
      await this.init(response.result)

      if (response.result.user) {
        return new User(this.client).init(response.result.user)
      }
    }

    return undefined
  }

  async fetchPack(): Promise<StickerPack | undefined> {
    if (!this.packId) return undefined

    const packs = await this.client.stickers.fetchPacks()

    if (packs) {
      return packs.get(this.packId)
    }

    return undefined
  }

  async edit(data: StickerEditData, options: StickerEditOptions = {}): Promise<this | undefined> {
    const guildId = this.guildId ?? resolveGuildId(options.guild)

    if (!guildId) throw new DiscordooError('Sticker#edit', 'Cannot edit sticker without guild id.')

    return this.client.stickers.edit(guildId, this, data, { reason: options.reason, patchEntity: this })
  }

  async delete(options: StickerDeleteOptions = {}): Promise<this | undefined> {
    const guildId = this.guildId ?? resolveGuildId(options.guild)

    if (!guildId) throw new DiscordooError('Sticker#delete', 'Cannot delete sticker without guild id.')

    const result = await this.client.stickers.delete(guildId, this, options.reason)

    if (result) {
      this.deleted = true
      return this
    }

    return undefined
  }

  setName(name: string, options?: StickerEditOptions): Promise<this | undefined> {
    return this.edit({ name }, options)
  }

  setDescription(description: string, options?: StickerEditOptions): Promise<this | undefined> {
    return this.edit({ description, name: this.name }, options)
  }

  setTags(tags: string[], options?: StickerEditOptions): Promise<this | undefined> {
    return this.edit({ tags, name: this.name }, options)
  }

  toJson(properties: ToJsonProperties, obj?: any): Json {
    return super.toJson({
      ...properties,
      available: true,
      description: true,
      formatType: true,
      guildId: true,
      id: true,
      name: true,
      packId: true,
      sortValue: true,
      tags: true,
      type: true,
      userId: true,
      deleted: true,
    }, obj)
  }

}
