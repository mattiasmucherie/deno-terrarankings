import { LatestMatches } from "./types/types.ts";

export function getFavoriteCorporation(
  matchData: LatestMatches[],
): [string, number] {
  const corporationCount: Record<string, number> = {};

  matchData.forEach((match) => {
    if (match?.corporations?.name) {
      const corporationName = match.corporations.name;
      if (corporationCount[corporationName]) {
        corporationCount[corporationName]++;
      } else {
        corporationCount[corporationName] = 1;
      }
    }
  });

  let favoriteCorporation = "";
  let maxCount = 0;

  Object.entries(corporationCount).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favoriteCorporation = name;
    }
  });

  return [favoriteCorporation, maxCount];
}
