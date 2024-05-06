import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { DiscordMember, DiscordProfile, DiscordServer } from "@prisma/client";

export type ServerWithMembersWithProfile = DiscordServer & {
  members: (DiscordMember & { profile: DiscordProfile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
