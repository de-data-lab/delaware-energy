import { useState, useEffect, useRef } from "react";
import { useUpdateEffect } from "@reactuses/core";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { addNewLayer } from "../utils/layer_drawing";
import { handleMouseHover, handleMouseLeave } from "../utils/map_interactions";

// import senateData2010 from "../data/senate_2010.json";
// import senateData2022 from "../data/senate_2022.json";
// const senateData2010Obj = { name: "senateData2010", data: senateData2010 };
// const senateData2022Obj = { name: "senateData2022", data: senateData2022 };

import senateData2014 from "../data/DSHA_Population_SLDU_all_years/Population_SLDU_2014.json"
const senateData2014Obj = {name:"senateData2014", data: senateData2014}
import senateData2015 from "../data/DSHA_Population_SLDU_all_years/Population_SLDU_2015.json"
const senateData2015Obj = {name:"senateData2015", data: senateData2015}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-75.465);
  const [lat, setLat] = useState(39.063);
  const [zoom, setZoom] = useState(7.5);
  const [source, setSource] = useState(senateData2014Obj);

  function handle2014Click() {
    setSource(senateData2014Obj);
    console.log("sourceChanged");
  }

  function handle2015Click() {
    setSource(senateData2015Obj);
    console.log("sourceChanged");
  }
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
      <button onClick={handle2014Click}>Senate 2014</button>
      <button onClick={handle2015Click}>Senate 2015</button>
    </div>
  );
}

export default Map;
