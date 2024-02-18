/**
 * Returns an emoji based on the position index provided.
 * @param index - The position index.
 * @param noDot - If true, the function will not append a dot to the position index. Default is false.
 * @returns The emoji corresponding to the position index.
 */
export function getPositionEmoji(index: number, noDot = false): string {
  switch (index) {
    case 0:
      return "🥇"; // 1st place
    case 1:
      return "🥈"; // 2nd place
    case 2:
      return "🥉"; // 3rd place
    default:
      return `${index + 1}${noDot ? "" : "."}`; // Other positions
  }
}
