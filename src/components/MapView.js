import React from "react";
import { DeckGL, ColumnLayer } from "@deck.gl/react";
import { geoData } from "../data/geoData";
import { CARTO_BASEMAP } from "../config";

const MapView = () => {
  const INITIAL_VIEW_STATE = {
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
    pitch: 45,
    bearing: 0,
  };

  const columnLayer = new ColumnLayer({
    data: geoData,
    diskResolution: 12,
    radius: 50000,
    extruded: true,
    pickable: true,
    elevationScale: 500,
    getPosition: (d) => d.coordinates,
    getFillColor: [255, 140, 0],
    getElevation: (d) => d.value,
  });

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={[columnLayer]}
      mapStyle={CARTO_BASEMAP}
    />
  );
};

export default MapView;
