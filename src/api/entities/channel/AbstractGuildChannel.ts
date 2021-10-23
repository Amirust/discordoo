import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { AbstractGuildChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildChannelData'
import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { attach } from '@src/utils'

export abstract class AbstractGuildChannel extends AbstractChannel implements AbstractGuildChannelData {
  public guildId!: string
  public name!: string
  public parentId!: string
  public position!: number

  async init(data: AbstractGuildChannelData | RawAbstractGuildChannelData): Promise<this> {
    await super.init(data)

    attach(this, data, [
      'name',
      [ 'guildId', 'guild_id' ],
      [ 'parentId', 'parent_id' ],
      [ 'rawPosition', 'position' ]
    ])

    return this
  }

  async members(): Promise<any[]> { // TODO: GuildMember[]
    const predicate = (member: any /** TODO: GuildMember */) => 12
    // TODO
    // @ts-ignore
    return this.client.internals.cache.filter('members', this.id, 'GuildMember')
  }

}
