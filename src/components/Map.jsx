import { useState, useEffect, useRef, useContext } from "react";
import { useUpdateEffect } from "@reactuses/core";
import "./Map.css"
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import LegendControl from "mapboxgl-legend";
import "mapboxgl-legend/dist/style.css";
import { MapContext } from "../App";
import { addNewLayer } from "../utils/layer_drawing";
import { handleMouseHover, handleMouseLeave } from "../utils/map_interactions";
import { addNewPointLayer } from "../utils/point_drawing";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-75.465);
  const [lat, setLat] = useState(39.063);
  const [zoom, setZoom] = useState(7.5);

  const {
    variable,
    setVariable,
    year,
    setYear,
    boundary,
    setBoundary,
    source,
    setSource,
    pointSource,
    setPointSource,
  } = useContext(MapContext);

  const tooltip = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  function addLayersAndInteractions() {
    addNewLayer(map.current, source.name, source.data, variable);
    if (pointSource) {
      addNewPointLayer(map.current, pointSource.name, pointSource.data);
    }

    let hoveredFeatureId = null;
    let hoveredPointId = null;

    // map.current.on("mousemove", "fill", (e) =>
    //   handleMouseHover(e, map.current, source.name, tooltip)
    // );

    map.current.on("mousemove", "fill", (e) => onFillHover(e));

    function onFillHover(e) {
      map.current.getCanvas().style.cursor = "pointer";
      if (e.features.length > 0) {
        if (hoveredFeatureId != null) {
          map.current.setFeatureState(
            { source: source.name, id: hoveredFeatureId },
            { hover: false }
          );
        }
        hoveredFeatureId = e.features[0].id;

        map.current.setFeatureState(
          { source: source.name, id: hoveredFeatureId },
          { hover: true }
        );

        const properties = e.features[0].properties;
        tooltip.setLngLat(e.lngLat).setHTML(`
        <div>
        <h3>District: ${properties["District"]}</h3>
        <p>${variable}: ${properties[variable]}</p>
        </div>
        `);
        tooltip.addTo(map.current);
      }
    }

    // map.current.on("mouseleave", "fill", (e) =>
    //   handleMouseLeave(e, map.current, source.name, tooltip, hoveredFeatureId)
    // );

    map.current.on("mouseleave", "fill", (e) => offFillHover(e));

    function offFillHover(e) {
      map.current.getCanvas().style.cursor = "";
      if (hoveredFeatureId != null) {
        map.current.setFeatureState(
          { source: source.name, id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
      }

      tooltip.remove();
    }

    map.current.on("mousemove", "points", (e) => onPointHover(e));

    function onPointHover(e) {
      map.current.getCanvas().style.cursor = "pointer";
      if (e.features.length > 0) {
        if (hoveredPointId != null) {
          map.current.setFeatureState(
            { source: source.name, id: hoveredPointId },
            { hover: false }
          );
        }
        hoveredFeatureId = e.features[0].id;

        map.current.setFeatureState(
          { source: source.name, id: hoveredPointId },
          { hover: true }
        );

        const properties = e.features[0].properties;
        tooltip.setLngLat(e.lngLat).setHTML(`
        <div>
        <h3>Grantee: ${properties["Name of Grantee"]}</h3>
        <p>Population:${properties["Estimated Population"]}</p>
        </div>
        `);
        tooltip.addTo(map.current);
      }
    }

    map.current.on("mouseleave", "points", (e) => offPointHover(e));

    function offPointHover(e) {
      map.current.getCanvas().style.cursor = "";
      if (hoveredPointId != null) {
        map.current.setFeatureState(
          { source: source.name, id: hoveredPointId },
          { hover: false }
        );
        hoveredPointId = null;
      }

      tooltip.remove();
    }
  }

  useEffect(() => {
    if (map.current) return;
    //makes new map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/reedmiller/clcp60zc3002b14mi3ss3y8q1",
      center: [lng, lat],
      zoom: zoom,
      minZoom: 7,
    });

    map.current.on("load", () => {
      addLayersAndInteractions();
      const legend = new LegendControl({
        layers:["fill"]
    });
      map.current.addControl(legend, "top-right");
    });
  }, []);

  function update() {
    if (map.current.getLayer("line")) {
      map.current.removeLayer("line");
    }
    if (map.current.getLayer("fill")) {
      map.current.removeLayer("fill");
    }
    if (map.current.getSource(source.name)) {
      map.current.removeSource(source.name);
    }
    if (map.current.getLayer("points")) {
      map.current.removeLayer("points");
    }
    if (map.current.getSource(pointSource.name)) {
      map.current.removeSource(pointSource.name);
    }
    addLayersAndInteractions();
  }

  useUpdateEffect(update, [source, pointSource,variable]);
  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;
