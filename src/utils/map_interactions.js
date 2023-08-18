export function handleMouseHover(e, map, source, tooltip, hoveredFeatureId) {
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
    const tooltipContent = generateTooltipContent(properties);
    function generateTooltipContent(properties) {
      let tooltipHTML = "<div>";

      for (const key in properties) {
        if (key !== "index" && properties.hasOwnProperty(key)) {
          tooltipHTML += `<h3>${key}: ${properties[key]}</h3>`;
        }
      }
      tooltipHTML += "</div>";
      return tooltipHTML
    }

    tooltip.setLngLat(e.lngLat).setHTML(tooltipContent);
    tooltip.addTo(map);
  }
}

export function handleMouseLeave(e, map, source, tooltip, hoveredFeatureId) {
  map.getCanvas().style.cursor = "";
  if (hoveredFeatureId != null) {
    map.setFeatureState(
      { source: source, id: hoveredFeatureId },
      { hover: false }
    );
    hoveredFeatureId = null;
  }

  tooltip.remove();
}
