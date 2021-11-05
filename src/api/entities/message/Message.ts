import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'
import {
  GuildMember,
  MessageAttachment,
  MessageData,
  MessageEmbed,
  RawMessageData,
  ReadonlyMessageFlagsUtil,
  User
} from '@src/api'
import { MessageReactionsManager } from '@src/api/managers/reactions'
import { Keyspaces, MessageTypes } from '@src/constants'
import { attach, channelEntityKey, resolveMessageReaction } from '@src/utils'
import { AnyWritableChannel } from '@src/api/entities/channel/interfaces/AnyWritableChannel'
import { CacheManagerGetOptions } from '@src/cache'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'

export class Message extends AbstractEntity {
  public attachments!: MessageAttachment[]
  public authorId!: string
  public channelId!: string
  public content!: string
  public editedTimestamp?: number
  public embeds!: MessageEmbed[]
  public flags!: ReadonlyMessageFlagsUtil
  public guildId?: string
  public id!: string
  // MessageMentionsManager
  // mentionChannels: ChannelMentionData[]
  // mentionEveryone: boolean
  // mentionRoles: string[]
  // mentionUsers: string[]
  public nonce!: string | number
  public pinned!: boolean
  public reactions!: MessageReactionsManager
  public referencedMessageId?: string
  public createdTimestamp!: number
  public tts!: boolean
  public type!: MessageTypes
  public webhookId!: string

  async init(data: MessageData | RawMessageData): Promise<this> {

    attach(this, data, [
      [ 'channelId', 'channel_id' ],
      [ 'guildId', 'guild_id' ],
      'content',
      'id',
      'nonce',
      'pinned',
      'tts',
      'type',
      [ 'webhookId', 'webhook_id' ],
      [ 'createdTimestamp', 'created_timestamp' ],
      [ 'editedTimestamp', 'edited_timestamp' ],
    ])

    if (data.embeds?.length) {
      this.embeds = data.embeds.map(v => new MessageEmbed(v))
    }

    if (this.createdTimestamp) { // discord sends timestamps in strings
      this.createdTimestamp = new Date(this.createdTimestamp).getTime()
    }

    if (this.editedTimestamp) { // discord sends timestamps in strings
      this.editedTimestamp = new Date(this.editedTimestamp).getTime()
    }

    if ('authorId' in data) {
      this.authorId = data.authorId
    } else {
      this.authorId = data.author.id
    }

    if ('flags' in data) {
      this.flags = new ReadonlyMessageFlagsUtil(data.flags)
    } else if (!this.flags) {
      this.flags = new ReadonlyMessageFlagsUtil()
    }

    if (data.attachments?.length) {
      this.attachments = data.attachments.map(v => new MessageAttachment(v))
    }

    if (!this.reactions) {
      this.reactions = new MessageReactionsManager(this.client, {
        messageId: this.id,
        channelId: this.channelId
      })
    }

    if (data.reactions?.length) {
      await this.reactions.cache.clear()

      for await (const reactionData of data.reactions) {
        const reaction = await resolveMessageReaction(this.client, reactionData)
        if (reaction) await this.reactions.cache.set(reaction.emojiId, reaction)
      }
    }

    if ('referenced_message' in data && data.referenced_message) {
      const Message = EntitiesUtil.get('Message')
      const msg = await new Message(this.client).init(data.referenced_message)
      await this.client.messages.cache.set(msg.id, msg, { storage: this.channelId })
    }

    return this
  }

  get createdDate(): Date {
    return new Date(this.createdTimestamp)
  }

  get editedDate(): Date | undefined {
    return this.editedTimestamp ? new Date(this.editedTimestamp) : undefined
  }

  author(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.client.users.cache.get(this.authorId, options)
  }

  async guild(options?: CacheManagerGetOptions): Promise<any | undefined> { // TODO: guild
    return this.guildId ? this.client.guilds.cache.get(this.guildId, options) : undefined
  }

  async channel(options?: CacheManagerGetOptions): Promise<AnyWritableChannel | undefined> {
    return this.client.internals.cache.get(
      Keyspaces.CHANNELS, this.guildId ?? this.authorId, channelEntityKey, this.channelId, options
    )
  }

  async member(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    return this.guildId
      ? this.client.internals.cache.get(Keyspaces.GUILD_MEMBERS, this.guildId, 'GuildMember', this.authorId, options)
      : undefined
  }

  async referencedMessage(options?: CacheManagerGetOptions): Promise<Message | undefined> {
    return this.referencedMessageId
      ? this.client.internals.cache.get(Keyspaces.MESSAGES, this.channelId, 'Message', this.referencedMessageId, options)
      : undefined
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      channelId: true,
      guildId: true,
      content: true,
      id: true,
      nonce: true,
      pinned: true,
      tts: true,
      type: true,
      webhookId: true,
      createdTimestamp: true,
      editedTimestamp: true,
      embeds: true,
      flags: true,
      referencedMessageId: true,
    }, obj)
  }
}
