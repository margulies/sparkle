/* eslint-disable */
import React, { useCallback, useState, useMemo } from "react";
import QRCode from "qrcode.react";
import Countdown from "react-countdown";
//import { OrderedMap } from "immutable";
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

import { useHandsRaised } from "hooks/users";
import { User } from "types/User";
import { UserAvatar } from "components/atoms/UserAvatar";
import { WithId } from "utils/id";
// import { makeUpdateUserGridLocation } from "api/profile";

interface HandsRaisedUserProps {
  key: string;
  user: User;
  //venueId?: string;
  onClick?: () => void;
}
export const HandsRaisedUser: React.FC<HandsRaisedUserProps> = ({
  key,
  user,
  // venueId,
}) => {
  // const takeSeat = (
  //   row: number | null,
  //   column: number | null,
  //   handUp: boolean,
  //   handOpt?: boolean | false
  // ) => {
  //   if (!venueId) return;

  //   makeUpdateUserGridLocation({
  //     venueId,
  //     userUid,
  //   })(row, column, handUp, handOpt);
  // };

  return (
    <div className="hand-user">
      <UserAvatar
        avatarSrc={user.pictureUrl}
        handUp
        // onClick={() => takeSeat(null, null, false, true)}
      />
      <div className="hand-user__name">{user.partyName}</div>
    </div>
  );
};

export interface GetUserToDisplayProps<T> {
  id2: string;
  handUpAtOrd: number;
  User: T;
}
export const getUserToDisplay = <T extends User = User>({
  id2,
  handUpAtOrd,
  User,
}: GetUserToDisplayProps<T>) => {
  return {
    id2,
    handUpAtOrd,
    ...User,
  };
};

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

  let { handsRaised } = useHandsRaised();
  let sortedHandsRaised = useMemo(
    () =>
      handsRaised.map((id) =>
        getUserToDisplay<WithId<User>>({
          id2: String(id.handUpAt?.valueOf()),
          handUpAtOrd: Number(id.handUpAt?.valueOf()),
          User: id,
        })
      ),
    [handsRaised]
  );
  sortedHandsRaised = sortedHandsRaised
    .slice()
    .sort((a, b) => a.handUpAtOrd - b.handUpAtOrd);
  console.log(sortedHandsRaised);

  const renderedHandsRaisedUsers = useMemo(
    () =>
      sortedHandsRaised.map((user) => {
        if (user.id2) {
          return (
            <HandsRaisedUser
              key={user.id2}
              user={user}
              //venueId={venueId}
              // onClick={() =>
              // makeUpdateUserGridLocation({
              //   venueId,
              //   user.id,
              // })(null, null, false, true)
              //   void
              // }
            />
          );
        } else {
          return <></>;
        }
      }),
    [sortedHandsRaised] // venueId]
  );

  if (!venue) {
    return <></>;
  }

  const isVideoVenue = IFRAME_TEMPLATES.includes(venue.template);

  const Completionist = () => <span>Time to wrap up</span>;
  // const renderer = ({hours: 1,
  //   minutes: 2,
  //   seconds: 2, completed }) => {
  //   if (completed) {
  //     return <Completionist />;
  //   } else {
  //     return (
  //       <span>
  //         {zeroPad({hours})}:{zeroPad({minutes})}:{zeroPad({seconds})}
  //       </span>
  //     );
  //   }
  // };

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
          <h3>Admin Panel</h3>
        </div>
        <div className="admin-sidebar__contents">
          <div className="countdownTimer">
            <h3>Time Remaining</h3>
            <div style={{ fontSize: "3rem" }}>
              <Countdown date={Date.now() + 10000} />
            </div>
          </div>
          <BannerAdmin venueId={venueId} venue={venue} />
          {isVideoVenue && <AdminVideo venueId={venueId} venue={venue} />}
          {isVideoVenue && (
            <>
              <br></br>
              <h3>Hands Raised</h3>
              {renderedHandsRaisedUsers}
            </>
          )}
        </div>
        {/* https://github.com/zpao/qrcode.react
          And figure out how to include token in link */}
        <div
          className="qrcode"
          style={{ bottom: "50px", right: "10px", position: "fixed" }}
        >
          Scan to view this panel on your phone or tablet during the
          presentation:
          <QRCode
            value="http://primedre.space/in/auditorium/presenter"
            size={100}
            fgColor="#000000"
            bgColor="#ffffff"
            level="L"
            renderAs="svg"
            includeMargin={false}
          />
        </div>
      </div>
    </>
  );
};
