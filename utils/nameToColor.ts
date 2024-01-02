export function nameToColor(name: string): string {
  const hash = stringToColorHash(name);
  return hashToColor(hash);
}
function hashToColor(hash: number): string {
  // Ensure each color component has a minimum brightness
  const minBrightness = 50; // Adjust this value to set the minimum brightness

  // Extract RGB components from the hash
  const red = (hash & 0xFF0000) >> 16;
  const green = (hash & 0x00FF00) >> 8;
  const blue = hash & 0x0000FF;

  // Adjust each component to ensure a minimum brightness
  const adjustedRed = Math.min(255, red + minBrightness).toString(16).padStart(
    2,
    "0",
  );
  const adjustedGreen = Math.min(255, green + minBrightness).toString(16)
    .padStart(2, "0");
  const adjustedBlue = Math.min(255, blue + minBrightness).toString(16)
    .padStart(2, "0");

  return `#${adjustedRed}${adjustedGreen}${adjustedBlue}`;
}

function stringToColorHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
