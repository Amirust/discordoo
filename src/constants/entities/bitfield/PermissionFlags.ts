const b = BigInt
const one = b(1)

export const PermissionFlags = {
  CreateInstantInvite:      one << b(0),
  KickMembers:              one << b(1),
  BanMembers:               one << b(2),
  Administrator:            one << b(3),
  ManageChannels:           one << b(4),
  ManageGuild:              one << b(5),
  AddReactions:             one << b(6),
  ViewAuditLog:             one << b(7),
  PrioritySpeaker:          one << b(8),
  Stream:                   one << b(9),
  ViewChannel:              one << b(10),
  SendMessages:             one << b(11),
  SendTtsMessages:          one << b(12),
  ManageMessages:           one << b(13),
  EmbedLinks:               one << b(14),
  AttachFiles:              one << b(15),
  ReadMessageHistory:       one << b(16),
  MentionEveryone:          one << b(17),
  UseExternalEmojis:        one << b(18),
  ViewGuildInsights:        one << b(19),
  Connect:                  one << b(20),
  Speak:                    one << b(21),
  MuteMembers:              one << b(22),
  DeafenMembers:            one << b(23),
  MoveMembers:              one << b(24),
  UseVad:                   one << b(25),
  ChangeNickname:           one << b(26),
  ManageNicknames:          one << b(27),
  ManageRoles:              one << b(28),
  ManageWebhooks:           one << b(29),
  ManageEmojisAndStickers:  one << b(30),
  UseApplicationCommands:   one << b(31),
  RequestToSpeak:           one << b(32),
  ManageThreads:            one << b(34),
  CreatePublicThreads:      one << b(35),
  CreatePrivateThreads:     one << b(36),
  UseExternalStickers:      one << b(37),
  SendMessagesInThreads:    one << b(38),
  StartEmbeddedActivities:  one << b(39),
  ModerateMembers:          one << b(40),
}