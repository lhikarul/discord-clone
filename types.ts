import { DiscordMember, DiscordProfile, DiscordServer } from "@prisma/client";

export type ServerWithMembersWithProfile = DiscordServer & {
  members: (DiscordMember & { profile: DiscordProfile })[];
};
