import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const INDIA_GEOJSON_URL = '/india.geojson';

const IndiaMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [hoverData, setHoverData] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/PhonePe/pulse/master/data/map/transaction/hover/country/india/2021/1.json')
      .then(response => response.json())
      .then(data => setHoverData(data.data.hoverDataList));

    d3.json(INDIA_GEOJSON_URL).then(data => setGeoData(data));
  }, []);

  const projection = d3.geoMercator()
    .center([80, 22])
    .scale(1000)
    .translate([window.innerWidth / 2, window.innerHeight / 2]);

  const pathGenerator = d3.geoPath().projection(projection);

  const getColor = (stateData) => {
    if (!stateData) return 'gray';
    const amount = stateData.metric[0].amount;
    return d3.interpolatePlasma(amount / 1e12); // Dynamic color based on transaction amount
  };

  const create3DBar = (centroid, amount, index, color) => {
    const barHeight = Math.max(2, Math.log(amount) * 2); // Dynamic height based on amount
    const perspective = 5; // 3D effect depth

    return (
      <g key={index} transform={`translate(${centroid[0]}, ${centroid[1]})`}>
        {/* Back face (shadow) */}
        <rect
          x={-15 + perspective}
          y={-barHeight + perspective}
          width={30}
          height={barHeight}
          fill={d3.color(color).darker(0.5)}
          rx="2"
        />
        
        {/* Side face */}
        <rect
          x={-15 + perspective}
          y={-barHeight}
          width={perspective}
          height={barHeight}
          fill={d3.color(color).darker(0.3)}
          rx="1"
        />
        
        {/* Front face */}
        <rect
          x={-15}
          y={-barHeight}
          width={30}
          height={barHeight}
          fill={color}
          rx="2"
          style={{ filter: "url(#bar-glow)" }}
        />
        
        {/* Top face */}
        <rect
          x={-15}
          y={-barHeight - perspective / 2}
          width={30 + perspective}
          height={perspective}
          fill={d3.color(color).brighter(0.2)}
          rx="1"
        />
      </g>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width={window.innerWidth} height={window.innerHeight}>
        <defs>
          <filter id="bar-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {geoData && geoData.features.map((feature, index) => {
          const stateName = feature.properties?.NAME_1?.toLowerCase();
          const stateData = hoverData?.find(data => data.name?.toLowerCase() === stateName);
          const centroid = pathGenerator.centroid(feature);

          return (
            <g key={index}
              onMouseEnter={(e) => setTooltip({ 
                name: stateName, 
                amount: stateData?.metric[0].amount, 
                x: e.clientX, 
                y: e.clientY 
              })}
              onMouseLeave={() => setTooltip(null)}>
              
              <path
                d={pathGenerator(feature)}
                fill={getColor(stateData)}
                stroke="#000"
                strokeWidth={0.5}
              />
              
              {stateData && (
                <g transform={`translate(0, ${centroid[1]})`}>
                  {create3DBar(
                    centroid,
                    stateData.metric[0].amount,
                    index,
                    getColor(stateData)
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x,
          top: tooltip.y,
          background: 'white',
          padding: '5px',
          border: '1px solid black',
          pointerEvents: 'none'
        }}>
          <strong>{tooltip.name}</strong><br />
          Transactions: {tooltip.amount}
        </div>
      )}
    </div>
  );
};

export default IndiaMap;
