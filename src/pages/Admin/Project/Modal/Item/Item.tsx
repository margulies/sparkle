import React, { Fragment, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as S from "./Item.styles";
import { useForm } from "react-hook-form";
import ImageInput from "components/atoms/ImageInput";
import {
  faChevronCircleDown,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { createProject, createVenue_v2, VenueInput_v2 } from "api/admin";
import { CustomInputsType } from "settings";
import { ProjectModalItemProps } from "./Item.types";
import { roomCreateSchema } from "pages/Admin/Details/ValidationSchema";

const ProjectModalItem: React.FC<ProjectModalItemProps> = ({
  name,
  icon,
  description,
  venueId,
  user,
  onSubmitHandler,
  template,
  editValues,
  customInputs,
  startOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(startOpen);
  // const [useUrl, setUseUrl] = useState<boolean>(false);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (editValues) {
      setIsOpen(true);
    }
  }, [editValues]);

  const {
    register,
    watch,
    errors,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    reValidateMode: "onChange",
    validationSchema: roomCreateSchema,
    defaultValues: {
      venueName: "",
      url: editValues ? editValues.url : "",
      title: editValues ? editValues.title : "",
      description: editValues ? editValues.description : "",
      image_url: editValues ? editValues.image_url : "",
    },
  });

  const values = watch();

  const onSubmit = useCallback(async () => {
    if (!user || !venueId) return;

    try {
      const valuesWithTemplate = {
        ...values,
        template,
        isEnabled: true,
      };

      const list = new DataTransfer();

      const fileList = list.files;

      const venueInput: VenueInput_v2 = {
        name: values.venueName,
        subtitle: "",
        description: "",
        template: template,
        bannerImageFile: fileList,
        bannerImageUrl: "",
        logoImageUrl: "",
        mapBackgroundImageUrl: "",
        logoImageFile: fileList,
        rooms: [],
      };

      try {
        if (!editValues) {
          await createVenue_v2(venueInput, user);
        }
        await createProject(valuesWithTemplate, venueId, user);

        onSubmitHandler();
      } catch (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  }, [editValues, onSubmitHandler, template, user, values, venueId]);

  const handleOnChange = (val: string) => setValue("image_url", val);

  const renderVenueNameInput = () => (
    <Fragment>
      <S.InputWrapper key={"venueName"}>
        <span>
          Project name (without spaces) - this will be used to create the
          project URL
        </span>

        <input
          type="text"
          placeholder="Projectname"
          name={"venueName"}
          ref={register}
        />
      </S.InputWrapper>

      {errors.venueName && (
        <span className="input-error">{errors.venueName.message}</span>
      )}
    </Fragment>
  );

  const renderNameInput = () => (
    <Fragment>
      <S.InputWrapper>
        <span>Project name</span>
        <input
          type="text"
          ref={register}
          name="title"
          placeholder="Project name"
        />
      </S.InputWrapper>
      {errors.title && (
        <span className="input-error">{errors.title.message}</span>
      )}
    </Fragment>
  );

  const renderDescriptionInput = () => (
    <S.InputWrapper>
      <span>Project description</span>
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
      <span>How you want the project to appear on the map</span>

      <ImageInput
        onChange={handleOnChange}
        name="image"
        forwardRef={register}
        small
        nameWithUnderscore
        imgUrl={editValues ? editValues.image_url : ""}
      />
      {errors.image_url && (
        <span className="input-error">{errors.image_url.message}</span>
      )}
    </S.InputWrapper>
  );

  const renderCustomInput = (input: CustomInputsType) => (
    <S.InputWrapper key={input.name}>
      <span>{input.title}</span>

      <input type="text" name={input.name} ref={register} />
    </S.InputWrapper>
  );

  return (
    <S.Wrapper isOpen={isOpen}>
      <S.Header>
        <S.ItemIcon src={icon} alt="venue thumb" />

        <S.TitleWrapper>
          <S.Title>{name}</S.Title>
          <S.Description>{description}</S.Description>
        </S.TitleWrapper>

        <FontAwesomeIcon
          icon={isOpen ? faChevronCircleUp : faChevronCircleDown}
          onClick={() => toggleIsOpen()}
          style={{ gridArea: "plus" }}
        />
      </S.Header>

      <S.InnerWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderNameInput()}

          {renderVenueNameInput()}

          {renderDescriptionInput()}

          {customInputs &&
            customInputs.map((input: CustomInputsType) =>
              renderCustomInput(input)
            )}

          {renderLogoInput()}

          <Button type="submit" disabled={isSubmitting}>
            Create project
          </Button>
        </form>
      </S.InnerWrapper>
    </S.Wrapper>
  );
};

export default ProjectModalItem;
