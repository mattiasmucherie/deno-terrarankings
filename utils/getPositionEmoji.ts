export function getPositionEmoji(index: number): string {
  switch (index) {
    case 0:
      return "🥇"; // 1st place
    case 1:
      return "🥈"; // 2nd place
    case 2:
      return "🥉"; // 3rd place
    default:
      return `${index + 1}.`; // Other positions
  }
}
