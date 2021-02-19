import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import Parser from "html-react-parser";

import { useChatSidebarControls } from "hooks/chatSidebar";

import "./AnnouncementMessage.scss";

type AnnouncementMessageProps = {
  message?: string;
};

export const AnnouncementMessage: React.FC<AnnouncementMessageProps> = ({
  message = "",
}) => {
  const [isVisible, setVisibility] = useState<boolean>(false);
  const { isExpanded } = useChatSidebarControls();

  const hideAnnouncement = useCallback(() => {
    setVisibility(false);
  }, []);

  useEffect(() => {
    if (message) {
      setVisibility(true);
    }
  }, [message]);

  if (!isVisible || !message) return null;

  return (
    <div
      className={classNames("announcement-container", {
        centered: !isExpanded,
      })}
    >
      {Parser(message)}
      <span className="close-button" onClick={hideAnnouncement}>
        <FontAwesomeIcon icon={faTimesCircle} />
      </span>
    </div>
  );
};

/**
 * @deprecated use named export instead
 */
export default AnnouncementMessage;
