import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { fetchTransactionData } from "../services/phonepeService";
import { loadGeoJSON } from "../data/india-geojson";
import { LoadingSpinner } from "./LoadingSpinner";
import { normalizeGeoJSONCoordinates } from '../utils/geo-utils';

// HoverInfo Component with transaction data
const HoverInfo = ({ data }) => {
  if (!data) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        padding: "20px",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3>{data.name}</h3>
      <p>Transactions: {data.metric?.[0]?.count?.toLocaleString() || 0}</p>
      <p>
        Value: ₹{(data.metric?.[0]?.amount / 1e7)?.toLocaleString() || 0} Cr
      </p>
    </div>
  );
};

// Stats Component to show overall statistics
const Stats = ({ totalStats }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        color: "#fff",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "rgba(0,0,0,0.8)",
        borderRadius: "8px",
      }}
    >
      <h2>Total Transactions</h2>
      <p>Count: {totalStats.totalCount?.toLocaleString()}</p>
      <p>Value: ₹{(totalStats.totalAmount / 1e7)?.toLocaleString()} Cr</p>
    </div>
  );
};

const StateShape = ({ feature, transactionData, onHover, onHoverEnd }) => {
  const stateName = feature.properties.NAME_1.toLowerCase().replace(
    /\s+/g,
    "-"
  );
  const stateData = transactionData?.find((data) => data.name === stateName);

  if (!stateData) return null;

  const height = Math.log(stateData.metric[0].count) / 20 || 0.5;
  const color = new THREE.Color().setHSL(0.6 - height * 0.2, 0.8, 0.5);

  const coordinates = feature.geometry.type === "MultiPolygon"
    ? feature.geometry.coordinates[0][0]
    : feature.geometry.coordinates[0];

  const normalizedCoords = normalizeGeoJSONCoordinates(coordinates);

  const shape = new THREE.Shape();
  normalizedCoords.forEach(([x, y], i) => {
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  });

  return (
    <mesh
      position={[0, 0, height / 2]}
      onPointerOver={() => onHover(stateData)}
      onPointerOut={onHoverEnd}
    >
      <extrudeGeometry args={[shape, { depth: height, bevelEnabled: false }]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
    </mesh>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main Map Component
const IndiaMap = () => {
  const [hoverData, setHoverData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state
        
        const [transData, geoJSON] = await Promise.all([
          fetchTransactionData(),
          loadGeoJSON(),
        ]);

        if (!geoJSON || !geoJSON.features) {
          throw new Error('Invalid GeoJSON data');
        }

        setTransactionData(transData.data.hoverDataList);
        setGeoData(geoJSON);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message || 'Failed to load map data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div style={{ color: "white" }}>Error loading map data</div>;
  if (!geoData)
    return <div style={{ color: "white" }}>No map data available</div>;

  return (
    <ErrorBoundary>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#1a0b2e",
          position: "relative",
        }}
      >
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 75, 100]} />
          <ambientLight intensity={0.6} />
          <pointLight position={[100, 100, 100]} intensity={0.8} />
          <pointLight position={[-100, -100, -100]} intensity={0.5} />

          <Suspense fallback={null}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
              {geoData.features.map((feature, i) => (
                <StateShape
                  key={i}
                  feature={feature}
                  transactionData={transactionData}
                  onHover={setHoverData}
                  onHoverEnd={() => setHoverData(null)}
                />
              ))}
            </group>
          </Suspense>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={50}
            maxDistance={200}
          />
        </Canvas>

        <HoverInfo data={hoverData} />
        {transactionData && (
          <Stats
            totalStats={{
              totalCount: transactionData.reduce(
                (acc, state) => acc + state.metric[0].count,
                0
              ),
              totalAmount: transactionData.reduce(
                (acc, state) => acc + state.metric[0].amount,
                0
              ),
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default IndiaMap;
