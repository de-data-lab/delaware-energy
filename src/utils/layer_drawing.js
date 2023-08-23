import colorPalette from "./colorPalette";

export const addNewLayer = (map, sourceName, data, variable) => {
  let aggregatedData = [];
  aggregatedData = data.features.map((district) =>
    district.properties[variable] === null ? 0 : district.properties[variable]
  );
  let stops = colorPalette(aggregatedData);

  const colorArray = [
    "interpolate",
    ["linear"],
    ["to-number", ["get", variable]],
  ];

  function determineLegendTitle() {
    if (variable === "Total Population") {
      return "Total Population";
    }
    if(variable === "Percentage of households using solar energy"){
      return "Percentage of households using solar energy (in %)"
    } 
    else {
      return "Test Legend Title";
    }
  }

  stops.forEach((arr) => {
    colorArray.push(arr[0]);
    colorArray.push(arr[1]);
  });

  map.addSource(sourceName, {
    type: "geojson",
    data: data,
    generateId: true,
  });

  map.addLayer({
    id: "fill",
    type: "fill",
    source: sourceName,
    layout: {},
    paint: {
      "fill-color": colorArray,
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0,
        ["boolean", ["feature-state", "click"], false],
        1,
        0.75,
      ],
    },
    metadata: {
      name: determineLegendTitle(),
    },
  });

  map.addLayer({
    id: "line",
    type: "line",
    source: sourceName,
    paint: {
      "line-color": "#2c3d4f",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        4,
        ["boolean", ["feature-state", "click"], false],
        4,
        1,
      ],
      "line-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        ["boolean", ["feature-state", "click"], false],
        1,
        0.5,
      ],
    },
  });
};
