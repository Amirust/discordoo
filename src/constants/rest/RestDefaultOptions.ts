import { RestOptions } from '@src/rest/interfaces/RestOptions'
import { version } from '@src/utils/version'

export const REST_DEFAULT_OPTIONS: Required<Omit<RestOptions, 'auth'>> = {
  version: 9,
  userAgent: `DiscordBot (https://github.com/Discordoo/discordoo, ${version}) NodeJS/${process.version}`,
  maxRetries: 1,
  requestTimeout: 30_000,
  latencyThreshold: 30_000,
  domain: 'discord.com',
  scheme: 'https',
  headers: {},
  defaultImageFormat: 'png',
  rateLimits: {
    disable: false,
    globalLimit: 50,
    invalidLimit: 10_000,
  },
}
