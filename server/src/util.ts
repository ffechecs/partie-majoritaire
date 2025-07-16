import {Vote} from "./db/schema/game";

export function determineSelectedMove(gameVotes: Vote[]): Vote | undefined {
  const gameVotesCount = gameVotes.reduce((acc, vote) => {
    acc[vote.moveSan] = (acc[vote.moveSan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const maxVotes = Object.entries(gameVotesCount).reduce(
    (acc, [moveSan, count]) => {
      if (count > acc.count) {
        return { movesSan: [moveSan], count };
      }
      if (count == acc.count) {
        acc.movesSan.push(moveSan);
        return { movesSan: acc.movesSan, count };
      }
      return acc;
    },
    { movesSan: [] as string[], count: 0 }
  );
  const maxVotedMoves = gameVotes.filter(
    (vote) => maxVotes.movesSan.includes(vote.moveSan)
  )
  return maxVotedMoves[Math.floor(Math.random() * maxVotedMoves.length)];
}