import { RoomData_v2 } from "types/rooms";
import { RoomTemplate } from "settings";

export interface RoomModalProps {
  isVisible: boolean;
  templates?: RoomTemplate[]; //string[];
  venueId: string;
  onSubmitHandler: () => void;
  onClickOutsideHandler: () => void;
  editingRoom?: RoomData_v2 | null;
  title?: string;
}
