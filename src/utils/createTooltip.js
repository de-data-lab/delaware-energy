import { Tooltip } from "../components/Tooltip";
import ReactDOM from "react-dom/client";
import { useRef, useEffect, useContext } from "react";
const { pointData, mapData, variable, fundingSource, building } =
    useContext(MapContext);

export function createTooltip(map) {
  // Creates popup for Tooltip
  const tooltipRef = useRef(
    new mapboxgl.Popup({
      className: "tooltip",
      closeButton: false,
      closeOnClick: false,
      anchor: "top-left",
      offset: [5, 20],
    })
  );
  const tooltipDiv = document.createElement("div");
  const tooltip = ReactDOM.createRoot(tooltipDiv);

  // Hover functionality for districts
  const onHover = (e) => {
    map.current.getCanvas().style.cursor = "pointer";

    // new polygon hovered, previous one turned to false
    if (hoverId !== null) {
      map.current.setFeatureState(
        { source: "delaware", id: hoverId },
        { hover: false }
      );
    }

    // new polygon hovered
    hoverId = e.features[0].id;

    // new polygon hovered turned to true
    map.current.setFeatureState(
      { source: "delaware", id: hoverId },
      { hover: true }
    );

    // Making tooltip appear on map

    const features = map.current.queryRenderedFeatures(e.point, {
      layers: ["fill"],
    });

    if (features.length > 0) {
      const feature = features[0];

      // create tooltip for hovering on districts
      tooltip.render(
        <Tooltip
          feature={feature}
          variable={variable}
          fundingSource={fundingSource}
        />
      );

      // add popup to map
      tooltipRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(tooltipDiv)
        .addTo(map.current);
    }
  };

  // Hover on
  map.current.on("mousemove", "fill", (e) => onHover(e));

  // Hover off
  map.current.on("mouseleave", "fill", (e) => {
    map.current.getCanvas().style.cursor = "";

    if (hoverId !== null) {
      map.current.setFeatureState(
        { source: "delaware", id: hoverId },
        { hover: false }
      );
    }

    hoverId = null;
    tooltipRef.current.remove();
  });
}

export default createTooltip;
