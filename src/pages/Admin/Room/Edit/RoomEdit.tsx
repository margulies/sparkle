import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ImageInput from "components/atoms/ImageInput";

import * as S from "./RoomEdit.styles";
import { CustomInputsType, RoomTemplate, ROOM_TEMPLATES } from "settings";
import { Button } from "react-bootstrap";
import { EditRoomProps } from "./RoomEdit.types";

const EditRoom: React.FC<EditRoomProps> = ({
  isVisible,
  onClickOutsideHandler,
  room,
  submitHandler,
  deleteHandler,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    room.template!
  );
  const [roomTemplate, setRoomTemplate] = useState<RoomTemplate | null>(null);

  useEffect(() => {
    const template = ROOM_TEMPLATES.find(
      (i) => i.template === selectedTemplate
    );
    setRoomTemplate(template!);
  }, [selectedTemplate]);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting, dirty },
  } = useForm({
    defaultValues: {
      title: room.title,
      url: room.url,
      description: room.description,
      tempalte: room.template,
    },
  });

  const values = watch();

  const handleImageChange = (val: string) => setValue("image_url", val, false);

  const renderNameInput = () => (
    <Form.Row>
      <S.InputWrapper>
        <Form.Label>Name your room</Form.Label>
        <Form.Control
          type="text"
          ref={register}
          name="title"
          placeholder="Room name"
          custom
        />
      </S.InputWrapper>
    </Form.Row>
  );

  const renderUrlInput = () => (
    <S.InputWrapper>
      <span>The room url</span>
      <input type="text" ref={register} name="url" placeholder="Room url" />
    </S.InputWrapper>
  );

  const renderDescriptionInput = () => (
    <S.InputWrapper>
      <span>The room description (optional)</span>
      <input
        type="text"
        ref={register}
        name="description"
        placeholder="Description"
      />
    </S.InputWrapper>
  );

  const renderLogoInput = () => (
    <S.InputWrapper>
      <span>How you want the room to appear on the map</span>

      <ImageInput
        onChange={handleImageChange}
        name="image"
        forwardRef={register}
        small
        nameWithUnderscore
        imgUrl={room.image_url}
      />
    </S.InputWrapper>
  );

  const renderCustomInput = (input: CustomInputsType) => (
    <S.InputWrapper key={input.name}>
      <span>{input.title}</span>

      <input type="text" name={input.name} ref={register} />
    </S.InputWrapper>
  );

  const renderTemplateSelect = () => {
    return (
      <S.InputWrapper>
        <Form.Label>Change room template</Form.Label>
        <Form.Control
          as="select"
          custom
          name="tempalte"
          ref={register}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedTemplate(e.target.value)
          }
        >
          {ROOM_TEMPLATES.map((template) => (
            <option key={template.name}>{template.template}</option>
          ))}
        </Form.Control>
      </S.InputWrapper>
    );
  };

  const onSubmit = () => submitHandler(values, room.roomIndex!);

  return (
    <Modal show={isVisible} onHide={onClickOutsideHandler}>
      <Modal.Header>
        <Modal.Title>Editing - {room.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {renderNameInput()}
          {renderUrlInput()}
          {renderDescriptionInput()}
          {renderLogoInput()}

          {roomTemplate?.customInputs?.map((input) => renderCustomInput(input))}

          {renderTemplateSelect()}

          <S.ButtonsWrapper>
            <Button variant="danger" onClick={deleteHandler}>
              Delete room
            </Button>

            <Button type="submit" disabled={isSubmitting || !dirty}>
              Save room
            </Button>
          </S.ButtonsWrapper>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditRoom;
