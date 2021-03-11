import React from "react";

// Typings
import { ProjectModalProps } from "./ProjectModal.types";

// Styles
import * as S from "./ProjectModal.styles";
import Item from "./Item";
import { useUser } from "hooks/useUser";
import { Modal } from "react-bootstrap";
import { ROOM_TEMPLATES } from "settings";

const ProjectModal: React.FC<ProjectModalProps> = ({
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

export default ProjectModal;
