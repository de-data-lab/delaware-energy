import { useState, useEffect, useRef, useContext } from "react";
import { useUpdateEffect } from "@reactuses/core";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapContext } from "../App";

import { addNewLayer } from "../utils/layer_drawing";
import { handleMouseHover, handleMouseLeave } from "../utils/map_interactions";

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
  } = useContext(MapContext);


  const tooltip = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

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
      addNewLayer(map.current, source.name, source.data);

      map.current.on("mousemove", "fill", (e) =>
        handleMouseHover(e, map.current, source.name, tooltip)
      );
      map.current.on("mouseleave", "fill", (e) =>
        handleMouseLeave(e, map.current, source.name, tooltip)
      );
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

    addNewLayer(map.current, source.name, source.data);
    
    map.current.on("mousemove", "fill", (e) =>
      handleMouseHover(e, map.current, source.name, tooltip)
    );
    map.current.on("mouseleave", "fill", (e) =>
      handleMouseLeave(e, map.current, source.name, tooltip)
    );
  }

  useUpdateEffect(update, [source]);
  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;
