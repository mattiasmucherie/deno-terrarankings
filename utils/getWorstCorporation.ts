import { LatestMatches } from "./types/types.ts";

export function getWorstCorporation(
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

  let worstCorporation = "";
  let maxEloLoss = 0;

  Object.entries(eloChangesByCorporation).forEach(([name, eloChange]) => {
    if (eloChange < maxEloLoss) {
      maxEloLoss = eloChange;
      worstCorporation = name;
    }
  });
  return [worstCorporation, Math.round(maxEloLoss)];
}
