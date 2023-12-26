import { UserMatchData } from "./db.ts";

export function calculateUserWinRate(matchData: UserMatchData): string {
  const totalMatches = matchData.length;
  if (totalMatches === 0) {
    return "No matches played";
  }

  const wins = matchData.reduce(
    (acc, match) => acc + (match.standing === 1 ? 1 : 0),
    0,
  );
  const winRate = (wins / totalMatches) * 100;

  return `${winRate.toFixed(2)}%`;
}
