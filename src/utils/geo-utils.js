export const normalizeGeoJSONCoordinates = (coordinates, scale = 80) => {
  // Define expected bounds for India (in degrees)
  const bounds = {
    minX: 68.1,
    maxX: 97.4,
    minY: 6.5,
    maxY: 37.6,
  };

  // Compute the center of India in degrees
  const centerX = (bounds.minX + bounds.maxX) / 2; // ~82.75
  const centerY = (bounds.minY + bounds.maxY) / 2; // ~22.05

  // For each [longitude, latitude] pair, center and scale.
  // Note: We invert the y-axis so that higher latitude appears upward.
  return coordinates.map(([x, y]) => [
    (x - centerX) * scale,
    -(y - centerY) * scale,
  ]);
};
