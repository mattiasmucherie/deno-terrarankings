import { LatestMatches } from "./types/types.ts";

export function getBestCorporation(
  matchData: LatestMatches[],
): [string, number] {
  const eloChangesByCorporation: Record<string, number> = {};

  matchData.forEach((match) => {
    if (match?.corporations?.name) {
      const corporationName = match.corporations.name;
      const eloChange = match.new_elo - match.old_elo;

      if (eloChangesByCorporation[corporationName]) {
        eloChangesByCorporation[corporationName] += eloChange;
      } else {
        eloChangesByCorporation[corporationName] = eloChange;
      }
    }
  });

  let bestCorporation = "";
  let maxEloGain = 0;

  Object.entries(eloChangesByCorporation).forEach(([name, eloChange]) => {
    // Looking for positive changes only, indicating a gain in Elo
    if (eloChange > maxEloGain) {
      maxEloGain = eloChange;
      bestCorporation = name;
    }
  });

  return [bestCorporation, Math.round(maxEloGain)];
}
