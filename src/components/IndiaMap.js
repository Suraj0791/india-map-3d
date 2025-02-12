import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const INDIA_GEOJSON_URL = '/india.geojson';

const IndiaMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [hoverData, setHoverData] = useState(null);

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

  return (
    <svg width={window.innerWidth} height={window.innerHeight} viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}> 
      {geoData && geoData.features.map((feature, index) => {
        const stateName = feature.properties?.NAME_1?.toLowerCase(); // Updated property
        const stateData = hoverData?.find(data => data.name?.toLowerCase() === stateName);

        return (
          <path
            key={index}
            d={pathGenerator(feature)}
            fill={stateData ? 'lightblue' : 'gray'}
            stroke="#000"
            strokeWidth={0.5}
            onMouseEnter={() => {
              if (stateData) {
                d3.select(`#tooltip-${index}`).style('display', 'block');
              }
            }}
            onMouseLeave={() => {
              d3.select(`#tooltip-${index}`).style('display', 'none');
            }}
          />
        );
      })}

      {geoData && geoData.features.map((feature, index) => {
        const stateName = feature.properties?.NAME_1?.toLowerCase(); // Updated property
        const stateData = hoverData?.find(data => data.name?.toLowerCase() === stateName);

        return stateData ? (
          <text
            key={`tooltip-${index}`}
            id={`tooltip-${index}`}
            x={pathGenerator.centroid(feature)[0]}
            y={pathGenerator.centroid(feature)[1]}
            textAnchor="middle"
            fill="black"
            fontSize="10px"
            style={{ display: 'none', background: 'white' }}
          >
            {`${stateName.toUpperCase()}: ${stateData.metric[0].count} Txns, ₹${(stateData.metric[0].amount / 1e9).toFixed(2)}B`}
          </text>
        ) : null;
      })}
    </svg>
  );
};

export default IndiaMap;
