import React from "react";

// Typings
import { RoomModalProps } from "./RoomModal.types";

// Styles
import * as S from "./RoomModal.styles";
import Item from "./Item";
import { useUser } from "hooks/useUser";
import { Modal } from "react-bootstrap";
import { ROOM_TEMPLATES } from "settings";

const RoomModal: React.FC<RoomModalProps> = ({
  isVisible = false,
  venueId,
  templates = ROOM_TEMPLATES,
  onSubmitHandler,
  onClickOutsideHandler,
  title = "Pick a room (type?)",
}) => {
  const { user } = useUser();

  if (!isVisible || !user) return null;

  return (
    <Modal show={isVisible} onHide={onClickOutsideHandler} size="lg">
      <S.InnerWrapper>
        <S.Title>{title}</S.Title>

        {templates.length > 0 &&
          templates.map((item) => (
            <Item
              {...item}
              key={item.name}
              venueId={venueId}
              user={user}
              onSubmitHandler={onSubmitHandler}
              startOpen={item.startOpen}
            />
          ))}
      </S.InnerWrapper>
    </Modal>
  );
};

export default RoomModal;
