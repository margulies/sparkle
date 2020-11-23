import React, { useCallback, useState } from "react";
import { useFirestoreConnect } from "react-redux-firebase";

import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { filterUnreadPrivateChats } from "utils/filter";
import { chatUsersSelector, privateChatsSelector } from "utils/selectors";

import VenueChat from "components/molecules/VenueChat";
import ChatsList from "components/molecules/ChatsList";
import LiveSchedule from "components/molecules/LiveSchedule";

import "./Sidebar.scss";

enum TABS {
  PARTY_CHAT = 0,
  PRIVATE_CHAT = 1,
  LIVE_SCHEDULE = 2,
}

const Sidebar = () => {
  const venueId = useVenueId();
  useFirestoreConnect({
    collection: "users",
    where: ["enteredVenueIds", "array-contains", venueId],
    storeAs: "chatUsers",
  });
  const [tab, setTab] = useState(0);
  const privateChats = useSelector(privateChatsSelector);
  const chatUsers = useSelector(chatUsersSelector);
  const isEnabled = chatUsers && privateChats;
  const unreadMessages = filterUnreadPrivateChats(privateChats);
  const numberOfUnreadMessages = unreadMessages.length;

  const selectPartyChatTab = useCallback(() => {
    isEnabled && setTab(TABS.PARTY_CHAT);
  }, [isEnabled]);

  const selectPrivateChatTab = useCallback(() => {
    isEnabled && setTab(TABS.PRIVATE_CHAT);
  }, [isEnabled]);

  const selectLiveScheduleTab = useCallback(() => {
    isEnabled && setTab(TABS.LIVE_SCHEDULE);
  }, [isEnabled]);

  return (
    <div className="sidebar-container">
      <div className="sidebar-slide-btn">
        <div className="slide-btn-arrow-icon"></div>
        <div className="slide-btn-chat-icon"></div>
      </div>
      <div className="sidebar-tabs">
        <div
          className={`sidebar-tab sidebar-tab_chat ${
            tab === TABS.PARTY_CHAT && "active"
          }`}
          onClick={selectPartyChatTab}
        >
          Party Chat
        </div>
        <div
          className={`sidebar-tab sidebar-tab_private ${
            tab === TABS.PRIVATE_CHAT && "active"
          }`}
          onClick={selectPrivateChatTab}
        >
          <div>Messages</div>
          {!!numberOfUnreadMessages && (
            <div className="unread-messages">{numberOfUnreadMessages}</div>
          )}
        </div>

        <div
          className={`sidebar-tab sidebar-tab_schedule ${
            tab === TABS.LIVE_SCHEDULE && "active"
          }`}
          onClick={selectLiveScheduleTab}
        >
          Live Schedule
        </div>
      </div>

      {tab === TABS.PARTY_CHAT && <VenueChat />}
      {tab === TABS.PRIVATE_CHAT && <ChatsList />}
      {tab === TABS.LIVE_SCHEDULE && <LiveSchedule />}
    </div>
  );
};

export default Sidebar;
