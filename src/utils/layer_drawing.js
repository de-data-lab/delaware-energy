import colorPalette from "./colorPalette";

export const addNewLayer = (map, sourceName, data, variable) => {
  let aggregatedData = [];
  aggregatedData = data.features.map((district) =>
    district.properties[variable] === null ? 0 : district.properties[variable]
  );
  let stops = colorPalette(aggregatedData)

  const colorArray =[
    "interpolate",
    ["linear"],
    ["to-number", ["get", variable]]
  ]
  
  stops.forEach((arr) =>{
    colorArray.push(arr[0])
    colorArray.push(arr[1])
  })
  
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
        1,
        0.75,
      ],
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
