import { useState, useEffect, useRef, useContext } from "react";
import { useUpdateEffect } from "@reactuses/core";
import SumPopup from "./SumPopup";
import ReactDOM from "react-dom/client";

import "./Map.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import LegendControl from "mapboxgl-legend";
import "mapboxgl-legend/dist/style.css";
import { MapContext } from "../App";
import { addNewLayer } from "../utils/layer_drawing";
import generateTooltipContent from "../utils/generateTooltipContent";
import { addNewPointLayer } from "../utils/point_drawing";
import Tooltip from "./Tooltip";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

function Map() {
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

  const mapContainer = useRef(null);
  const map = useRef(null);
  const tooltipRef = useRef(
    new mapboxgl.Popup({
      className: "map-tooltip",
      closeButton: false,
      closeOnClick: false,
    })
  );
  const tooltipDiv = document.createElement("div");
  const tooltip = ReactDOM.createRoot(tooltipDiv);

  const sumRef = useRef(
    new mapboxgl.Popup({
      className: "sumPopup",
      closeButton: false,
      closeOnClick: false,
      anchor: "none",
    })
  );

  function addLayersAndInteractions() {
    addNewLayer(map.current, source.name, source.data, variable);
    if (pointSource) {
      addNewPointLayer(map.current, pointSource.name, pointSource.data);
    }

    let hoveredFeatureId = null;
    let hoveredPointId = null;
    let clickFillId = null;
    let featureArray = [];

    // map.current.on("mousemove", "fill", (e) =>
    //   handleMouseHover(e, map.current, source.name, tooltip)
    // );

    map.current.doubleClickZoom.disable();
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

        const feature = e.features[0];
        tooltip.render(
          <Tooltip feature={feature} variable={variable} boundary={boundary} />
        );
        tooltipRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(tooltipDiv)
          .addTo(map.current);
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

      tooltipRef.current.remove();
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
        if (hoveredFeatureId != null) {
          map.current.setFeatureState(
            { source: source.name, id: hoveredFeatureId },
            { hover: false }
          );
        }

        map.current.setFeatureState(
          { source: source.name, id: hoveredPointId },
          { hover: true }
        );

        const feature = e.features[0];
        tooltip.render(
          <Tooltip feature={feature} variable={variable} boundary={boundary} point={true}/>
        );
        tooltipRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(tooltipDiv)
          .addTo(map.current);

        //   const properties = e.features[0].properties;
        //   const tooltipContent = generateTooltipContent(properties);
        //   tooltipRef.current.setLngLat(e.lngLat).setHTML(tooltipContent);
        //   tooltipRef.current.addTo(map.current);
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

      tooltipRef.current.remove();
    }

    const clearSelection = () => {
      map.current.removeFeatureState({ source: source.name });
      featureArray = [];
      sumRef.current.remove();
    };

    map.current.on("click", "fill", (e) => onFillClick(e));

    function onFillClick(e) {
      clickFillId = e.features[0].id;
      // Gets index of clicked feature for removing it from array
      let index = featureArray
        .map((feature) => feature.id)
        .indexOf(clickFillId);
      // Checks if feature already exists in array
      let exists = featureArray.findIndex(
        (feature) => feature.id === clickFillId
      );

      // Handles adding selected features to aggregated list
      //  if feature doesn't exist yet push to array
      if (exists < 0) {
        featureArray.push(e.features[0]);
        map.current.setFeatureState(
          { source: source.name, id: clickFillId },
          { click: true }
        );
      }

      if (index > -1) {
        featureArray.splice(index, 1);
        map.current.setFeatureState(
          { source: source.name, id: clickFillId },
          { click: false }
        );
      }

      //create popup node
      const sumPopup = document.createElement("div");
      ReactDOM.createRoot(sumPopup).render(
        <SumPopup
          variable={variable}
          year={year}
          featureArray={featureArray}
          clearSelection={clearSelection}
          source={source}
        />
      );

      //add popup to map
      sumRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(sumPopup)
        .addTo(map.current);

      // if sum list is empty then remove popup
      if (featureArray <= 0) {
        sumRef.current.remove();
      }
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
        layers: ["fill"],
      });
      map.current.addControl(legend, "bottom-right");
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

    sumRef.current.remove();
    addLayersAndInteractions();
  }

  useUpdateEffect(update, [source, pointSource, variable, year]);
  return (

      <div ref={mapContainer} className="map-container" />
  
  );
}

export default Map;
