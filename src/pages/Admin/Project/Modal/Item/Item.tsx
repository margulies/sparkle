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
  const [useUrl, setUseUrl] = useState<boolean>(false);

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
        if (!editValues && !useUrl) {
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
  }, [editValues, onSubmitHandler, template, useUrl, user, values, venueId]);

  const handleOnChange = (val: string) => setValue("image_url", val);

  const handleUrlToggle = useCallback(() => {
    setUseUrl((value) => !value);
  }, []);

  const renderUrlToggle = () => (
    <S.UrlToggleWrapper>
      <S.Flex>
        <h4 className="italic input-header">Create project space</h4>
      </S.Flex>
      <S.Flex>
        <label id={"useUrl"} className="switch">
          <input
            type="checkbox"
            id={"useUrl"}
            name={"useUrl"}
            checked={useUrl}
            onChange={handleUrlToggle}
            ref={register}
          />
          <span className="slider round"></span>
        </label>
      </S.Flex>
      <S.Flex>
        <h4 className="italic input-header">Use external space</h4>
      </S.Flex>
    </S.UrlToggleWrapper>
  );

  const renderVenueNameInput = () => (
    <Fragment>
      <S.InputWrapper key={"venueName"}>
        <span>Short project name (for creating link)</span>

        <input
          type="text"
          placeholder="projectname"
          name={"venueName"}
          ref={register}
        />
      </S.InputWrapper>

      {errors.venueName && (
        <span className="input-error">{errors.venueName.message}</span>
      )}
    </Fragment>
  );

  const renderUrlInput = () => (
    <Fragment>
      <S.InputWrapper key={"url"}>
        <span>Where your project will be meeting</span>
        <input
          type="text"
          ref={register}
          name="url"
          placeholder="Project url"
        />
      </S.InputWrapper>
      {errors.url && <span className="input-error">{errors.url.message}</span>}
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
          placeholder="Project name (shown on map)"
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
          {renderUrlToggle()}

          {!useUrl && renderVenueNameInput()}
          {useUrl && renderUrlInput()}

          {renderNameInput()}
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