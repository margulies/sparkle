import { VenueTemplate } from "types/VenueTemplate";
import {
  API_KEY,
  APP_ID,
  MEASUREMENT_ID,
  BUCKET_URL,
  PROJECT_ID,
  IS_BURN,
} from "./secrets";
import { venueLandingUrl } from "utils/url";
import { CSSProperties } from "react";

export const DEFAULT_PROFILE_IMAGE = "/anonymous-profile-icon.jpeg";
export const DEFAULT_PARTY_NAME = "Anon";
export const SPARKLEVERSE_MARKETING_URL = "https://sparklever.se/";
export const SPARKLEVERSE_LOGO_URL = "/sparkleverse-logo.png";
export const SPARKLE_LOGO_URL = "/sparkle-header.png";
export const MEMRISE_LOGO_URL = "/memrise-logo.png";
export const BURN_START_UTC_SECONDS = 1598770800; // Sunday Aug 30th, 2020 (easy to change later)
export const VENUE_CHAT_AGE_DAYS = 10;
export const DEFAULT_MAP_ICON_URL = "/icons/default-map-icon.png";
export const PLAYA_VENUE_NAME = "Jam";
export const PLAYA_VENUE_ID = "jamonline";
export const BURNING_MAN_DONATION_TITLE = `Donate to WWF Australia.`;
export const BURNING_MAN_DONATION_TEXT = `To assist in the rebuilding of the Australian ecology after the devastating fires over last summer.`;
export const BURNING_MAN_DONATION_SITE = `https://donate.wwf.org.au/donate/one-off-donation/one-off-donation`;
export const PLAYA_INFO_URL = "https://burningseed.sparklever.se/in/centrecamp";
export const PLAYA_INFO_NAME = "Jam Info Booth";
export const REALITY_RANGERS_URL =
  "https://redearthcity.zoom.us/j/5127329136?pwd=Zk9rVHhDNDJqLzJldlJ0M2VJdHBPdz09";
export const REALITY_RANGERS_NAME = "Red Earth Ranger Chat";
export const DEFAULT_USER_LIST_LIMIT = 22;
export const GIF_RESIZER_URL = "http://gifgifs.com/resizer/";
export const CREATE_EDIT_URL = "/admin";
export const SPARKLEVERSITY_URL = "https://sparklever.se/sparkleversity";
export const SPARKLEVERSE_COMMUNITY_URL =
  "https://www.facebook.com/groups/sparkleverse/";
export const TICKET_URL = "https://qkt.io/seed2020";
export const CURRENT_TIME_IN_LOCATION = "Matong State Forest";

export const DUST_STORM_TEXT_1 = `A dust storm is ripping across the ${PLAYA_VENUE_NAME}!`;
export const DUST_STORM_TEXT_2 =
  "Your only option is to seek shelter in a nearby venue!";

// Hide inactive avatars on playa
export const MAX_IDLE_TIME_MS = 10 * 60 * 1000;
// How often to refresh events schedule
export const REFETCH_SCHEDULE_MS = 10 * 60 * 1000; // 10 mins

// How often to refresh daypart logic
export const PLAYA_BG_DAYPART_MS = 60 * 1000; // 1 min

export const ROOM_IMAGE_WIDTH_PX = 300;
export const MAX_IMAGE_FILE_SIZE_BYTES = 1024 * 2000;
export const MAX_IMAGE_FILE_SIZE_TEXT = "2MB";
export const GIF_IMAGE_WIDTH_PX = 300;

// playa is 4000x4000 pixels, Burning Seed paddock is 2000x2000
export const PLAYA_WIDTH_AND_HEIGHT = 2000;
export const PLAYA_AVATAR_SIZE = 24;
export const PLAYA_VENUE_SIZE = 40;
export const PLAYA_ICON_SIDE_PERCENTAGE = 5;
// Burning Seed: playa is named paddock
export const PLAYA_IMAGE = "/maps/paddock2k.jpg";
export const PLAYA_HD_IMAGE = "/maps/playa16k.jpg";
// Add for Jam demo event, used for admin placement background.
export const JAM_IMAGE = "/maps/jam.jpg";
export const PLAYA_VENUE_STYLES: Record<string, CSSProperties> = {
  iconImage: {
    width: PLAYA_VENUE_SIZE,
    height: PLAYA_VENUE_SIZE,
    overflow: "hidden",
    borderRadius: "25%",
    background: "rgba(147, 124, 99, 0.2)",
    border: "2px solid rgba(147, 124, 99, 0.2)",
    animation: "ripple 4s linear infinite",
  },
  draggableIconImage: {
    width: PLAYA_VENUE_SIZE * 1.5,
    height: PLAYA_VENUE_SIZE * 1.5,
    overflow: "hidden",
    borderRadius: "25%",
    background: "rgba(147, 124, 99, 0.2)",
    border: "2px solid rgba(147, 124, 99, 0.2)",
    animation: "ripple 4s linear infinite",
  },
};

