import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { indiaGeoData } from "../data/indian-states";

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
      <p>Transactions: {data.count?.toLocaleString()}</p>
      <p>Value: ₹{data.amount?.toLocaleString()}</p>
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
      }}
    >
      <h2>Transactions</h2>
      <p>Total: {totalStats.totalCount?.toLocaleString()}</p>
      <p>Value: ₹{totalStats.totalAmount?.toLocaleString()}</p>
    </div>
  );
};

// Main Map Component
const IndiaMap = () => {
  const [hoverData, setHoverData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  // Fetch transaction data
  useEffect(() => {
    // Simulated data fetch - replace with actual API call
    const mockData = {
      totalCount: 24026205526,
      totalAmount: 3182052000000,
      stateData: {}, // Map of state-wise data
    };
    setTransactionData(mockData);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#1a0b2e",
        position: "relative",
      }}
    >
      <Canvas
        camera={{ position: [0, 5, 5], fov: 60 }}
        style={{ background: "#1a0b2e" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <group rotation={[-Math.PI / 2, 0, 0]}>
          {indiaGeoData.features.map((feature, i) => {
            // Calculate height based on transaction volume
            const stateData =
              transactionData?.stateData?.[feature.properties.name];
            const height = stateData ? Math.log(stateData.count) / 20 : 0.5;
            const color = new THREE.Color().setHSL(
              0.6 - height * 0.2,
              0.8,
              0.5
            );

            return (
              <mesh
                key={i}
                position={[0, 0, height / 2]}
                onPointerOver={() => {
                  setHoverData({
                    name: feature.properties.name,
                    count: stateData?.count || 0,
                    amount: stateData?.amount || 0,
                  });
                }}
                onPointerOut={() => setHoverData(null)}
              >
                <extrudeGeometry
                  args={[
                    new THREE.Shape(
                      feature.properties.coordinates.map(
                        ([x, y]) => new THREE.Vector2(x / 100, y / 100)
                      )
                    ),
                    { depth: height, bevelEnabled: false },
                  ]}
                />
                <meshStandardMaterial color={color} />
              </mesh>
            );
          })}
        </group>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>

      <HoverInfo data={hoverData} />
      {transactionData && <Stats totalStats={transactionData} />}
    </div>
  );
};

export default IndiaMap;
