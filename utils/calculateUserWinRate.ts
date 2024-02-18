import { LatestMatches } from "./types/types.ts";

/**
 * Calculates the win rate of a user based on their match data.
 * @param matchData An array of objects representing the match data for a user.
 * Each object should have a `standing` property indicating the user's standing in the match.
 * @returns A string representing the win rate of the user in percentage format.
 * If there are no matches, returns "No matches played".
 */
export function calculateUserWinRate(matchData: LatestMatches[]): string {
  const totalMatches = matchData.length;
  if (totalMatches === 0) {
    return "No matches played";
  }

  const wins = matchData.reduce(
    (acc, match) => acc + (match.standing === 1 ? 1 : 0),
    0
  );
  const winRate = (wins / totalMatches) * 100;

  return `${winRate.toFixed(2)}%`;
}
