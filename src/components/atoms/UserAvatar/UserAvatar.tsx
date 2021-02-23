import React from "react";
import classNames from "classnames";
import { faHandPaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./UserAvatar.scss";

export interface UserAvatarProps {
  isOnline?: boolean;
  onClick?: () => void;
  avatarSrc?: string;
  handUp?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  onClick,
  avatarSrc,
  isOnline,
  handUp,
}) => {
  const containerStyles = classNames("user-avatar", {
    "user-avatar--clickable": onClick !== undefined,
  });

  return (
    <div className={containerStyles}>
      <img
        onClick={onClick}
        className="user-avatar__image"
        src={avatarSrc}
        alt="user avatar"
      />
      {isOnline && <span className="user-avatar__status-dot" />}
      {handUp && (
        <FontAwesomeIcon
          className="user-avatar__status-hand"
          icon={faHandPaper}
        />
      )}
    </div>
  );
};
