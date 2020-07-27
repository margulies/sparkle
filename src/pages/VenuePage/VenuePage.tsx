import React from "react";
import { useSelector } from "react-redux";
import useUpdateLocationEffect from "utils/useLocationUpdateEffect";
import JazzbarRouter from "components/venues/Jazzbar/JazzbarRouter";
import PartyMap from "components/venues/PartyMap";
import { User as FUser } from "firebase";
import FriendShipPage from "pages/FriendShipPage";
import { User } from "types/User";
import ChatContext from "components/context/ChatContext";
import { updateTheme } from "./helpers";
import useConnectPartyGoers from "hooks/useConnectPartyGoers";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { Redirect, useParams } from "react-router-dom";
import { Purchase } from "types/Purchase";
import { VenueEvent } from "types/VenueEvent";
import { Venue } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";
import useConnectCurrentEvent from "hooks/useConnectCurrentEvent";
import { canUserJoinTheEvent } from "utils/time";
import CountDown from "components/molecules/CountDown";

const VenuePage = () => {
  const { venueId, eventId } = useParams();

  useConnectPartyGoers();
  useConnectCurrentVenue();
  useConnectCurrentEvent();

  const {
    venue,
    user,
    users,
    usersById,
    eventPurchase,
    eventPurchaseRequestStatus,
    event,
    eventRequestStatus,
    venueRequestStatus,
  } = useSelector((state: any) => ({
    venue: state.firestore.data.currentVenue,
    venueRequestStatus: state.firestore.status.requested.currentVenue,
    user: state.user,
    users: state.firestore.ordered.partygoers,
    event: state.firestore.data.currentEvent,
    usersById: state.firestore.data.partygoers,
    eventRequestStatus: state.firestore.status.requested.currentEvent,
    eventPurchase: state.firestore.data.eventPurchase,
    eventPurchaseRequestStatus: state.firestore.status.requested.eventPurchase,
  })) as {
    venue: Venue;
    user: FUser;
    users: User[];
    eventPurchase: Purchase;
    eventPurchaseRequestStatus: boolean;
    event: VenueEvent;
    usersById: { [id: string]: User };
    eventRequestStatus: boolean;
    venueRequestStatus: boolean;
  };

  venue && updateTheme(venue);

  const venueName = venue && venue.name;
  useUpdateLocationEffect(user, venueName);

  if (!eventPurchase || !venue || !users || !venue) {
    return <>Loading...</>;
  }

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (eventRequestStatus && !event) {
    return <>This event does not exist</>;
  }

  if (!event || (event.price > 0 && !eventPurchase) || !venue || !users) {
    return <>Loading...</>;
  }

  if (event.price > 0 && eventPurchaseRequestStatus && !eventPurchase) {
    return <>Forbidden</>;
  }

  if (!canUserJoinTheEvent(event)) {
    return (
      <CountDown
        startUtcSeconds={event.start_utc_seconds}
        textBeforeCountdown="Bar opens in"
      />
    );
  }

  if (!user) {
    return <Redirect to={`/venue/${venueId}`} />;
  }

  if (
    !(usersById?.[user.uid]?.partyName && usersById?.[user.uid]?.pictureUrl)
  ) {
    return (
      <Redirect to={`/account/profile?venueId=${venueId}&eventId=${eventId}`} />
    );
  }

  let template;
  switch (venue.template) {
    case VenueTemplate.jazzbar:
      template = <JazzbarRouter />;
      break;
    case VenueTemplate.friendship:
      template = <FriendShipPage />;
      break;
    case VenueTemplate.partymap:
      template = <PartyMap />;
      break;
  }

  return <ChatContext>{template}</ChatContext>;
};

export default VenuePage;
