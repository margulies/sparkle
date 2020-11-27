import React, { useCallback, useEffect, useMemo, useState } from "react";
import firebase from "firebase/app";

import { User } from "types/User";
import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/PartyMapRoomData";

import { enterRoom } from "utils/useLocationUpdateEffect";
import { currentTimeInUnixEpoch } from "utils/time";
import { WithId } from "utils/id";
import { orderedVenuesSelector, partygoersSelector } from "utils/selectors";
import { openRoomUrl } from "utils/url";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { useKeyboardControls } from "hooks/useKeyboardControls";

import Sidebar from "components/molecules/Sidebar";
import UserProfileModal from "components/organisms/UserProfileModal";
import { PartyMapRoomOverlay } from "./PartyMapRoomOverlay";

import "./Map.scss";
import { makeCampRoomHitFilter } from "utils/filter";
import { hasElements } from "utils/types";

// @debt refactor these hooks into somewhere more sensible
import { useMapGrid } from "../../../Camp/hooks/useMapGrid";
import { usePartygoersOverlay } from "../../../Camp/hooks/usePartygoersOverlay";
import { usePartygoersbySeat } from "../../../Camp/hooks/usePartygoersBySeat";
import { ZoomControls } from "../ZoomControls";

interface PropsType {
  venue: PartyMapVenue;
  attendances: { [location: string]: number };
  selectedRoom: PartyMapRoomData | undefined;
  setSelectedRoom: (room: PartyMapRoomData | undefined) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

const DEFAULT_COLUMNS = 40;
const DEFAULT_ROWS = 25;
const MAX_ZOOM = 2;
const MIN_ZOOM = 1;
const ZOOM_INCREMENT = 0.25;

export const Map: React.FC<PropsType> = ({
  venue,
  attendances,
  selectedRoom,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  const venueId = venue.id;
  const { user, profile } = useUser();
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [rows, setRows] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [mapSize, setMapSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const columns = venue.columns ?? DEFAULT_COLUMNS;
  const currentPosition = profile?.data?.[venue.id];

  const columnsArray = useMemo(() => Array.from(Array<JSX.Element>(columns)), [
    columns,
  ]);
  const rowsArray = useMemo(() => Array.from(Array(rows)), [rows]);

  const venues = useSelector(orderedVenuesSelector);
  const partygoers: readonly WithId<User>[] | undefined = useSelector(
    partygoersSelector
  );

  useEffect(() => {
    const img = new Image();
    img.src = venue.mapBackgroundImageUrl ?? "";
    img.onload = () => {
      const imgRatio = img.width ? img.width / img.height : 1;
      const calcRows = venue.columns
        ? Math.round(parseInt(venue.columns.toString()) / imgRatio)
        : DEFAULT_ROWS;
      setMapSize({ width: img.width, height: img.height });
      setRows(calcRows);
    };
  }, [venue.columns, venue.mapBackgroundImageUrl]);

  const roomsHit = useMemo(() => {
    if (!currentPosition?.row || !currentPosition?.column) return [];

    const { row, column } = currentPosition;

    const roomHitFilter = makeCampRoomHitFilter({
      row,
      column,
      totalRows: rows,
      totalColumns: columns,
    });

    return venue.rooms.filter(roomHitFilter);
  }, [currentPosition, rows, columns, venue.rooms]);

  const detectRoomsOnMove = useCallback(() => {
    if (selectedRoom) {
      const noRoomHits = hasElements(roomsHit);
      if (!noRoomHits && selectedRoom) {
        setSelectedRoom(undefined);
        setIsRoomModalOpen(false);
      }
    }

    roomsHit.forEach((room) => {
      setSelectedRoom(room);
      setIsRoomModalOpen(true);
    });
  }, [roomsHit, selectedRoom, setIsRoomModalOpen, setSelectedRoom]);

  const takeSeat = useCallback(
    (row: number | null, column: number | null) => {
      if (!user || !profile || !venueId) return;
      const doc = `users/${user.uid}`;
      const existingData = profile?.data;
      const update = {
        data: {
          ...existingData,
          [venueId]: {
            row,
            column,
          },
        },
      };
      const firestore = firebase.firestore();
      firestore
        .doc(doc)
        .update(update)
        .catch(() => {
          firestore.doc(doc).set(update);
        });
    },
    [profile, user, venueId]
  );

  const enterPartyMapRoom = useCallback(
    (room: PartyMapRoomData) => {
      if (!room || !user) return;

      // TODO: we could process this once to make it look uppable directly? What does the data key of venues look like?
      const roomVenue = venues?.find((venue) =>
        room.url.endsWith(`/${venue.id}`)
      );

      const roomName = {
        [`${venue.name}/${room.title}`]: currentTimeInUnixEpoch,
        ...(roomVenue ? { [venue.name]: currentTimeInUnixEpoch } : {}),
      };

      openRoomUrl(room.url);
      enterRoom(user, roomName, profile?.lastSeenIn);
    },
    [profile, user, venue.name, venues]
  );

  const { partygoersBySeat, isSeatTaken } = usePartygoersbySeat({
    venueId,
    partygoers: partygoers ?? [],
  });

  const enterSelectedRoom = useCallback(() => {
    if (!selectedRoom) return;

    enterPartyMapRoom(selectedRoom);
  }, [enterPartyMapRoom, selectedRoom]);

  const onSeatClick = useCallback(
    (row: number, column: number, seatedPartygoer: WithId<User> | null) => {
      if (!seatedPartygoer) {
        takeSeat(row, column);
      }
    },
    [takeSeat]
  );

  useKeyboardControls({
    venueId,
    totalRows: rows,
    totalColumns: columns,
    isSeatTaken,
    takeSeat,
    enterSelectedRoom,
    onMove: detectRoomsOnMove,
  });

  const isUserProfileSelected: boolean = !!selectedUserProfile;

  const deselectUserProfile = useCallback(
    () => setSelectedUserProfile(undefined),
    []
  );

  const userUid = user?.uid;
  const showGrid = venue.showGrid;
  const mapGrid = useMapGrid({
    showGrid,
    userUid,
    columnsArray,
    rowsArray,
    partygoersBySeat,
    onSeatClick,
  });

  const partygoersOverlay = usePartygoersOverlay({
    showGrid,
    userUid,
    venueId,
    withMiniAvatars: venue.miniAvatars,
    rows,
    columns,
    partygoers,
    setSelectedUserProfile,
  });

  const roomOverlay = useMemo(
    () =>
      venue.rooms.map((room) => (
        <PartyMapRoomOverlay
          key={room.title}
          venue={venue}
          room={room}
          attendances={attendances}
          setSelectedRoom={setSelectedRoom}
          setIsRoomModalOpen={setIsRoomModalOpen}
          // onEnterRoom={enterPartyMapRoom}
        />
      )),
    [attendances, setIsRoomModalOpen, setSelectedRoom, venue]
  );

  const zoomIn = useCallback(() => {
    setZoom((zoom) => Math.min(zoom + ZOOM_INCREMENT, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((zoom) => Math.max(zoom - ZOOM_INCREMENT, MIN_ZOOM));
  }, []);

  if (!user || !venue) {
    return <>Loading map...</>;
  }

  const translateX =
    (((mapSize.width * zoom - (mapSize.width * zoom) / zoom) / zoom) * 2) / 4;
  const translateY =
    (((mapSize.height * zoom - (mapSize.height * zoom) / zoom) / zoom) * 2) / 4;
  const bgRatio = mapSize.width / mapSize.height;
  console.log(bgRatio);

  return (
    <div className="party-map-content-container">
      <div className="party-map-container">
        <div
          className="party-map-content"
          style={{
            width: mapSize.width,
            height: mapSize.height,
            transform: `scale(${zoom}) translate3d(${translateX}px, ${translateY}px, 0)`,
          }}
        >
          {/* <img
            width={'100%'}
            height={'100%'}
            className="party-map-background"
            src={venue.mapBackgroundImageUrl}
            alt=""
          /> */}

          <div
            className="party-map-grid-container"
            style={{
              width: mapSize.width,
              height: mapSize.height,
              backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
              gridTemplateColumns: `repeat(${columns}, calc(100% / ${columns}))`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
            }}
          >
            {mapGrid}
            {partygoersOverlay}
          </div>
          {roomOverlay}

          {/* <div style={{display: 'relative'}}>
            <div className="party-map-zoom-container">
                <div
                  className={`party-map-zoom-in ${
                    zoom >= MAX_ZOOM ? "disabled" : ""
                  }`}
                  onClick={zoomIn}
                ></div>
                <div
                  className={`party-map-zoom-out ${
                    zoom <= MIN_ZOOM ? "disabled" : ""
                  }`}
                  onClick={zoomOut}
                >
                </div>
              </div>
            </div> */}

          {selectedUserProfile && (
            <UserProfileModal
              show={isUserProfileSelected}
              onHide={deselectUserProfile}
              userProfile={selectedUserProfile}
            />
          )}
        </div>

        <ZoomControls
          disableZoomIn={zoom >= MAX_ZOOM}
          disableZoomOut={zoom <= MIN_ZOOM}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />

        <div
          className="map-zoom-preview"
          style={{
            backgroundImage: `url(${venue.mapBackgroundImageUrl})`,
            width: 120,
            height: 120 / bgRatio,
          }}
        >
          <div className="map-zoom-icon"></div>
          <div className="map-zoom-position"></div>
          <div className="map-avatar-position"></div>
          <div className="map-zoom-rooms">
            {/* <div className="map-zoom-room map-zoom-room-1" style='background-image:url("./img/map-room-1.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-2" style='background-image:url("./img/map-room-2.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-3" style='background-image:url("./img/map-room-3.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-4" style='background-image:url("./img/map-room-4.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-5" style='background-image:url("./img/map-room-5.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-6" style='background-image:url("./img/map-room-6.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-7" style='background-image:url("./img/map-room-7.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-8" style='background-image:url("./img/map-room-8.png");'>	</div> */}
          </div>
        </div>
      </div>

      <div className="sidebar">
        <Sidebar />
      </div>
    </div>
  );
};
