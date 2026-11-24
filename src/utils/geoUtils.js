/**
 * Geographic anomaly & location distance helpers
 */

export const isLocationSuspicious = (currentLoc, homeLoc) => {
  if (!currentLoc || !homeLoc) return false;
  return currentLoc.toLowerCase() !== homeLoc.toLowerCase();
};
