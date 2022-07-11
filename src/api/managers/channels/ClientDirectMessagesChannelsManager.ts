import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Client } from '@src/core'
import { DirectMessagesChannel, EntitiesCacheManager, EntitiesUtil, UserResolvable } from '@src/api'
import { Keyspaces } from '@src/constants'
import { DiscordooError, resolveUserId } from '@src/utils'
import { makeCachePointer } from '@src/utils/cachePointer'

export class ClientDirectMessagesChannelsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<DirectMessagesChannel>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<DirectMessagesChannel>(this.client, {
      keyspace: Keyspaces.DM_CHANNELS,
      storage: 'global',
      entity: 'DirectMessagesChannel',
      policy: 'channels'
    })
  }

  async fetch(user: UserResolvable): Promise<DirectMessagesChannel | undefined> {
    const userId = resolveUserId(user)

    if (!userId) throw new DiscordooError('UsersManager#createDM', 'Cannot create/fetch DM without user id.')

    const response = await this.client.internals.actions.createUserChannel(userId)
    const DirectMessageChannel = EntitiesUtil.get('DirectMessagesChannel')

    if (response.success) {
      const channel = await new DirectMessageChannel(this.client).init(response.result)
      await this.client.channels.cache.set(channel.id, channel, { storage: 'dm' })
      await this.cache.set(userId, makeCachePointer(Keyspaces.CHANNELS, 'dm', channel.id))
      return channel
    }

    return undefined
  }

  /**
   * Deletes DM channel attached to the user.
   * You can delete it only if it cached.
   * If you want to delete uncached channel, use client.channels.delete(channelId *not userId*) instead.
   * */
  async delete(user: UserResolvable): Promise<boolean> {
    const userId = resolveUserId(user)

    if (!userId) throw new DiscordooError('UsersManager#deleteDM', 'Cannot delete DM without user id.')

    const channel = await this.cache.get(userId)
    if (channel) {
      return this.client.channels.cache.delete(channel.id)
    }

    return false
  }
}