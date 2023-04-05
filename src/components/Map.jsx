import { useRef, useEffect, useContext } from "react";
import ReactDOM from "react-dom/client";
import { useUpdateEffect } from "react-use";

import "mapbox-gl/dist/mapbox-gl.css";
import "mapboxgl-legend/dist/style.css";
import "./Map.css";

import colorPalette from "../utils/colorPalette";
import HomeControl from "../utils/HomeControl.js";
import mapInfo from "../utils/mapInfo";

import { MapContext } from "../App";
import LegendControl from "mapboxgl-legend";

import { PointInfo } from "./PointInfo";
import { SumPopup } from "./SumPopup";
import { Tooltip } from "./Tooltip";

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;

export const Map = ({ lng, lat, zoom }) => {
  const mapDiv = useRef(null);
  const map = useRef(null);

  const { pointData, mapData, variable, fundingSource, building } =
    useContext(MapContext);

  // Creates popup for point info
  const popUpRef = useRef(
    new mapboxgl.Popup({
      className: "info-card",
      closeButton: false,
      closeOnClick: true,
      anchor: "none",
    })
  );

  // Creates popup for sum popup
  const sumRef = useRef(
    new mapboxgl.Popup({
      className: "info-card",
      closeButton: false,
      closeOnClick: false,
      anchor: "none",
    })
  );

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
  

  // Adds map layers
  const addMapLayers = () => {
    // ids for feature-states
    let hoverId = null;
    let clickId = null;
    let clickedPointId = null;
    const array = [];

    // let sumArray = [];

    let numberFormatter = mapData.features.map((tract) => tract.properties[variable])

    // Color way for choropleth
    let stops = colorPalette(
      numberFormatter
    );

    const colorArray = [
      "interpolate",
      ["linear"],
      ["to-number", ["get", variable]],
    ];

    stops.forEach((arr) => {
      colorArray.push(arr[0]);
      colorArray.push(arr[1]);
    });

    // Fill
    map.current.addLayer({
      id: "fill",
      type: "fill",
      source: "delaware",
      paint: {
        "fill-color": colorArray,
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0,
          ["boolean", ["feature-state", "click"], false],
          1,
          0.7,
        ],
      },
      metadata: {
        name: mapInfo[fundingSource].columns[variable]
      },
    });

    // Outline
    map.current.addLayer({
      id: "outline",
      type: "line",
      source: "delaware",
      paint: {
        "line-color": "#2c3d4f",
        // "line-color": "#ffffff",
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          4,
          ["boolean", ["feature-state", "click"], false],
          4,
          1
        ],
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          ["boolean", ["feature-state", "click"], false],
          1,
          0.2,
        ],
      },
    });

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
    }
    // Hover on
    map.current.on("mousemove", "fill", e => onHover(e));

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

    

    // if show buildings button is toggled, add point layer, and popups
    if (building === true) {
      map.current.addLayer({
        id: "properties",
        type: "circle",
        source: "points",
        paint: {
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "clicked"], false],
            "#1878dd",
            "#000000",
          ],
          "circle-radius": 5,
        },
      });

          // Remove fill and outline layer when properties on
        map.current.removeLayer("fill");
        map.current.removeLayer("outline");
        // Remove sumPopup when properties on
        sumRef.current.remove();


      // Pop-up functionality for point info

      // Change the cursor to a pointer when the mouse is over the points layer.
      map.current.on("mouseenter", "properties", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.current.on("mouseleave", "properties", () => {
        map.current.getCanvas().style.cursor = "";
      });

      // Displays pop-up on click of point
      map.current.on("click", "properties", (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["properties"],
        });

        if (features.length > 0) {
          const feature = features[0];

          if (clickedPointId !== null) {
            map.current.removeFeatureState({
              source: "points",
              id: clickedPointId,
            });
          }

          // create popup node
          const popupNode = document.createElement("div");
          ReactDOM.createRoot(popupNode).render(
            <PointInfo
              feature={feature}
              variable={variable}
              fundingSource={fundingSource}
            />
          );
          // add popup to map
          popUpRef.current
            .setLngLat(e.lngLat)
            .setDOMContent(popupNode)
            .addTo(map.current);
        }

        clickedPointId = e.features[0].id;

        map.current.setFeatureState(
          { source: "points", id: clickedPointId },
          { clicked: true }
        );
      });
    }

    if (building === false ) {
      // Check if point layer already exists
    if (map.current.getLayer("properties")) {
      map.current.removeLayer("properties");
    }
      popUpRef.current.remove();
    }

    // Home button functionality

    map.current.on("home", () => {
      map.current.easeTo({
        center: [lng, lat],
        zoom: zoom,
      });
    });

   
