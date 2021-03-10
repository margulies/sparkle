import React, { useMemo } from "react";
import Countdown from "react-countdown";

// import { IFRAME_TEMPLATES } from "settings";

import { useVenueId } from "hooks/useVenueId";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

// import { AdminVideo } from "components/molecules/AdminVideo";

import "./VenuePresenterPage.scss";

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

export const VenuePresenterPage: React.FC = () => {
  const venueId = useVenueId();
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const { handsRaised } = useHandsRaised();
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

  // const isVideoVenue = IFRAME_TEMPLATES.includes(venue.template);

  return (
    <>
      <h3>Presenter Panel</h3>
      <Countdown date={Date.now() + 10000} />
      {/* {isVideoVenue && <AdminVideo venueId={venueId} venue={venue} />} */}

      <>
        <h3>Hands Raised</h3>
        {renderedHandsRaisedUsers}
      </>
    </>
  );
};
