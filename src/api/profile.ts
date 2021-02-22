import Bugsnag from "@bugsnag/js";
import firebase from "firebase/app";

export interface MakeUpdateUserGridLocationProps {
  venueId: string;
  userUid: string;
}

export const makeUpdateUserGridLocation = ({
  venueId,
  userUid,
}: MakeUpdateUserGridLocationProps) => (
  row: number | null,
  column: number | null,
  handUp: boolean | false,
  handOpt?: boolean | false
) => {
  const firestore = firebase.firestore();

  const doc = `users/${userUid}`;

  if (handOpt) {
    const newData = {
      [`data.${venueId}.handUp`]: handUp,
    };
    firestore.doc(doc).update(newData);
  } else {
    const newData = {
      [`data.${venueId}`]: {
        row,
        column,
        handUp,
      },
    };
    // @debt refactor this to use a proper upsert pattern instead of error based try/catch logic
    firestore
      .doc(doc)
      .update(newData)
      .catch((err) => {
        Bugsnag.notify(err, (event) => {
          event.severity = "info";

          event.addMetadata(
            "notes",
            "TODO",
            "refactor this to use a proper upsert pattern (eg. check that the doc exists, then insert or update accordingly), rather than using try/catch"
          );

          event.addMetadata("api::profile::makeUpdateUserGridLocation", {
            venueId,
            userUid,
            doc,
          });
        });

        firestore.doc(doc).set(newData);
      });
  }
};
