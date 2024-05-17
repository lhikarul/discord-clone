1.  SetupPage -> 檢查用戶有沒有創建 server

    Y 1.1 -> 跳轉至 /servers/${server.id} (ServerIdPage)

    N 1.2 -> (initial-modal) 要求用戶建立 server
    1.2.1 -> 上傳圖片或 pdf (uploadthing)
    1.2.2 -> 顯示圖片或 pdf，點擊刪除後，畫面顯示 1.2.1
    1.2.3 -> 輸入名稱，點擊 create -> (/api/servers)
    1.2.4 -> server 建立完成，跳轉 1.1

2.  MainLayout -> 共用模板

    2.1 NavigationSidebar -> 展示用戶全部的 servers

         2.1 (NavigationAction) -> (CreateServerModal) -> 創建新的 Server -> 1.2.1
         2.2 (ScrollArea) -> (NatigationItem) -> 顯示 server name, server image
         2.3 (UserButton) -> 用戶登出

3.  ServerIdLayout -> server route 共用模板

        3.1 (ServerSidebar) -> 展示 server 所有的頻道(TEXT、AUDIO、VIDEO )和成員

            3.1.1 (ServerHeader) -> 檢查用戶是 ADMIN 或 MODERATOR

            Y ADMIN ->

                    3.1.2 -> (EditServerModal) -> 1.2.1 (/api/servers/${server?.id})

                    3.1.3 -> (MembersModal) -> 展示所有成員

                        3.1.3.1 -> 更改成員的權限 (Moderator / Guest) -> (`/api/members/${memberId})

                        3.1.3.2 -> 踢掉成員 -> (/api/members/${memberId})

                    3.1.4 -> (DeleteServerModal) -> (`/api/servers/${server?.id})

            N ADMIN ->

                    3.1.5 -> (LeaveServerModal) -> (/api/servers/${server?.id}/leave)

            Y MODERATOR ->

                    3.1.6 -> (InviteModal)

                        3.1.6.1 -> 生成新的邀請碼 (/api/servers/${server?.id}/invite-code)

                        3.1.6.2 -> 複製邀請碼 (${origin}/invite/${server?.inviteCode})

                    3.1.7 -> (CreateChannelModal) -> TEXT, AUDIO, VIDEO -> (/api/channels)


            3.1.2 (ServerSearch) -> 搜尋對應的 channel or member -> (/servers/${params?.serverId}/conversations/${id}), (/servers/${params?.serverId}/channels/${id}
            )

            3.1.3 (ServerSection) -> 有無編輯權限

                    3.1.3.1 -> 用戶權限不是 Guest && 類型是頻道 -> (CreateChannelModal) -> 3.1.7

                    3.1.3.2 -> 用戶是 ADMIN && 類型是成員 -> (MembersModal) -> 3.1.3

            3.1.4 (ServerChannel) -> 展示所有 channels

                    3.1.4.1 -> 點擊 channel -> /servers/${params.serverId}/channels/${channel.id}

                    3.1.4.2 -> 用戶權限不是 GUEST && 頻道不是 general
                            -> (EditChannelModal) -> (/api/channels/${channel?.id})
                            -> (DeleteChannelModal) -> (/api/channels/${channel?.id})

            3.1.5 (ServerMembers) -> 展示所有 members -> (/servers/${params?.serverId}/conversations/${member.id})

4.  ServerIdPage -> 從 discordServer 獲取 server 資料 -> (/servers/${params.serverId}/channels/${initialChannel?.id})

5.  ChannelIdPage -> 從 discordChannel 、discordMember 獲取對應資料

    5.1 (ChatHeader)

        5.1.1 (MobileToggler)

        5.1.2 -> 根據類型 channel || conversation 顯示對應 Icon

        5.1.3 -> (ChatVideoButton) 類型為 conversation 時

                5.1.3.1 -> 在 url 添加或移出 isVideo 屬性

        5.1.4 -> (SocketIndicator) -> 根據 socket 的連線狀態顯示對應的 UI

    5.2 頻道類型為 TEXT

        5.2.1 (ChatMessages)

                5.2.1.1 (useChatQuery) -> (/api/messages)

        5.2.2 (ChatInput)

6.  InviteCodePage -> 通過邀請連結加入頻道

    10.1 用戶已加入 -> (/servers/${existingServer.id})

    10.2 更新 Server 資料 -> -> (/servers/${existingServer.id})
