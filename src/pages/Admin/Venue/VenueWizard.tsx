import React, { useMemo, useCallback, useReducer, useEffect } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import "./Venue.scss";
import { TemplateForm } from "./TemplateForm";
import { DetailsForm } from "./DetailsForm";
import { useHistory, useParams } from "react-router-dom";
import { useQuery } from "hooks/useQuery";
import { Template, ALL_VENUE_TEMPLATES } from "settings";
import { useFirestore } from "react-redux-firebase";
import { Venue } from "types/Venue";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import { useUser } from "hooks/useUser";

export interface WizardPage {
  next?: (action: WizardActions) => void;
  previous?: () => void;
  state: WizardFormState;
}

interface WizardFormState {
  templatePage?: {
    template: Template;
  };
  detailsPage?: {
    venue: Venue;
  };
}
type WizardActions =
  | {
      type: "SUBMIT_TEMPLATE_PAGE";
      payload: Template;
    }
  | {
      type: "SUBMIT_DETAILS_PAGE";
      payload: Venue;
    };

const initialState = {};

const reducer = (
  state: WizardFormState,
  action: WizardActions
): WizardFormState => {
  switch (action.type) {
    case "SUBMIT_TEMPLATE_PAGE":
      return { ...state, templatePage: { template: action.payload } };
    case "SUBMIT_DETAILS_PAGE":
      return { ...state, detailsPage: { venue: action.payload } };
    default:
      throw new Error();
  }
};

export const VenueWizard: React.FC = () => {
  const { venueId } = useParams<{ venueId?: string }>();

  return venueId ? (
    <VenueWizardEdit venueId={venueId} />
  ) : (
    <VenueWizardCreate />
  );
};

interface VenueWizardEditProps {
  venueId: string;
}

const VenueWizardEdit: React.FC<VenueWizardEditProps> = ({ venueId }) => {
  // get the venue
  const firestore = useFirestore();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchVenueFromAPI = async () => {
      const venueSnapshot = await firestore
        .collection("venues")
        .doc(venueId)
        .get();
      if (!venueSnapshot.exists) return;
      const data = venueSnapshot.data() as Venue;
      //find the template
      const template = ALL_VENUE_TEMPLATES.find(
        (template) => data.template === template.template
      );
      if (!template) return;

      // ensure reducer is synchronised with API data
      dispatch({ type: "SUBMIT_TEMPLATE_PAGE", payload: template });
      dispatch({ type: "SUBMIT_DETAILS_PAGE", payload: data });
    };
    fetchVenueFromAPI();
  }, [firestore, venueId]);

  if (!state.detailsPage) return <div>Loading...</div>;
  return <DetailsForm venueId={venueId} state={state} />;
};

const VenueWizardCreate: React.FC = () => {
  const history = useHistory();
  const { user } = useUser();
  const queryParams = useQuery();

  const [state, dispatch] = useReducer(reducer, initialState);

  const parentIdQuery = queryParams.get("parentId");
  const hasParent = !!parentIdQuery;

  const queryPageString = queryParams.get("page");
  const queryPage = queryPageString ? parseInt(queryPageString) : 1;

  const next = useCallback(
    (action: WizardActions) => {
      dispatch(action);
      const path = `${history.location.pathname}?page=${queryPage + 1}`;

      history.push(hasParent ? `${path}&parentId=${parentIdQuery}` : path);
    },
    [hasParent, history, parentIdQuery, queryPage]
  );

  const previous = useCallback(() => {
    const path = `${history.location.pathname}?page=${queryPage - 1}`;

    history.push(hasParent ? `${path}&parentId=${parentIdQuery}` : path);
  }, [hasParent, history, parentIdQuery, queryPage]);

  const Page = useMemo(() => {
    switch (queryPage) {
      case 1:
        return <TemplateForm next={next} state={state} />;
      case 2:
        return <DetailsForm previous={previous} state={state} />;
      default:
        return <TemplateForm next={next} state={state} />;
    }
  }, [queryPage, next, previous, state]);

  if (!user) {
    return (
      <WithNavigationBar fullscreen>
        <AuthenticationModal show={true} onHide={() => {}} showAuth="login" />
      </WithNavigationBar>
    );
  }

  return <WithNavigationBar fullscreen>{Page}</WithNavigationBar>;
};
