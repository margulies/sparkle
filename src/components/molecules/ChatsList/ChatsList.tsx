import React, {
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { isEmpty } from "lodash";

import { DEFAULT_PARTY_NAME, VENUE_CHAT_AGE_DAYS } from "settings";

import { User } from "types/User";

import { getDaysAgoInSeconds, roundToNearestHour } from "utils/time";
import { WithId } from "utils/id";
import { chatUsersSelector, privateChatsSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import {
  ChatContext,
  chatSort,
  PrivateChatMessage,
} from "components/context/ChatContext";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import ChatBox from "components/molecules/Chatbox";
import { setPrivateChatMessageIsRead } from "components/organisms/PrivateChatModal/helpers";
import UserSearchBar from "../UserSearchBar/UserSearchBar";

import "./ChatsList.scss";

interface LastMessageByUser {
  [userId: string]: PrivateChatMessage;
}

const DAYS_AGO = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
const HIDE_BEFORE = roundToNearestHour(DAYS_AGO);

const noopHandler = () => {};

const ChatsList: React.FunctionComponent = () => {
  const { user } = useUser();
  const privateChats = useSelector(privateChatsSelector);
  const chatUsers = useSelector(chatUsersSelector);

  const [selectedUser, setSelectedUser] = useState<WithId<User>>();

  const lastMessageByUserReducer = useCallback(
    (agg, item) => {
      let lastMessageTimeStamp;
      let discussionPartner;
      if (item.from === user?.uid) {
        discussionPartner = item.to;
      } else {
        discussionPartner = item.from;
      }
      try {
        lastMessageTimeStamp = agg[discussionPartner].ts_utc;
        if (lastMessageTimeStamp < item.ts_utc) {
          agg[discussionPartner] = item;
        }
      } catch {
        agg[discussionPartner] = item;
      }
      return agg;
    },
    [user]
  );

  const discussionPartnerWithLastMessageExchanged = useMemo(() => {
    if (!privateChats) return {};
    return privateChats.reduce<LastMessageByUser>(lastMessageByUserReducer, {});
  }, [lastMessageByUserReducer, privateChats]);

  const onClickOnSender = useCallback(
    (sender: WithId<User>) => {
      const chatsToUpdate = privateChats.filter(
        (chat) => !chat.isRead && chat.from === sender.id
      );
      chatsToUpdate.map(
        (chat) => user && setPrivateChatMessageIsRead(user.uid, chat.id)
      );
      setSelectedUser(sender);
    },
    [privateChats, user]
  );

  const chatsToDisplay = useMemo(
    () =>
      privateChats &&
      privateChats
        .filter(
          (message) =>
            message.deleted !== true &&
            message.type === "private" &&
            (message.to === selectedUser?.id ||
              message.from === selectedUser?.id) &&
            message.ts_utc.seconds > HIDE_BEFORE
        )
        .sort(chatSort),
    [privateChats, selectedUser]
  );

  const chatContext = useContext(ChatContext);
  const submitMessage = useCallback(
    async (data: { messageToTheBand: string }) => {
      chatContext &&
        user &&
        chatContext.sendPrivateChat(
          user.uid,
          selectedUser!.id,
          data.messageToTheBand
        );
    },
    [chatContext, selectedUser, user]
  );

  const hideUserChat = useCallback(() => setSelectedUser(undefined), []);

  const hasPrivateChats = !isEmpty(discussionPartnerWithLastMessageExchanged);

  const discussions = useMemo(() => {
    return Object.keys(discussionPartnerWithLastMessageExchanged).sort((a, b) =>
      discussionPartnerWithLastMessageExchanged[b].ts_utc
        .valueOf()
        .localeCompare(
          discussionPartnerWithLastMessageExchanged[a].ts_utc.valueOf()
        )
    );
  }, [discussionPartnerWithLastMessageExchanged]);

  if (selectedUser) {
    return (
      <Fragment>
        <div className="private-container-back-btn" onClick={hideUserChat} />
        <div className="private-chat-user">
          Chatting with: {selectedUser.partyName}
        </div>
        <ChatBox chats={chatsToDisplay} onMessageSubmit={submitMessage} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      {hasPrivateChats && (
        <div className="private-container show">
          <div className="private-messages-list">
            <UserSearchBar onSelect={setSelectedUser} />
            {discussions.map((userId: string) => {
              const sender = { ...chatUsers![userId], id: userId };
              const lastMessageExchanged =
                discussionPartnerWithLastMessageExchanged?.[userId];
              console.log(lastMessageExchanged);
              const profileName = sender.anonMode
                ? DEFAULT_PARTY_NAME
                : sender.partyName;

              return (
                <div
                  key={userId}
                  className="private-message-item"
                  onClick={() => onClickOnSender(sender)}
                  id="private-chat-modal-select-private-recipient"
                >
                  <UserProfilePicture
                    avatarClassName="private-message-author-pic"
                    user={sender}
                    setSelectedUserProfile={noopHandler}
                  />
                  <div className="private-message-content">
                    <div className="private-message-author">{profileName}</div>
                    <div className="private-message-last">
                      {lastMessageExchanged.text}
                    </div>
                  </div>
                  {lastMessageExchanged.from !== user?.uid &&
                    !lastMessageExchanged.isRead && (
                      <div className="not-read-indicator">NOT READ</div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!hasPrivateChats && (
        <div className="private-messages-empty">
          <div>No private messages yet</div>
        </div>
      )}
    </Fragment>
  );
};

export default ChatsList;
