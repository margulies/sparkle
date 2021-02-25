import { HAS_ROOMS_TEMPLATES } from "settings";

import { EntranceStepConfig } from "./EntranceStep";
import { Quotation } from "./Quotation";
import { Room } from "./rooms";
import { Table } from "./Table";
import { UpcomingEvent } from "./UpcomingEvent";
import { VenueAccessMode } from "./VenueAcccess";
import { VideoAspectRatio } from "./VideoAspectRatio";

// TODO: should JazzBarVenue be added to this?
export type AnyVenue = Venue | PartyMapVenue;

export enum VenueTemplate {
  jazzbar = "jazzbar",
  friendship = "friendship",
  partymap = "partymap",
  zoomroom = "zoomroom",
  themecamp = "themecamp",
  artpiece = "artpiece",
  artcar = "artcar",
  performancevenue = "performancevenue",
  preplaya = "preplaya",
  playa = "playa",
  audience = "audience",
  conversationspace = "conversationspace",
  firebarrel = "firebarrel",

  /**
   * @deprecated Legacy template removed, perhaps try VenueTemplate.partymap instead?
   */
  avatargrid = "avatargrid",
}

// --- VENUE V2
export interface Venue_v2
  extends Venue_v2_Base,
    Venue_v2_AdvancedConfig,
    Venue_v2_EntranceConfig {}

export interface Venue_v2_Base {
  name: string;
  config: {
    landingPageConfig: {
      subtitle: string;
      description: string;
      coverImageUrl: string;
    };
  };
  host: {
    icon: string;
  };
  owners: string[];
  theme?: {
    primaryColor: string;
    backgroundColor?: string;
  };
  id: string;
  rooms?: Room[];
  mapBackgroundImageUrl?: string;
}

export interface Venue_v2_AdvancedConfig {
  attendeesTitle?: string;
  bannerMessage?: string;
  chatTitle?: string;
  columns?: number;
  radioStations?: string | string[]; // single string on form, array in DB
  requiresDateOfBirth?: boolean;
  roomVisibility?: RoomVisibility;
  showBadges?: boolean;
  showGrid?: boolean;
  showNametags?: string;
  showRadio?: boolean;
  showRangers?: boolean;
  showZendesk?: boolean;
}

export interface Venue_v2_EntranceConfig {
  profile_questions?: Array<Question>;
  code_of_conduct_questions?: Array<Question>;
  entrance?: EntranceStepConfig[];
}

// @debt refactor this into separated logical chunks? (eg. if certain params are only expected to be set for certain venue types)
export interface Venue {
  parentId?: string;
  template: VenueTemplate;
  name: string;
  access?: VenueAccessMode;
  entrance?: EntranceStepConfig[];
  config?: VenueConfig;
  host?: {
    icon: string;
  };
  profile_questions: Question[];
  code_of_conduct_questions: Question[];
  owners: string[];
  iframeUrl?: string;
  events?: Array<UpcomingEvent>; //@debt typing is this optional? I have a feeling this no longer exists @chris confirm
  mapIconImageUrl?: string;
  placement?: VenuePlacement;
  zoomUrl?: string;
  mapBackgroundImageUrl?: string;
  placementRequests?: string;
  radioStations?: string[];
  radioTitle?: string;
  dustStorm?: boolean;
  activity?: string;
  bannerMessage?: string;
  playaIcon?: PlayaIcon;
  playaIcon2?: PlayaIcon;
  miniAvatars?: boolean;
  adultContent?: boolean;
  showAddress?: boolean;
  showGiftATicket?: boolean;
  columns?: number;
  rows?: number;
  nightCycle?: boolean;
  hasPaidEvents?: boolean;
  profileAvatars?: boolean;
  hideVideo?: boolean;
  showLiveSchedule?: boolean;
  showGrid?: boolean;
  roomVisibility?: RoomVisibility;
  rooms?: Room[];
  width: number;
  height: number;
  description?: {
    text: string;
  };
  showLearnMoreLink?: boolean;
  liveScheduleOtherVenues?: string[];
  start_utc_seconds?: number;
  attendeesTitle?: string;
  requiresDateOfBirth?: boolean;
  ticketUrl?: string;
  showRangers?: boolean;
  chatTitle?: string;
  showReactions?: boolean;
  auditoriumColumns?: number;
  auditoriumRows?: number;
  videoAspect?: VideoAspectRatio;
  termsAndConditions: TermOfService[];
  showRadio?: boolean;
  showBadges?: boolean;
  showNametags?: string;
  showZendesk?: boolean;
}

// @debt which of these params are exactly the same as on Venue? Can we simplify this?
export interface PartyMapVenue extends Venue {
  id: string;
  template: VenueTemplate.partymap;
  host?: {
    url: string;
    icon: string;
    name: string;
  };
  description?: {
    text: string;
    program_url?: string;
  };
  start_utc_seconds?: number;
  duration_hours?: number;
  entrance_hosted_hours?: number;
  party_name?: string;
  unhosted_entry_video_url?: string;
  map_url?: string;
  map_viewbox?: string;
  password?: string;
  admin_password?: string;
  owners: string[];
  rooms?: Room[];
}

export interface JazzbarVenue extends Venue {
  template: VenueTemplate.jazzbar;
  iframeUrl: string;
  logoImageUrl: string;
  host: {
    icon: string;
  };
}

export interface Question {
  name: string;
  text: string;
  link?: string;
}

interface TermOfService {
  name: string;
  text: string;
  link?: string;
}

export enum RoomVisibility {
  hover = "hover",
  count = "count",
  nameCount = "count/name",
}

export interface VenueConfig {
  theme: {
    primaryColor: string;
    backgroundColor?: string;
  };

  // @debt landingPageConfig should probably be undefined, or is it guaranteed to exist everywhere?
  landingPageConfig: VenueLandingPageConfig;
  redirectUrl?: string;
  memberEmails?: string[];
  showRangers?: boolean;
  tables?: Table[];
}

export interface VenueLandingPageConfig {
  coverImageUrl: string;
  subtitle: string;
  description?: string;
  presentation: string[];
  bannerImageUrl?: string;
  checkList: string[];
  iframeUrl?: string;
  joinButtonText?: string;
  quotations?: Quotation[];
}

export interface VenuePlacement {
  x: number;
  y: number;
  addressText?: string;
  state?: VenuePlacementState;
}

export enum VenuePlacementState {
  SelfPlaced = "SELF_PLACED",
  AdminPlaced = "ADMIN_PLACED",
  Hidden = "HIDDEN",
}

export interface PlayaIcon {
  x: number;
  y: number;
  fire: boolean;
  visible: boolean;
  className: string;
  clickable: boolean;
  venueId: string;
}

export interface VenueEvent {
  name: string;
  start_utc_seconds: number;
  description: string;
  descriptions?: string[];
  duration_minutes: number;
  price: number;
  collective_price: number;
  host: string;
  room?: string;
  id?: string;
}

export const isVenueWithRooms = (venue: AnyVenue): venue is PartyMapVenue =>
  HAS_ROOMS_TEMPLATES.includes(venue.template);

export const isPartyMapVenue = (venue: Venue): venue is PartyMapVenue =>
  venue.template === VenueTemplate.partymap;

export const urlFromImage = (
  defaultValue: string,
  filesOrUrl?: FileList | string
) => {
  if (typeof filesOrUrl === "string") return filesOrUrl;
  return filesOrUrl && filesOrUrl.length > 0
    ? URL.createObjectURL(filesOrUrl[0])
    : defaultValue;
};
