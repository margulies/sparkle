import { useState } from "react";

import { LOC_UPDATE_FREQ_MS, RECENT_USER_TIMEOUT_THRESHOLD } from "settings";
import { getHoursAgoInMilliseconds } from "utils/time";
import { useInterval } from "./useInterval";

const calcDefaultThreshold = () =>
  getHoursAgoInMilliseconds(RECENT_USER_TIMEOUT_THRESHOLD);

export const useUserLastSeenThreshold = (
  calcThreshold = calcDefaultThreshold
) => {
  const [threshold, setThreshold] = useState(calcThreshold());

  useInterval(() => {
    setThreshold(calcThreshold());
  }, LOC_UPDATE_FREQ_MS);

  return threshold;
};
