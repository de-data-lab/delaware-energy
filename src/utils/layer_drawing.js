export const addNewLayer = (map, sourceName, data) => {
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
      "fill-color": "blue",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.5,
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
