export const normalizeGeoJSONCoordinates = (coordinates, scale = 80) => {
  // Updated bounds to include all states
  const bounds = {
    minX: 68.1, // Western point (Gujarat)
    maxX: 97.4, // Eastern point (Arunachal Pradesh)
    minY: 6.5, // Southern point (Kanyakumari)
    maxY: 37.6, // Northern point (Kashmir)
  };

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const aspectRatio = width / height;

  // Improved normalization with better scaling
  return coordinates.map(([x, y]) => [
    ((x - bounds.minX) / width - 0.5) * scale * 1.5, // Increased horizontal scale
    ((y - bounds.minY) / height - 0.45) * scale * 1.2, // Adjusted vertical position and scale
  ]);
};
