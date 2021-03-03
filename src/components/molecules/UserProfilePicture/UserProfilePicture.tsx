import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PARTY_NAME,
  DEFAULT_PROFILE_IMAGE,
  RANDOM_AVATARS,
  DEFAULT_SHOW_AVATAR_NAMETAG,
} from "settings";

// Styles
import "./fireworks.scss";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { faHandPaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "types/User";

import { MessageToTheBandReaction, Reactions } from "utils/reactions";
import { WithId } from "utils/id";

import { useReactions } from "hooks/useReactions";
import { useVenueId } from "hooks/useVenueId";
import { useSelector } from "hooks/useSelector";

// @debt remove styled-components in favour of using our standard scss patterns
import * as S from "./UserProfilePicture.styles";
import "./UserProfilePicture.scss";

export interface UserProfilePictureProp {
  user: WithId<User>;
  setSelectedUserProfile: (user: WithId<User>) => void;
  isAudioEffectDisabled?: boolean;
  miniAvatars?: boolean;
  avatarClassName?: string;
  avatarStyle?: object;
  containerStyle?: object;
  reactionPosition?: "right" | "left" | undefined;
}

// @debt This component should be divided into a few with simpler logic. Also, remove `styled components`
// @debt the UserAvatar component serves a very similar purpose to this, we should unify them as much as possible
const UserProfilePicture: React.FC<UserProfilePictureProp> = ({
  isAudioEffectDisabled,
  miniAvatars,
  avatarClassName,
  avatarStyle,
  containerStyle,
  setSelectedUserProfile,
  reactionPosition,
  user,
  //isHandUp,
}) => {
  // @debt some of the redux patterns exist for this, but I don't believe anything actually uses them/calls this at the moment
  const muteReactions = useSelector((state) => state.room.mute);

  const [pictureUrl, setPictureUrl] = useState("");

  const randomAvatarUrl = (id: string) =>
    "/avatars/" +
    RANDOM_AVATARS[Math.floor(id?.charCodeAt(0) % RANDOM_AVATARS.length)];

  const avatarUrl = useCallback(
    (id: string, anonMode?: boolean, pictureUrl?: string) => {
      if (anonMode || !id) {
        return setPictureUrl(DEFAULT_PROFILE_IMAGE);
      }

      if (!miniAvatars && pictureUrl) {
        return setPictureUrl(pictureUrl);
      }

      if (miniAvatars) {
        return setPictureUrl(randomAvatarUrl(id));
      }

      return setPictureUrl(DEFAULT_PROFILE_IMAGE);
    },
    [miniAvatars]
  );

  useEffect(() => {
    avatarUrl(user.id, user.anonMode, user.pictureUrl);
  }, [avatarUrl, user.anonMode, user.id, user.pictureUrl, user.handUpAt]);

  const venueId = useVenueId();
  const { currentVenue } = useConnectCurrentVenueNG(venueId);
  const reactions = useReactions(venueId);

  const isHandUp = !!Number(user.handUpAt) ? true : false;

  const typedReaction = reactions ?? [];

  const messagesToBand = typedReaction.find(
    (r) => r.reaction === "messageToTheBand" && r.created_by === user.id
  ) as MessageToTheBandReaction | undefined;

  const shouldShowNametags: string =
    currentVenue?.showNametags ?? DEFAULT_SHOW_AVATAR_NAMETAG;

  const nametagClass =
    shouldShowNametags === "hover"
      ? "profile-name-avatar profile-name-avatar-hover"
      : "profile-name-avatar";

  const imageErrorHandler = useCallback(
    (
      event: HTMLImageElement | React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
      const randomAvatar = randomAvatarUrl(user.id);
      setPictureUrl(randomAvatar);

      (event as HTMLImageElement).onerror = null;
      (event as HTMLImageElement).src = randomAvatar;
    },
    [user.id]
  );

  return useMemo(() => {
    return (
      <S.Container style={{ ...containerStyle }}>
        {/* Hidden image, used to handle error if image is not loaded */}
        <img
          src={pictureUrl}
          onError={(event) => imageErrorHandler(event)}
          hidden
          style={{ display: "none" }}
          alt={user.anonMode ? DEFAULT_PARTY_NAME : user.partyName}
        />
        <S.Avatar
          onClick={() => setSelectedUserProfile(user)}
          className={avatarClassName}
          backgroundImage={pictureUrl}
          style={{ ...avatarStyle }}
        >
          {shouldShowNametags !== "none" && (
            <div className={nametagClass}>{user.partyName}</div>
          )}
          {isHandUp && (
            <FontAwesomeIcon className="handUp" icon={faHandPaper} />
          )}
        </S.Avatar>
        {Reactions.map(
          (reaction, index) =>
            reactions.find(
              (r) => r.created_by === user.id && r.reaction === reaction.type
            ) && (
              <div key={index} className="reaction-container">
                <S.Reaction
                  role="img"
                  aria-label={reaction.ariaLabel}
                  className={reaction.name}
                  reactionPosition={reactionPosition}
                >
                  {reaction.text}
                </S.Reaction>

                {!muteReactions && !isAudioEffectDisabled && (
                  <audio autoPlay loop>
                    <source src={reaction.audioPath} />
                  </audio>
                )}
              </div>
            )
        )}
        {messagesToBand && (
          <div className="reaction-container">
            <S.ShoutOutMessage
              role="img"
              aria-label="messageToTheBand"
              reactionPosition={reactionPosition}
            >
              {messagesToBand.text}
            </S.ShoutOutMessage>
          </div>
        )}
      </S.Container>
    );
  }, [
    containerStyle,
    pictureUrl,
    user,
    avatarClassName,
    avatarStyle,
    messagesToBand,
    reactionPosition,
    imageErrorHandler,
    setSelectedUserProfile,
    reactions,
    muteReactions,
    isAudioEffectDisabled,
    isHandUp,
    shouldShowNametags,
    nametagClass,
  ]);
};

UserProfilePicture.defaultProps = {
  avatarClassName: "profile-icon",
  miniAvatars: false,
};

export default UserProfilePicture;
