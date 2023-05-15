import { useRef, useEffect, useContext } from "react";
import ReactDOM from "react-dom/client";
import { useUpdateEffect } from "react-use";
// Mapbox import
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapboxgl-legend/dist/style.css";
// import icon from "/icons/home-icon.svg"
import "./Map.css";
import colorPalette from "../utils/colorPalette";
import HomeControl from "../utils/HomeControl.js";
import mapInfo from "../utils/mapInfo";

import { MapContext } from "../App";
import LegendControl from "mapboxgl-legend";

import { PointInfo } from "../components/PointInfo";
import { SumPopup } from "../components/SumPopup";
import { Tooltip } from "../components/Tooltip";
// import {onHover, offHover} from "../utils/onHover";

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
      className: "map-tooltip",
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
    let array = [];

    let numberFormatter = mapData.features.map(
      (tract) => tract.properties[variable]
    );

    // Color way for choropleth
    let stops = colorPalette(numberFormatter);

    const colorArray = [
      "interpolate",
      ["linear"],
      ["to-number", ["get", variable]],
    ];

    stops.forEach((arr) => {
      colorArray.push(arr[0]);
      colorArray.push(arr[1]);
    });

    // Legend Name
    let legendName = mapInfo[fundingSource].columns[variable];
    // Legend Units
    switch (variable) {
      case "aggregated_allocation_amount":
        legendName = `${mapInfo[fundingSource].columns[variable]} (in millions)`;
        break;
      case "avg_allocation_per_unit":
        legendName = `${mapInfo[fundingSource].columns[variable]} (in thousands)`;
        break;
      case "adj_popula":
        legendName = `${mapInfo[fundingSource].columns[variable]} (in thousands)`;
        break;

      default:
        break;
    }

    // Fill
    map.current.addLayer({
      id: "fill",
      type: "fill",
      source: "delaware",
      layout: {
        // Make the layer visible by default.
        visibility: "visible",
      },
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
        name: legendName,
        // temp fix for legend formatting
        labels: {
          0: "0",
          1000: "1,000",
          1500: "1,500",
          2000: "2,000",
          5000: "$5K",
          10000: "$10K",
          15000: "$15K",
          20000: "$20K",
          25000: "$25K",
          30000: "$30K",
          44000: "44K",
          45000: "45K",
          46000: "46K",
          47000: "47K",
          48000: "48K",
          49000: "49K",
          2000000: "$2M",
          4000000: "$4M",
          6000000: "$6M",
          8000000: "$8M",
        },
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
          1,
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

    // Hover on
    map.current.on("mousemove", "fill", (e) => onHover(e));

    // Hover off
    map.current.on("mouseleave", "fill", (e) => offHover());

    function onHover(e) {
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

    function offHover() {
      map.current.getCanvas().style.cursor = "";

      if (hoverId !== null) {
        map.current.setFeatureState(
          { source: "delaware", id: hoverId },
          { hover: false }
        );
      }

      hoverId = null;
      tooltipRef.current.remove();
    }

    // Home button functionality

    map.current.on("home", () => {
      map.current.easeTo({
        center: [lng, lat],
        zoom: zoom,
        bearing: 0,
        pitch: 0
      });
    });

    // function handles clearing selected districts
    const clearSelection = () => {
      map.current.removeFeatureState({ source: "delaware" });
      array = [];
      sumRef.current.remove();
    };

    // Click functionality for districts
    // Left click
    map.current.on("click", "fill", (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ["fill"],
      });
      clickId = e.features[0].id;

      // Gets index of clicked feature for removing it from array
      let index = array.map((feature) => feature.id).indexOf(clickId);

      // checks if feature already exists in array
      let exists = array.findIndex((feature) => feature.id == clickId);

      // Handles adding selected features to aggregated list

      //  if feature doesn't exist yet push to array
      if (exists < 0) {
        array.push(e.features[0]);
        map.current.setFeatureState(
          { source: "delaware", id: clickId },
          { click: true }
        );
      }

      // Handles removing selected features from list
      if (index > -1) {
        array.splice(index, 1);
        map.current.setFeatureState(
          { source: "delaware", id: clickId },
          { click: false }
        );
      }

      // create popup node
      const sumPopup = document.createElement("div");
      ReactDOM.createRoot(sumPopup).render(
        <SumPopup
          variable={variable}
          fundingSource={fundingSource}
          array={array}
          clearSelection={clearSelection}
        />
      );
      // add popup to map
      sumRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(sumPopup)
        .addTo(map.current);

      // if sum list is empty then remove popup
      if (array <= 0) {
        sumRef.current.remove();
      }

      return array;
    });

    function offHover() {
      map.current.getCanvas().style.cursor = "";

      if (hoverId !== null) {
        map.current.setFeatureState(
          { source: "delaware", id: hoverId },
          { hover: false }
        );
      }

      hoverId = null;
      tooltipRef.current.remove();
    }

    // right click
    // map.current.on("contextmenu", "fill", (e) => {
    //   clickId = e.features[0].id;
    //   // Look for index of right-clicked feature
    //   let index = array.map((feature) => feature.id).indexOf(clickId);
    //   // only splice array when item is found
    //   if (index > -1) {
    //     // 2nd parameter means remove one item only
    //     array.splice(index, 1);

    //     // create popup node
    //     const sumPopup = document.createElement("div");
    //     ReactDOM.createRoot(sumPopup).render(
    //       <SumPopup
    //         variable={variable}
    //         fundingSource={fundingSource}
    //         array={array}
    //         clearSelection={clearSelection}
    //       />
    //     );
    //     // add popup to map
    //     sumRef.current
    //       .setLngLat(e.lngLat)
    //       .setDOMContent(sumPopup)
    //       .addTo(map.current);
    //   }

    //   if (array <= 0) {
    //     sumRef.current.remove();
    //   }

    //   map.current.setFeatureState(
    //     { source: "delaware", id: clickId },
    //     { click: false }
    //   );
    // });
  };

  const showProperties = () => {
    // Change the cursor to a pointer when the mouse is over the points layer.
    map.current.on("mouseenter", "properties", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.current.on("mouseleave", "properties", () => {
      map.current.getCanvas().style.cursor = "";
    });

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
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "clicked"], false],
          8,
          5,
        ],
      },
    });
    // map.current.addLayer({
    //   id: "properties",
    //   type: "symbol",
    //   source: "points",
    //   layout: {
    //     "icon-image": "home",
    //     "icon-size": .95,
    //   },
    //   paint: {
    //     "icon-color": "#000000",
    //   },
    // });

    // Remove fill if exists and darken outline layer when properties on
    const visibility = map.current.getLayoutProperty("fill", "visibility");

    if (visibility === "visible") {
      map.current.setLayoutProperty("fill", "visibility", "none");
      map.current.setPaintProperty("outline", "line-opacity", 1);
    } else {
      map.current.setLayoutProperty("fill", "visibility", "visible");
      // map.current.setPaintProperty("outline", "line-opacity", .2);
    }

    // Pop-up functionality for point info
    let clickedPointId = null;

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

      const legend = new LegendControl({
        toggler: true,
        layers: {
          fill: true,
        },
      });

      map.current.addControl(legend, "bottom-right");

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
    // Remove any existing layers
    if (map.current.getLayer("outline")) {
      map.current.removeLayer("outline");
    }
    if (map.current.getLayer("fill")) {
      map.current.removeLayer("fill");
    }
    if (map.current.getLayer("properties")) {
      map.current.removeLayer("properties");
    }

    // remove sumPopup when changing variables
    sumRef.current.remove();

    // remove any selections made to either layer
    map.current.removeFeatureState({ source: "delaware" });
    map.current.removeFeatureState({ source: "points" });

    // adds default/initial map layers
    addMapLayers();

    // if properties is toggled then run function to add property layer
    if (building === true) {
      showProperties();
    }
  };

  useUpdateEffect(update, [variable, fundingSource, building]);

  return <div ref={mapDiv} id="mapDiv"></div>;
};
