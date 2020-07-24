import React from "react";
import { getTimeBeforeParty } from "utils/time";

interface PropsType {
  startUtcSeconds: number;
  textBeforeCountdown?: string;
}

const CountDown: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  textBeforeCountdown,
}) => {
  const timeBeforeParty = getTimeBeforeParty(startUtcSeconds);
  const isPartyOngoing = timeBeforeParty === 0;
  return !isPartyOngoing ? (
    <div className="primary count-down-container">
      {`${textBeforeCountdown || "Party begins in"} ${timeBeforeParty}`}
    </div>
  ) : (
    <></>
  );
};

export default CountDown;
