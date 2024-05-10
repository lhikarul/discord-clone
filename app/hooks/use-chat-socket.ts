import { useSocket } from "@/components/providers/socket-provider";
import { DiscordMember, DiscordMessage, DiscordProfile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { use, useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = DiscordMessage & {
  member: DiscordMember & {
    profile: DiscordProfile;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  console.log("socket ", socket);
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      console.log("updated websocket ");
      queryClient.setQueryData([queryKey], (oldData: any) => {
        console.log("updated websocket2");
        if (!oldData || !oldData.page || oldData.pages.length === 0) {
          return oldData;
        }
        console.log("updated websocket3");
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });

        console.log("update key ", {
          ...oldData,
          pages: newData,
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }
        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };
        console.log("add key ", {
          ...oldData,
          pages: newData,
        });
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  });
};
