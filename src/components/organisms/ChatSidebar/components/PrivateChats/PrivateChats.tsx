import React, { useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { PrivateChatPreview, RecipientChat, OnlineUser } from "../";

import { SetSelectedProfile } from "types/chat";

import { usePrivateChatPreviews } from "hooks/privateChats";
import { useChatSidebarControls } from "hooks/chatSidebar";
import { useRecentWorldUsers } from "hooks/users";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  recipientId?: string;
  onAvatarClick: SetSelectedProfile;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({
  recipientId,
  onAvatarClick,
}) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const onInputChage = useCallback(
    (e) => setUserSearchQuery(e.target.value),
    []
  );

  const { privateChatPreviews } = usePrivateChatPreviews();
  const { selectRecipientChat } = useChatSidebarControls();
  const { recentWorldUsers } = useRecentWorldUsers();

  const { user } = useUser();
  const myUserId = user?.uid;

  const venueId = useVenueId();
  const { currentVenue } = useConnectCurrentVenueNG(venueId);
  const chatTitle = currentVenue?.chatTitle ?? "Venue";

  const numberOfRecentWorldUsers = recentWorldUsers.length - 1;

  const renderedPrivateChatPreviews = useMemo(
    () =>
      privateChatPreviews.map((chatMessage) => (
        <PrivateChatPreview
          key={`${chatMessage.ts_utc}-${chatMessage.from}-${chatMessage.to}`}
          message={chatMessage}
          isOnline={recentWorldUsers.some(
            (user) => user.id === chatMessage.counterPartyUser.id
          )}
          onClick={() => selectRecipientChat(chatMessage.counterPartyUser.id)}
        />
      )),
    [privateChatPreviews, selectRecipientChat, recentWorldUsers]
  );

  const renderedOnlineUsers = useMemo(
    () =>
      recentWorldUsers.map((user) => {
        // eslint-disable-next-line
        if (user.id === myUserId) return;
        return (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => selectRecipientChat(user.id)}
          />
        );
      }),
    [recentWorldUsers, selectRecipientChat, myUserId]
  );

  const renderedSearchResults = useMemo(
    () =>
      recentWorldUsers
        .filter((user) =>
          user.partyName?.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
        .map((user) => (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => selectRecipientChat(user.id)}
          />
        )),
    [recentWorldUsers, selectRecipientChat, userSearchQuery]
  );

  const numberOfSearchResults = renderedSearchResults.length;
  const hasChatPreviews = renderedPrivateChatPreviews.length > 0;

  if (recipientId) {
    return (
      <RecipientChat recipientId={recipientId} onAvatarClick={onAvatarClick} />
    );
  }

  return (
    <div className="private-chats">
      <div className="private-chats__search">
        <input
          className="private-chats__search-input"
          placeholder="Search for online people"
          value={userSearchQuery}
          onChange={onInputChage}
        />
        <div className="private-chats__search-icon">
          <FontAwesomeIcon icon={faSearch} size="1x" />
        </div>
      </div>

      {userSearchQuery ? (
        <>
          <p className="private-chats__title-text">
            {numberOfSearchResults} search results
          </p>

          {renderedSearchResults}
        </>
      ) : (
        <>
          {hasChatPreviews && (
            <div className="private-chats__previews">
              {renderedPrivateChatPreviews}
            </div>
          )}

          <p className="private-chats__title-text">
            {numberOfRecentWorldUsers} others are here at the {chatTitle}
          </p>

          {renderedOnlineUsers}
        </>
      )}
    </div>
  );
};
