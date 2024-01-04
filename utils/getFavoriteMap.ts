import { LatestMatches } from "@/utils/types/types.ts";

export function getFavoriteMap(matchData: LatestMatches[]): [string, number] {
  const mapCount: Record<string, number> = {};

  matchData.forEach((match) => {
    if (match?.matches?.maps?.name) {
      const mapName = match.matches.maps.name;
      if (mapCount[mapName]) {
        mapCount[mapName]++;
      } else {
        mapCount[mapName] = 1;
      }
    }
  });
  let favoriteMap = "";
  let maxCount = 0;

  Object.entries(mapCount).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favoriteMap = name;
    }
  });

  return [favoriteMap, maxCount];
}
