





import React, { useEffect, useState, useCallback } from "react";
// Import from the Mapbox endpoint as required in react-map-gl v8+
import Map, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";


const MAPBOX_TOKEN = "pk.eyJ1Ijoic3VyYWplYzQwMTEiLCJhIjoiY202ejNiOTZ6MDBqdzMwb2UzMmwwcHpyYSJ9.tlpmkvcdX-6SQMR2AY8Nug"; // Replace with your Mapbox



// GeoJSON for Indian states boundaries (only states, not districts)
const boundariesGeoJSONUrl =
  "https://raw.githubusercontent.com/datameet/india-geojson/master/india_states.geojson";

// PhonePe’s actual API endpoint for state-level transaction hover data
const phonepeHoverDataUrl =
  "https://raw.githubusercontent.com/PhonePe/pulse/master/data/map/transaction/hover/country/india/2021/1.json";

const Map3D = () => {
  const [boundaries, setBoundaries] = useState(null);
  const [phonepeData, setPhonepeData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  // Fetch the GeoJSON boundaries for Indian states
  useEffect(() => {
    fetch(boundariesGeoJSONUrl)
      .then((res) => res.json())
      .then((data) => setBoundaries(data))
      .catch((err) => console.error("Error fetching boundaries:", err));
  }, []);

  // Fetch the actual PhonePe transaction hover data from their API
  useEffect(() => {
    fetch(phonepeHoverDataUrl)
      .then((res) => res.json())
      .then((data) => {
        // Assuming the structure: { data: { hoverData: { state: { ... } } } }
        setPhonepeData(data.data.hoverData.state);
      })
      .catch((err) => console.error("Error fetching PhonePe data:", err));
  }, []);

  // Merge PhonePe data with boundaries GeoJSON.
  // Assumes each feature has a property "st_nm" containing the state name.
  const mergedGeoJSON = useCallback(() => {
    if (!boundaries || !phonepeData) return null;
    const newFeatures = boundaries.features.map((feature) => {
      const stateName = feature.properties.st_nm?.toLowerCase();
      const transactions = (stateName && phonepeData[stateName]?.total) || 0;
      feature.properties.transaction = transactions;
      return feature;
    });
    return { ...boundaries, features: newFeatures };
  }, [boundaries, phonepeData]);

  // Handle hover events: show tooltip with state name and transaction count
  const onHover = (event) => {
    const { features, point } = event;
    if (features && features.length > 0) {
      const feature = features[0];
      setHoverInfo({
        x: point.x,
        y: point.y,
        state: feature.properties.st_nm,
        transactions: feature.properties.transaction,
      });
    } else {
      setHoverInfo(null);
    }
  };

  // Define the fill-extrusion layer style to create the 3D effect.
  // The height is interpolated based on the transaction value.
  const layerStyle = {
    id: "3d-layer",
    type: "fill-extrusion",
    source: "states",
    interactive: true,
    paint: {
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        ["get", "transaction"],
        0, "#00ff00",
        10000000, "#ff0000"
      ],
      "fill-extrusion-height": [
        "interpolate",
        ["linear"],
        ["get", "transaction"],
        0, 0,
        10000000, 50000 // Adjust scale as necessary
      ],
      "fill-extrusion-opacity": 0.8,
    },
  };

  const mergedData = mergedGeoJSON();

  return (
    <div style={{ position: "relative" }}>
      <Map
        // Initial view centered on India with appropriate zoom and a high pitch for 3D effect.
        initialViewState={{
          longitude: 78.9629,
          latitude: 20.5937,
          zoom: 5.5,
          pitch: 60,
          bearing: 0,
        }}
        // Restrict panning/zooming to the bounds of India
        maxBounds={[[68.7, 6.5], [97.25, 35.5]]}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={["3d-layer"]}
        onMouseMove={onHover}
      >
        {mergedData && (
          <Source id="states" type="geojson" data={mergedData}>
            <Layer {...layerStyle} />
          </Source>
        )}
      </Map>

      {/* Tooltip: shows state and transaction data on hover */}
      {hoverInfo && (
        <div
          style={{
            position: "absolute",
            left: hoverInfo.x,
            top: hoverInfo.y,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "3px",
            pointerEvents: "none",
            fontSize: "12px",
          }}
        >
          <div>
            <strong>{hoverInfo.state}</strong>
          </div>
          <div>
            Transactions: {hoverInfo.transactions.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map3D;
