import React, { useState } from "react";
import "./ArtPiece.scss";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import { useSelector } from "hooks/useSelector";
import InformationCard from "components/molecules/InformationCard";
import ChatDrawer from "components/organisms/ChatDrawer";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import Room from "components/organisms/Room";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";
import { Modal } from "react-bootstrap";
import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";
import { IS_BURN } from "secrets";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import BannerMessage from "components/molecules/BannerMessage";
import { currentVenueSelectorData } from "utils/selectors";
import { IFRAME_ALLOW } from "settings";

export const ArtPiece = () => {
  const venue = useSelector(currentVenueSelectorData);

  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);
  const [showEventSchedule, setShowEventSchedule] = useState(false);

  if (!venue) return <>Loading...</>;

  const iframeUrl = ConvertToEmbeddableUrl(venue.iframeUrl);
  return (
    <WithNavigationBar>
      <BannerMessage venue={venue} />
      <div className="full-page-container art-piece-container">
        <InformationLeftColumn
          venueLogoPath={venue?.host.icon ?? ""}
          isLeftColumnExpanded={isLeftColumnExpanded}
          setIsLeftColumnExpanded={setIsLeftColumnExpanded}
        >
          <InformationCard title="About the venue">
            <p className="title-sidebar">{venue.name}</p>
            <p className="short-description-sidebar" style={{ fontSize: 18 }}>
              {venue.config?.landingPageConfig.subtitle}
            </p>
            <p style={{ fontSize: 13 }}>
              {venue.config?.landingPageConfig.description}
            </p>
          </InformationCard>
        </InformationLeftColumn>
        <div className="content">
          <iframe
            className="youtube-video"
            title="art-piece-video"
            src={iframeUrl}
            frameBorder="0"
            allow={IFRAME_ALLOW}
            allowFullScreen
          ></iframe>
          <div className="video-chat-wrapper">
            <Room
              venueName={venue.name}
              roomName={venue.name}
              setUserList={() => null}
              hasChairs={false}
              defaultMute={true}
            />
          </div>
          <div className="chat-pop-up" style={{ zIndex: 100 }}>
            <ChatDrawer
              title={`${venue.name ?? "Art Piece"} Chat`}
              roomName={venue.name}
              chatInputPlaceholder="Chat"
              defaultShow={true}
            />
          </div>
        </div>
      </div>
      {IS_BURN && (
        <div className="sparkle-fairies">
          <SparkleFairiesPopUp />
        </div>
      )}
      <Modal
        show={showEventSchedule}
        onHide={() => setShowEventSchedule(false)}
        dialogClassName="custom-dialog"
      >
        <Modal.Body>
          <SchedulePageModal />
        </Modal.Body>
      </Modal>
    </WithNavigationBar>
  );
};

/**
 * @deprecated use named export instead
 */
export default ArtPiece;
