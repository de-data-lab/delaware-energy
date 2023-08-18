export const addNewPointLayer = (map, sourceName, data) => {
  if (!data) {
    return;
  }

  map.addSource(sourceName, {
    type: "geojson",
    data: data,
    generateId: true,
  });

  map.addLayer({
    id: "points",
    type: "circle",
    source: sourceName,
    layout: {},
    paint: {
      "circle-color": "#ED9364",
      "circle-radius": 4,
    },
  });
};
