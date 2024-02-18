import { LatestMatches } from "./types/types.ts";

export function getWorstCorporation(
  matchData: LatestMatches[],
): [string, number] {
  const eloChangesByCorporation: Record<string, number> = {};

  for (const match of matchData) {
    if (match?.corporations?.name) {
      const corporationName = match.corporations.name;
      const eloChange = match.new_elo - match.old_elo;

      if (corporationName in eloChangesByCorporation) {
        eloChangesByCorporation[corporationName] += eloChange;
      } else {
        eloChangesByCorporation[corporationName] = eloChange;
      }
    }
  }

  let worstCorporation = "";
  let maxEloLoss = 0;

  for (const [name, eloChange] of Object.entries(eloChangesByCorporation)) {
    if (eloChange < maxEloLoss) {
      maxEloLoss = eloChange;
      worstCorporation = name;
    }
  }
  return [worstCorporation, Math.floor(maxEloLoss)];
}
