export const normalizeGeoJSONCoordinates = (coordinates, scale = 100) => {
  // India's approximate bounds
  const bounds = {
    minX: 68.1, // Westernmost point
    maxX: 97.4, // Easternmost point
    minY: 6.5,  // Southernmost point
    maxY: 35.5, // Northernmost point
  };

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const aspectRatio = width / height;

  return coordinates.map(([x, y]) => [
    ((x - bounds.minX) / width - 0.5) * scale * aspectRatio,
    ((y - bounds.minY) / height - 0.5) * scale,
  ]);
};
