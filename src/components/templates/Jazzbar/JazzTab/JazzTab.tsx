import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

import { IFRAME_ALLOW } from "settings";
import { UserInfo } from "firebase/app";

import { User } from "types/User";
import { Venue } from "types/venues";

import { currentVenueSelectorData } from "utils/selectors";

import {
  EmojiReactionType,
  Reactions,
  TextReactionType,
} from "utils/reactions";

import Room from "../components/JazzBarRoom";

import CallOutMessageForm from "components/molecules/CallOutMessageForm/CallOutMessageForm";
import JazzBarTableComponent from "../components/JazzBarTableComponent";
import TableHeader from "components/molecules/TableHeader";
import TablesUserList from "components/molecules/TablesUserList";
// import UserList from "components/molecules/UserList";

import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
// import { useRecentVenueUsers } from "hooks/users";

import { addReaction } from "store/actions/Reactions";

import { JAZZBAR_TABLES } from "./constants";

import "./JazzTab.scss";
import { useExperiences } from "hooks/useExperiences";

interface JazzProps {
  setUserList: (value: User[]) => void;
  venue?: Venue;
}

interface ChatOutDataType {
  messageToTheBand: string;
}

type ReactionType =
  | { reaction: EmojiReactionType }
  | { reaction: TextReactionType; text: string };

const createReaction = (reaction: ReactionType, user: UserInfo) => {
  return {
    created_at: Date.now(),
    created_by: user.uid,
    ...reaction,
  };
};

const Jazz: React.FC<JazzProps> = ({ setUserList, venue }) => {
  const firestoreVenue = useSelector(currentVenueSelectorData);
  const venueToUse = venue ? venue : firestoreVenue;

  useExperiences(venueToUse?.name);

  const { user } = useUser();

  const jazzbarTables = venueToUse?.config?.tables ?? JAZZBAR_TABLES;

  // const { recentVenueUsers } = useRecentVenueUsers();

  const [seatedAtTable, setSeatedAtTable] = useState("");
  const [isAudioEffectDisabled, setIsAudioEffectDisabled] = useState(false);

  const dispatch = useDispatch();
  const venueId = useVenueId();

  const reactionClicked = (user: UserInfo, reaction: EmojiReactionType) => {
    dispatch(
      addReaction({
        venueId,
        reaction: createReaction({ reaction }, user),
      })
    );
    setTimeout(() => (document.activeElement as HTMLElement).blur(), 1000);
  };

  const [isMessageToTheBandSent, setIsMessageToTheBandSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBandSent) {
      setTimeout(() => {
        setIsMessageToTheBandSent(false);
      }, 2000);
    }
  }, [isMessageToTheBandSent, setIsMessageToTheBandSent]);

  const {
    register: registerBandMessage,
    handleSubmit: handleBandMessageSubmit,
    reset,
  } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onBandMessageSubmit = async (data: ChatOutDataType) => {
    setIsMessageToTheBandSent(true);
    user &&
      dispatch(
        addReaction({
          venueId,
          reaction: createReaction(
            { reaction: "messageToTheBand", text: data.messageToTheBand },
            user
          ),
        })
      );
    reset();
  };

  if (!venueToUse) return <>Loading...</>;

  return (
    <div className="music-bar-container">
      {venueToUse.description?.text && (
        <div className="row">
          <div className="col">
            <div className="description">{venueToUse.description?.text}</div>
          </div>
        </div>
      )}

      {seatedAtTable && (
        <TableHeader
          seatedAtTable={seatedAtTable}
          setSeatedAtTable={setSeatedAtTable}
          venueName={venueToUse.name}
          tables={jazzbarTables}
        />
      )}

      <div className="music-bar-content">
        <div className="music-bar-top-left-grid-cell" />
        <div className="music-bar-top-right-grid-cell" />
        <div className="video-container">
          {!venueToUse.hideVideo && (
            <>
              <div className="iframe-container">
                {venueToUse.iframeUrl ? (
                  <iframe
                    key="main-event"
                    title="main event"
                    className="iframe-video"
                    src={`${venueToUse.iframeUrl}?autoplay=1`}
                    frameBorder="0"
                    allow={IFRAME_ALLOW}
                  />
                ) : (
                  <div className="iframe-video">
                    Embedded Video URL not yet set up
                  </div>
                )}
              </div>
              <div className="actions-container">
                <div className="emoji-container">
                  {Reactions.map((reaction) => (
                    <div
                      key={reaction.name}
                      className="reaction"
                      onClick={() =>
                        user && reactionClicked(user, reaction.type)
                      }
                      id={`send-reaction-${reaction.type}`}
                    >
                      <span role="img" aria-label={reaction.ariaLabel}>
                        {reaction.text}
                      </span>
                    </div>
                  ))}
                  <div
                    className="mute-button"
                    onClick={() => setIsAudioEffectDisabled((state) => !state)}
                  >
                    <FontAwesomeIcon
                      className="reaction"
                      icon={isAudioEffectDisabled ? faVolumeMute : faVolumeUp}
                    />
                  </div>
                </div>
                <CallOutMessageForm
                  onSubmit={handleBandMessageSubmit(onBandMessageSubmit)}
                  ref={registerBandMessage({ required: true })}
                  isMessageToTheBandSent={isMessageToTheBandSent}
                  placeholder="Shout out..."
                />
              </div>
            </>
          )}
        </div>
        {seatedAtTable && (
          <Room
            roomName={`${venueToUse.name}-${seatedAtTable}`}
            venueName={venueToUse.name}
            setUserList={setUserList}
            setSeatedAtTable={setSeatedAtTable}
          />
        )}
        {/* // NOTE: Do we need userlist on this page? We don't have it on the designs */}
        {/* <UserList
          isAudioEffectDisabled={isAudioEffectDisabled}
          users={recentVenueUsers}
          activity={venue?.activity ?? "here"}
          disableSeeAll={false}
        /> */}
        <TablesUserList
          setSeatedAtTable={setSeatedAtTable}
          seatedAtTable={seatedAtTable}
          venueName={venueToUse.name}
          TableComponent={JazzBarTableComponent}
          joinMessage={!venueToUse?.hideVideo ?? true}
          customTables={jazzbarTables}
        />
      </div>
    </div>
  );
};

export default Jazz;
