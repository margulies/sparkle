import React from "react";
import firebase from "firebase/app";
import "./VenueInfoEvents.scss";
import { AnyVenue } from "types/Firestore";
import { WithId } from "utils/id";
import { venuePlayaPreviewUrl } from "utils/url";

interface PropsType {
  eventsNow: firebase.firestore.DocumentData[];
  venue: WithId<AnyVenue>;
  showButton: boolean;
}

const VenueInfoEvents: React.FunctionComponent<PropsType> = ({
  eventsNow,
  venue,
  showButton,
}) => {
  return (
    <div className="venue-info-container">
      <div className="whats-on-container">
        <div className="title-container">
          <img src="/sparkle-icon.png" alt="sparkle icon" />
          <span className="title">{`What's on now`}</span>
        </div>
        <div className="description-container">
          {eventsNow.length > 0 ? (
            <>
              <span className="yellow">{eventsNow[0].name}</span>
              <span> by </span>
              <span className="yellow">{eventsNow[0].host}</span>
            </>
          ) : (
            <span className="yellow">No events currently</span>
          )}
        </div>
      </div>
      {showButton && (
        <div className="centered-flex">
          <button
            className="btn btn-primary"
            // @debt would be nice not to refresh the page
            onClick={() =>
              (window.location.href = venuePlayaPreviewUrl(venue.id))
            }
          >
            View on Playa
          </button>
        </div>
      )}
    </div>
  );
};

export default VenueInfoEvents;