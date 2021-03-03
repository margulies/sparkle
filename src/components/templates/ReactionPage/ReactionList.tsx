import React, { useMemo, useState } from "react";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import {
  chatMessageAsMessageToTheBand,
  Reaction,
  ReactionsTextMap,
} from "utils/reactions";
import { withId, WithId } from "utils/id";

import { User } from "types/User";
import { ChatMessage } from "types/chat";

import { useWorldUsersByIdWorkaround } from "hooks/users";

import UserProfileModal from "components/organisms/UserProfileModal";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import { UserAvatar } from "components/atoms/UserAvatar";

export interface ReactionListProps {
  reactions: Reaction[];
  chatMessages: ChatMessage[];
  small?: boolean;
}

export const ReactionList: React.FC<ReactionListProps> = ({
  reactions,
  chatMessages,
  small = false,
}) => {
  // @debt see comments in useWorldUsersByIdWorkaround
  const { worldUsersById } = useWorldUsersByIdWorkaround();

  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const allReactions = useMemo(() => {
    const chatsAsBandMessages =
      chatMessages?.map(chatMessageAsMessageToTheBand) ?? [];

    const allReactionsSorted = [
      ...(reactions ?? []),
      ...chatsAsBandMessages,
    ].sort((a, b) => b.created_at - a.created_at);

    return allReactionsSorted.map((message) => {
      const messageSender = worldUsersById[message.created_by];
      const messageSenderWithId =
        messageSender !== undefined
          ? withId(messageSender, message.created_by)
          : undefined;

      const messageSenderImage = messageSender?.anonMode
        ? DEFAULT_PROFILE_IMAGE
        : messageSender?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;

      const messageSenderName = messageSender?.anonMode
        ? DEFAULT_PARTY_NAME
        : messageSender?.partyName ?? DEFAULT_PARTY_NAME;

      return (
        <div
          className="message"
          key={`${message.created_by}-${message.created_at}`}
        >
          {/* @debt Ideally we would only have one type of 'user avatar' component that would work for all of our needs */}
          {messageSenderWithId !== undefined ? (
            <UserProfilePicture
              user={messageSenderWithId}
              setSelectedUserProfile={setSelectedUserProfile}
            />
          ) : (
            <UserAvatar avatarSrc={messageSenderImage} />
          )}

          <div className="partyname-bubble">{messageSenderName}</div>

          <div
            className={classNames("message-bubble", {
              emoji: message.reaction !== "messageToTheBand",
            })}
          >
            {message.reaction !== "messageToTheBand"
              ? ReactionsTextMap[message.reaction]
              : message.text}
          </div>
        </div>
      );
    });
  }, [chatMessages, reactions, worldUsersById]);

  return (
    <>
      <div className={classNames("reaction-list", { small })}>
        {allReactions}
      </div>

      <UserProfileModal
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
    </>
  );
};
