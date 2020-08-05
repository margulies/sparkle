import React, { useState, useEffect } from "react";
import "./EntranceExperience.scss";
import { updateTheme } from "pages/VenuePage/helpers";
import InformationCard from "components/molecules/InformationCard";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { VenueTemplate } from "types/VenueTemplate";
import SecretPasswordForm from "components/molecules/SecretPasswordForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { VenueEvent } from "types/VenueEvent";
import EventPaymentButton from "components/molecules/EventPaymentButton";
import PaymentModal from "components/organisms/PaymentModal";
import { hasUserBoughtTicketForEvent } from "utils/hasUserBoughtTicket";
import { isUserAMember } from "utils/isUserAMember";
import CountDown from "components/molecules/CountDown";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import { useUser } from "hooks/useUser";
import { ONE_MINUTE_IN_SECONDS } from "utils/time";
import { Firestore } from "types/Firestore";
import { Link } from "react-router-dom";

export interface EntranceExperienceProps {
  venue: Firestore["data"]["currentVenue"];
  venueEvents?: Firestore["ordered"]["venueEvents"];
  venueRequestStatus: Firestore["status"]["requested"]["currentVenue"];
  purchaseHistory?: Firestore["ordered"]["userPurchaseHistory"];
  venueId?: string;
}

