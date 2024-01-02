export function nameToColor(name: string): string {
  const hash = stringToColorHash(name);
  return hashToColor(hash);
}
function hashToColor(hash: number): string {
  const saturation = 100; // Saturation percentage
  const lightness = 70; // Lightness percentage

  // Use HSL color space to ensure enough contrast and brightness
  const hue = Math.abs(hash % 360); // Using the hash to get a hue value (0-360)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function stringToColorHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