export const ZOOM_URL_TEMPLATES = [
  VenueTemplate.zoomroom,
  VenueTemplate.artcar,
];

export const VIDEO_IFRAME_TEMPLATES = [
  VenueTemplate.jazzbar,
  VenueTemplate.performancevenue,
  VenueTemplate.audience,
];

export const EMBED_IFRAME_TEMPLATES = [VenueTemplate.artpiece];

export const BACKGROUND_IMG_TEMPLATES = [VenueTemplate.themecamp];

export const SUBVENUE_TEMPLATES = [
  VenueTemplate.themecamp,
  VenueTemplate.partymap,
];

export const PLACEABLE_VENUE_TEMPLATES = [
  VenueTemplate.artcar,
  VenueTemplate.artpiece,
  VenueTemplate.friendship,
  VenueTemplate.jazzbar,
  VenueTemplate.partymap,
  VenueTemplate.performancevenue,
  VenueTemplate.themecamp,
  VenueTemplate.zoomroom,
];
export const PLAYA_TEMPLATES = [VenueTemplate.playa, VenueTemplate.preplaya];

export interface Template {
  template: VenueTemplate;
  name: string;
  description: Array<string>;
}

export const BURN_VENUE_TEMPLATES: Array<Template> = [
  {
    template: VenueTemplate.zoomroom, // keeping as zoom room for backward compatibility
    name: "Experience",
    description: [
      "Ideal for performances, debates, interactive sessions of all kinds: a Zoom room with its own spot on the Jam",
    ],
  },
  {
    template: VenueTemplate.themecamp,
    name: "Theme Camp",
    description: [
      "Add your camp to the Jam in the form of a clickable map; then add tents, bars, domes and other spaces to your camp map.",
    ],
  },
  {
    template: VenueTemplate.artpiece,
    name: "Art Piece",
    description: [
      "Embed any 2-D or 3-D art experience on the Jam with this special template, which allows viewers to chat to each other as they experience your art.",
    ],
  },
  {
    template: VenueTemplate.jazzbar,
    name: "Music Venue",
    description: [
      "Add a music venue with an embedded video and tables for people to join to have video chats and discuss life, the universe, and everything.",
    ],
  },
  {
    template: VenueTemplate.audience,
    name: "Auditorium",
    description: [
      "Add an auditorium with an embedded video and seats for people to take to watch the experience.",
    ],
  },
  {
    template: VenueTemplate.playa,
    name: "Playa",
    description: ["Add a Playa."],
  },
];

export const ALL_VENUE_TEMPLATES: Array<Template> = [
  ...BURN_VENUE_TEMPLATES,
  {
    template: VenueTemplate.jazzbar,
    name: "Jazz Bar",
    description: ["Create a jazzbar."],
  },

  {
    template: VenueTemplate.artcar,
    name: "Art Car",
    description: ["Create a space on the Jam that moves around."],
  },
  {
    template: VenueTemplate.performancevenue,
    name: "Performance Venue",
    description: [
      "Create a live performance space with tables, audience reactions and video chat between people in the venue.",
    ],
  },
];

export const ALL_BURN_TEMPLATES: Array<VenueTemplate> = [
  VenueTemplate.playa,
  VenueTemplate.preplaya,
  VenueTemplate.zoomroom,
  VenueTemplate.artcar,
  VenueTemplate.artpiece,
  VenueTemplate.audience,
  VenueTemplate.performancevenue,
  VenueTemplate.themecamp,
  VenueTemplate.avatargrid,
];

export const FIREBASE_CONFIG = {
  apiKey: API_KEY,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_URL,
};

export const DEFAULT_VENUE = IS_BURN ? "jamonline" : "hirespace";
export const DEFAULT_REDIRECT_URL = IS_BURN
  ? "/enter"
  : venueLandingUrl(DEFAULT_VENUE);

// Trouble connecting? Run a local relay:
// git clone git@github.com:sparkletown/sparkle-relay && cd sparkle-relay && docker-compose up
export const DEFAULT_WS_RELAY_URL = "ws://localhost:8080/";

export const USE_RANDOM_AVATAR = true;
export const RANDOM_AVATARS = [
  "avatar-01.png",
  "avatar-02.png",
  "avatar-03.png",
  "avatar-04.png",
  "avatar-05.png",
  "avatar-06.png",
  "avatar-07.png",
  "avatar-08.png",
  "avatar-09.png",
  "avatar-10.png",
  "avatar-11.png",
  "avatar-12.png",
];
