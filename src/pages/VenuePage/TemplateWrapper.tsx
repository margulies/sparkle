import React from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import { Venue, VenueTemplate } from "types/venues";

import { FriendShipPage } from "pages/FriendShipPage";

import { ArtPiece } from "components/templates/ArtPiece";
import { Audience } from "components/templates/Audience/Audience";
import { ConversationSpace } from "components/templates/ConversationSpace";
import { FireBarrel } from "components/templates/FireBarrel";
import { Jazzbar } from "components/templates/Jazzbar";
import { PartyMap } from "components/templates/PartyMap";
import { PlayaRouter } from "components/templates/Playa/Router";
import { AdminSidebar } from "components/organisms/AdminSidebar";
import { ReactionPage } from "components/templates/ReactionPage";

import { ChatSidebar } from "components/organisms/ChatSidebar";
import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { AnnouncementMessage } from "components/molecules/AnnouncementMessage";

import { useIsUserVenueOwner } from "hooks/useIsUserVenueOwner";
export interface TemplateWrapperProps {
  venue: Venue;
}

const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ venue }) => {
  const history = useHistory();
  const isVenueOwner = useIsUserVenueOwner();
  const match = useRouteMatch();

  let template;
  // @debt remove backButton from Navbar
  let hasBackButton = true;
  let fullscreen = false;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = (
        <Switch>
          <Route path={`${match.path}/reactions`} component={ReactionPage} />
          <Route component={Jazzbar} />
        </Switch>
      );
      hasBackButton = false;
      break;

    case VenueTemplate.friendship:
      template = <FriendShipPage />;
      break;

    case VenueTemplate.partymap:
    case VenueTemplate.themecamp:
      template = <PartyMap />;
      break;

    case VenueTemplate.artpiece:
      template = <ArtPiece />;
      break;

    case VenueTemplate.playa:
    case VenueTemplate.preplaya:
      template = <PlayaRouter />;
      fullscreen = true;
      break;

    case VenueTemplate.zoomroom:
    case VenueTemplate.performancevenue:
    case VenueTemplate.artcar:
      if (venue.zoomUrl) {
        window.location.replace(venue.zoomUrl);
      }
      template = (
        <p>
          Venue {venue.name} should redirect to a URL, but none was set.
          <br />
          <button
            role="link"
            className="btn btn-primary"
            onClick={() => history.goBack()}
          >
            Go Back
          </button>
        </p>
      );
      break;

    // Note: This is the template that is used for the Auditorium
    case VenueTemplate.audience:
      template = (
        <Switch>
          <Route path={`${match.path}/reactions`} component={ReactionPage} />
          <Route component={Audience} />
        </Switch>
      );
      fullscreen = true;
      break;

    case VenueTemplate.conversationspace:
      template = <ConversationSpace />;
      break;

    case VenueTemplate.firebarrel:
      template = <FireBarrel />;
      break;

    case VenueTemplate.avatargrid:
      template = (
        <div>
          Legacy Template: ${venue.template} has been removed from the platform
        </div>
      );
      break;

    default:
      template = <div>Unknown Template: ${venue.template}</div>;
  }

  return (
    // @debt remove backButton from Navbar
    <WithNavigationBar fullscreen={fullscreen} hasBackButton={hasBackButton}>
      <AnnouncementMessage message={venue?.bannerMessage} />
      {template}
      <ChatSidebar />
      {isVenueOwner && <AdminSidebar />}
    </WithNavigationBar>
  );
};

export default TemplateWrapper;
