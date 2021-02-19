import React, { useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { withId } from "utils/id";

import { Chatbox } from "components/molecules/Chatbox";
import { UserAvatar } from "components/atoms/UserAvatar";

import { useRecipientChat } from "hooks/privateChats";
import { useChatSidebarControls } from "hooks/chatSidebar";

import { SetSelectedProfile } from "types/chat";

import "./RecipientChat.scss";

export interface RecipientChatProps {
  recipientId: string;
  onAvatarClick: SetSelectedProfile;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({
  recipientId,
  onAvatarClick,
}) => {
  const {
    messagesToDisplay,
    sendMessageToSelectedRecipient,
    deleteMessage,
    markMessageRead,
    recipient,
  } = useRecipientChat(recipientId);

  const handleAvatarClick = useCallback(
    () => onAvatarClick(withId(recipient, recipientId)),
    [onAvatarClick, recipient, recipientId]
  );

  useEffect(() => {
    const unreadCounterpartyMessages = messagesToDisplay.filter(
      (message) => !message.isRead && message.from === recipientId
    );

    if (unreadCounterpartyMessages.length > 0) {
      unreadCounterpartyMessages.forEach((message) =>
        markMessageRead(message.id)
      );
    }
  }, [messagesToDisplay, recipientId, markMessageRead]);

  const { selectPrivateChat } = useChatSidebarControls();

  return (
    <div className="recipient-chat">
      <div className="recipient-chat__breadcrumbs">
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="recipient-chat__back-icon"
          size="sm"
          onClick={selectPrivateChat}
        />

        <UserAvatar
          avatarSrc={recipient.pictureUrl}
          onClick={handleAvatarClick}
        />
        <div className="recipient-chat__nickname" onClick={handleAvatarClick}>
          {recipient.partyName}
        </div>
      </div>
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessageToSelectedRecipient}
        deleteMessage={deleteMessage}
        onAvatarClick={onAvatarClick}
      />
    </div>
  );
};
