export const elo = (players: number[], VP: number[]) => {
  const amountOfPlayers = players.length;
  const minVP = Math.min(...VP);

  const expected = players.map((_p, i) => {
    const sumPart = players.reduce((prev, acc, ri) => {
      if (ri === i) return prev;
      return prev + 1 / (1 + Math.pow(10, (acc - players[i]) / 400));
    }, 0);
    return sumPart / ((amountOfPlayers * (amountOfPlayers - 1)) / 2);
  });

  const sumForScores = VP.reduce((acc, curr) => {
    return acc + curr - minVP;
  }, 0);
  const scores = VP.map((v) => {
    const score = (v - minVP) / sumForScores;
    return isNaN(score) ? 0.5 : score;
  });

  return players.map(
    (p, i) => p + 32 * (amountOfPlayers - 1) * (scores[i] - expected[i]),
  );
};
