// 

export const normalizeGeoJSONCoordinates = (coordinates, scale = 80) => {
  // Ideally, compute these from your full GeoJSON data rather than hardcode
  const bounds = {
    minX: 68.1,
    maxX: 97.4,
    minY: 6.5,
    maxY: 37.6,
  };
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  // Scale uniformly around the center
  return coordinates.map(([x, y]) => [
    ((x - centerX) / width) * scale,
    ((y - centerY) / height) * scale
  ]);
};