// Click functionality for districts
    // Left click
    map.current.on("click", "fill", (e) => {
      
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ["fill"],
      });
      clickId = e.features[0].id;

      // Handles adding selected features to aggregated list
      // checks if feature already exists in array
      let exists = array.findIndex((feature) => feature.id == clickId);
      //  if feature doesn't exist yet push to array
      if (exists < 0) {
        array.push(e.features[0]);
      }

      console.log(array)

      map.current.setFeatureState(
        { source: "delaware", id: clickId },
        { click: true }
      );


      // create popup node
      const sumPopup = document.createElement("div");
      ReactDOM.createRoot(sumPopup).render(
        <SumPopup
          variable={variable}
          fundingSource={fundingSource}
          array={array}
        />
      );
      // add popup to map
      sumRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(sumPopup)
        .addTo(map.current);
      return array

    });

    // right click
    map.current.on("contextmenu", "fill", (e) => {
      clickId = e.features[0].id;
      // Look for index of right-clicked feature
      let index = array.map((feature) => feature.id).indexOf(clickId);
      // only splice array when item is found
      if (index > -1) {
        // 2nd parameter means remove one item only
        array.splice(index, 1);
        
        // create popup node
      const sumPopup = document.createElement("div");
      ReactDOM.createRoot(sumPopup).render(
        <SumPopup
          variable={variable}
          fundingSource={fundingSource}
          array={array}
        />
      );
      // add popup to map
      sumRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(sumPopup)
        .addTo(map.current);

      }

      if (array <= 0) {
        sumRef.current.remove();
      }

      map.current.setFeatureState(
        { source: "delaware", id: clickId },
        { click: false }
      );
    });
  };
    

  // Initial loading of data, setting global settings, adding nav controls
  useEffect(() => {
    if (map.current) return;

    // Create initial map background
    map.current = new mapboxgl.Map({
      container: mapDiv.current,
      style: "mapbox://styles/reedmiller/clcp60zc3002b14mi3ss3y8q1",
      center: [lng, lat],
      zoom: zoom,
      minZoom: 7,
      projection: "globe",
    });

    // Navigation controls and legend
    map.current.on("load", () => {
      map.current.addControl(
        new mapboxgl.FullscreenControl({
          container: document.querySelector("#map-container"),
        }),
        "bottom-left"
      );
      map.current.addControl(new mapboxgl.GeolocateControl(), "bottom-left");
      map.current.addControl(new HomeControl(), "bottom-left");
      map.current.addControl(
        new LegendControl({
          collapsed: false,
          layers: {
            fill: true,
          },
        }),
        "bottom-right"
      );

      map.current.addSource("delaware", {
        type: "geojson",
        data: mapData,
        generateId: true,
      });

      map.current.addSource("points", {
        type: "geojson",
        data: pointData,
        generateId: true,
      });

      addMapLayers();
    });
  }, []);

  // Deletes layers and re-adds them whenever user changes funding source variable or building locations
  const update = () => {
    if (map.current.getLayer("outline")) {
    map.current.removeLayer("outline");
    }
    if (map.current.getLayer("fill")) {
      map.current.removeLayer("fill");
    }

    addMapLayers();
  };

  useUpdateEffect(update, [variable, fundingSource, building]);

  return <div ref={mapDiv} id="mapDiv"></div>;
};
