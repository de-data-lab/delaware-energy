let hoveredFeatureId = null;
export function handleMouseHover(e, map, source, tooltip) {
  map.getCanvas().style.cursor = "pointer";
  if (e.features.length > 0) {
    if (hoveredFeatureId != null) {
      map.setFeatureState(
        { source: source, id: hoveredFeatureId },
        { hover: false }
      );
    }
    hoveredFeatureId = e.features[0].id;

    map.setFeatureState(
      { source: source, id: hoveredFeatureId },
      { hover: true }
    );

    const properties = e.features[0].properties;
    tooltip.setLngLat(e.lngLat).setHTML(`
    <div>
    <h3>District:${properties.district}</h3>
    <p>Population:${properties["Estimated Population"]}</p>
    </div>
    `)
    tooltip.addTo(map)
  }
}

export function handleMouseLeave(e, map, source, tooltip) {
    map.getCanvas().style.cursor =""
  if (hoveredFeatureId != null) {
    map.setFeatureState(
      { source: source, id: hoveredFeatureId },
      { hover: false }
    );
    hoveredFeatureId = null;
  }

  tooltip.remove()
}