export const EntranceExperience: React.FunctionComponent<EntranceExperienceProps> = (
  props
) => {
  const {
    venue,
    venueEvents,
    venueRequestStatus,
    purchaseHistory,
    venueId,
  } = props;
  dayjs.extend(advancedFormat);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<VenueEvent | undefined>();
  const [isAuthenticationModalOpen, setIsAuthenticationModalOpen] = useState(
    false
  );
  const [shouldOpenPaymentModal, setShouldOpenPaymentModal] = useState(false);
  const [eventPaidSuccessfully, setEventPaidSuccessfully] = useState<
    string | undefined
  >();

  const { user } = useUser();

  const futureOrOngoingVenueEvents = venueEvents?.filter(
    (event: VenueEvent) =>
      event.start_utc_seconds + event.duration_minutes * ONE_MINUTE_IN_SECONDS >
      Date.now() / 1000
  );

  const isUserVenueOwner = user && venue?.owners?.includes(user.uid);

  venue && updateTheme(venue);

  useEffect(() => {
    if (shouldOpenPaymentModal && !isAuthenticationModalOpen) {
      setIsPaymentModalOpen(true);
      setShouldOpenPaymentModal(false);
    }
  }, [shouldOpenPaymentModal, isAuthenticationModalOpen]);

  if (venueRequestStatus && !venue) {
    return <>This venue does not exist</>;
  }

  if (!venue) {
    return <>Loading...</>;
  }

  const nextVenueEventId = futureOrOngoingVenueEvents?.[0]?.id;

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const openAuthenticationModal = () => {
    setIsAuthenticationModalOpen(true);
  };

  const closeAuthenticationModal = () => {
    setIsAuthenticationModalOpen(false);
  };

  return (
    <>
      <div className="container venue-entrance-experience-container">
        <div
          className="header"
          style={{
            background: `linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8) 2%,
            rgba(0, 0, 0, 0) 98%
          ), url(${venue.config.landingPageConfig.coverImageUrl}`,
            backgroundSize: "cover",
          }}
        >
          <div className="venue-host">
            <div className="host-icon-container">
              <img className="host-icon" src={venue.host.icon} alt="host" />
            </div>
            <div className="title">{venue.name}</div>
            <div className="subtitle">
              {venue.config.landingPageConfig.subtitle}
            </div>
          </div>
          {venue.template === VenueTemplate.partymap && (
            <div className="secret-password-form-wrapper">
              <SecretPasswordForm />
            </div>
          )}
        </div>
        {venue.template === VenueTemplate.partymap && (
          <div className="secret-password-form-wrapper">
            <SecretPasswordForm
              buttonText={venue.config.landingPageConfig.joinButtonText}
            />
          </div>
        )}
        <div className="row">
          <div className="col-lg-6 col-12 venue-presentation">
            <div>
              {venue.config.landingPageConfig.checkList &&
                venue.config.landingPageConfig.checkList.map(
                  (checkListItem: string, index: number) => (
                    <div
                      key={`checklist-item-${index}`}
                      className="checklist-item"
                    >
                      <div className="check-icon-container">
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </div>
                      <div>{checkListItem}</div>
                    </div>
                  )
                )}
            </div>
            <iframe
              title="entrance video"
              width="100%"
              height="300"
              className="youtube-video"
              src={venue.config.landingPageConfig.videoIframeUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
            />
            {venue.config.landingPageConfig.quotations &&
              venue.config.landingPageConfig.quotations.map(
                (quotation, index) => (
                  <div className="quotation-container" key={index}>
                    <div className="quotation">{quotation.text}</div>
                    <div className="quotation-author">- {quotation.author}</div>
                  </div>
                )
              )}
            {venue.config.landingPageConfig.presentation &&
              venue.config.landingPageConfig.presentation.map(
                (paragraph: string, index: number) => (
                  <p
                    key={`venue-presentation-paragraph-${index}`}
                    className="presentation-paragraph"
                  >
                    {paragraph}
                  </p>
                )
              )}
          </div>
          <div className="col-lg-6 col-12 oncoming-events">
            {venueId &&
              futureOrOngoingVenueEvents &&
              futureOrOngoingVenueEvents.length > 0 && (
                <>
                  <div className="upcoming-gigs-title">Upcoming gigs</div>
                  {futureOrOngoingVenueEvents.map((venueEvent: VenueEvent) => {
                    const startingDate = new Date(
                      venueEvent.start_utc_seconds * 1000
                    );
                    const endingDate = new Date(
                      (venueEvent.start_utc_seconds +
                        60 * venueEvent.duration_minutes) *
                        1000
                    );
                    const isNextVenueEvent = venueEvent.id === nextVenueEventId;
                    const hasUserBoughtTicket =
                      user &&
                      (hasUserBoughtTicketForEvent(
                        purchaseHistory,
                        venueEvent.id
                      ) ||
                        isUserAMember(user.email, venue.config.memberEmails));
                    return (
                      <InformationCard
                        title={venueEvent.name}
                        key={venueEvent.id}
                        className={`${!isNextVenueEvent ? "disabled" : ""}`}
                      >
                        <div className="date">
                          {`${dayjs(startingDate).format("ha")}-${dayjs(
                            endingDate
                          ).format("ha")} ${dayjs(startingDate).format(
                            "dddd MMMM Do"
                          )}`}
                        </div>
                        <div className="event-description">
                          {venueEvent.description}
                          {venueEvent.descriptions?.map(
                            (description, index) => (
                              <p key={index}>{description}</p>
                            )
                          )}
                        </div>
                        <div className="button-container">
                          {hasUserBoughtTicket ? (
                            <div>
                              <div>You have a ticket for this event</div>
                              <CountDown
                                startUtcSeconds={venueEvent.start_utc_seconds}
                              />
                            </div>
                          ) : (
                            <div className="price-container">
                              Individual tickets £{venueEvent.price / 100}
                              <br />
                              Group tickets £{venueEvent.collective_price / 100}
                              {!user && (
                                <div className="login-invitation">
                                  {"Already have a ticket? "}
                                  <span
                                    className="link"
                                    onClick={openAuthenticationModal}
                                  >
                                    Log in
                                  </span>
                                  .
                                </div>
                              )}
                            </div>
                          )}

                          {user ? (
                            <EventPaymentButton
                              event={venueEvent}
                              venueId={venueId}
                              selectEvent={() => setSelectedEvent(venueEvent)}
                              setIsPaymentModalOpen={setIsPaymentModalOpen}
                              paymentConfirmationPending={
                                eventPaidSuccessfully === venueEvent.id
                              }
                            />
                          ) : (
                            <button
                              className="btn btn-primary buy-tickets-button"
                              onClick={() => {
                                setSelectedEvent(venueEvent);
                                openAuthenticationModal();
                              }}
                            >
                              Buy tickets
                            </button>
                          )}
                        </div>
                      </InformationCard>
                    );
                  })}
                </>
              )}
            {isUserVenueOwner && (
              <InformationCard title="Enter the venue as an admin">
                <div className="button-container">
                  <div>This is a fake event. Only you can see it.</div>
                  <Link to={`/v/${venueId}/live`}>
                    <button
                      role="link"
                      className="btn btn-primary buy-tickets-button"
                    >
                      Join the event
                    </button>
                  </Link>
                </div>
              </InformationCard>
            )}
          </div>
        </div>
      </div>
      {user && selectedEvent && (
        <PaymentModal
          selectedEvent={selectedEvent}
          show={isPaymentModalOpen}
          onHide={closePaymentModal}
          setEventPaidSuccessfully={setEventPaidSuccessfully}
          eventPaidSuccessfully={eventPaidSuccessfully}
        />
      )}
      <AuthenticationModal
        show={isAuthenticationModalOpen}
        onHide={closeAuthenticationModal}
        afterUserIsLoggedIn={() => setShouldOpenPaymentModal(true)}
        showAuth="register"
      />
    </>
  );
};
