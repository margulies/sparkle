import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { IFRAME_TEMPLATES } from "settings";

import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import { AdminVideo } from "components/molecules/AdminVideo";
import { BannerAdmin } from "components/organisms/BannerAdmin";

import "./AdminSidebar.scss";

export const AdminSidebar: React.FC = () => {
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);

  const toggleSidebar = useCallback(
    () => setShowAdminSidebar((prevState) => !prevState),
    []
  );

  const containerStyles = classNames("admin-sidebar", {
    "admin-sidebar--expanded": showAdminSidebar,
  });

  const venueId = useVenueId();
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  if (!venue) {
    return <></>;
  }

  const isVideoVenue = IFRAME_TEMPLATES.includes(venue.template);

  return (
    <>
      <div className={containerStyles}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__controller" onClick={toggleSidebar}>
            {showAdminSidebar ? (
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            ) : (
              <>
                <FontAwesomeIcon icon={faChevronLeft} size="sm" />
              </>
            )}
          </div>
        </div>
        <div className="admin-sidebar__contents">
          <h3>Admin Panel</h3>
          <BannerAdmin venueId={venueId} venue={venue} />
          {isVideoVenue && <AdminVideo venueId={venueId} venue={venue} />}
        </div>
      </div>
    </>
  );
};
