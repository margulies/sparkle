import React, { useState } from "react";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import InformationCard from "../InformationCard";
import "./SparkleFairiesPopUp.scss";
import {
  PLAYA_INFO_NAME,
  PLAYA_INFO_URL,
  REALITY_RANGERS_NAME,
  REALITY_RANGERS_URL,
} from "../../../../src/settings";

const SparkleFairiesPopUp: React.FunctionComponent = () => {
  const [isLeftColumnExpanded, setIsLeftColumnExpanded] = useState(false);

  return (
    <InformationLeftColumn
      venueLogoPath={"ambulance"}
      isLeftColumnExpanded={isLeftColumnExpanded}
      setIsLeftColumnExpanded={setIsLeftColumnExpanded}
    >
      <InformationCard title="Information">
        <div style={{ textAlign: "center" }}>
          <p className="title-sidebar">{`If you're looking for information, please check out these resources:`}</p>
          <a
            href={PLAYA_INFO_URL}
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            {PLAYA_INFO_NAME}
          </a>
          <div className="title">Call a Ranger</div>
          <p className="title-sidebar">
            Need Support or Having Burning Questions?
          </p>
          <p className="title-sidebar">
            Playa Info and Multiverse Rangers are here to Help.
          </p>
          <a
            href={REALITY_RANGERS_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="btn btn-primary join-button"
            style={{ fontSize: 14 }}
          >
            {REALITY_RANGERS_NAME}
          </a>
        </div>
      </InformationCard>
    </InformationLeftColumn>
  );
};

export default SparkleFairiesPopUp;
