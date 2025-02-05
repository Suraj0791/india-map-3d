let indiaGeoJSON = null;

export const loadGeoJSON = async () => {
  if (indiaGeoJSON) return indiaGeoJSON;

  try {
    // Using process.env.PUBLIC_URL to ensure correct path in production
    const response = await fetch(`${process.env.PUBLIC_URL}/india.geojson`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    indiaGeoJSON = await response.json();
    return indiaGeoJSON;
  } catch (error) {
    console.error("Error loading GeoJSON:", error);
    throw error;
  }
};
