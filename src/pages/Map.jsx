import { useRef, useEffect, useContext } from "react";
import ReactDOM from "react-dom/client";
import { useUpdateEffect } from "react-use";
// Mapbox import
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapboxgl-legend/dist/style.css";
import "./Map.css";
import colorPalette from "../utils/colorPalette";
import HomeControl from "../utils/HomeControl.js";
import mapInfo from "../utils/mapInfo";

import { MapContext } from "../App";
import LegendControl from "mapboxgl-legend";

import { PointInfo } from "../components/PointInfo";
import { SumPopup } from "../components/SumPopup";
import { Tooltip } from "../components/Tooltip";
import { HoverInfo } from "../components/HoverInfo";

import senateData2020 from "../data/aggregated_with_geo2020.json";
import senateData2010 from "../data/aggregated_with_geo2010.json";
import houseData2020 from "../data/reps_aggregated_with_geo2022.json";
import houseData2010 from "../data/reps_aggregated_with_geo2011.json";

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;

export const Map = ({ lng, lat, zoom }) => {
  const mapDiv = useRef(null);
  const map = useRef(null);
  const {
    pointData,
    mapData,
    variable,
    fundingSource,
    building,
    year,
    boundary,
  } = useContext(MapContext);

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
      className: "sumPopup",
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

  // Info message
  const infoMenuRef = useRef(
    new mapboxgl.Popup({
      className: "info-menu",
      closeButton: true,
      closeOnClick: false,
      anchor: "none",
    })
  );

  // changes data based on whichever year is selected
  if (map.current) {
    if (boundary === "senate") {
      if (year === "2022" || year === "Sum over All Time") {
        map.current.getSource("delaware").setData(senateData2020);
      } else {
        map.current.getSource("delaware").setData(senateData2010);
      }
    }
    if (boundary === "house") {
      if (year === "2022" || year === "Sum over All Time") {
        map.current.getSource("delaware").setData(houseData2020);
      } else {
        map.current.getSource("delaware").setData(houseData2010);
      }
    }
  }

  // Adds map layers
  const addMapLayers = () => {
    // ids for feature-states
    let clickId = null;
    let array = [];

    // map through data and return data for specific years only
    let filteredData = [];

    // filtering data
    if (boundary === "senate") {
      if (year === "2022" || year === "Sum over All Time") {
        filteredData = senateData2020.features.filter(
          (feature) => feature.properties["year"] === year
        );
      } else {
        filteredData = senateData2010.features.filter(
          (feature) => feature.properties["year"] === year
        );
      }
    }

    if (boundary === "house") {
      if (year === "2022" || year === "Sum over All Time") {
        filteredData = houseData2020.features.filter(
          (feature) => feature.properties["year"] === year
        );
      } else {
        filteredData = houseData2010.features.filter(
          (feature) => feature.properties["year"] === year
        );
      }
    }

    // map through filtered data and return variable values for colorArray stops
    let numberFormatter = filteredData.map((tract) =>
      tract.properties[variable] === null
        ? 0
        : parseInt(tract.properties[variable])
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
      case "ALLOCATION AMOUNT":
        legendName = `${mapInfo[fundingSource].columns[variable]} (in millions)`;
        break;
      case "Average Allocation per Tax Credit Unit":
        legendName = `${mapInfo[fundingSource].columns[variable]} (in thousands)`;
        break;
      case "Population":
        legendName = `${mapInfo[fundingSource].columns[variable]} (in thousands)`;
        break;

      default:
        break;
    }

    // FILL LAYER
    map.current.addLayer({
      id: "fill",
      type: "fill",
      source: "delaware",
      filter: ["==", "year", year],
      // filter: ["all", ["==", "year", year], ["==", "boundary", boundary]],
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
          0.75,
        ],
      },
      metadata: {
        name: legendName,
        // temp fix for legend formatting
        labels: {
          0: "0",
          // Avg allocation
          1000: "$1K",
          1500: "$1.5K",
          2000: "$2K",
          5000: "$5K",
          2000: "$2K",
          2500: "$2.5K",
          3000: "$3K",
          3500: "$3.5K",
          4000: "$4K",
          6000: "$6K",
          7000: "$7K",
          8000: "$8K",
          10000: "$10K",
          12000: "$12K",
          14000: "$14K",
          15000: "$15K",
          16000: "$16K",
          18000: "$18K",
          20000: "$20K",
          25000: "$25K",
          30000: "$30K",
          35000: "$35K",
          40000: "$40K",
          60000: "$60K",
          80000: "$80K",
          100000: "$100K",
          200000: "$200K",
          300000: "$300K",
          400000: "$400K",
          500000: "$500K",
          600000: "$600K",
          700000: "$700K",
          800000: "$800K",
          1000000: "$1M",
          1200000: "$1.2M",
          1400000: "$1.4M",
          1500000: "$1.5M",
          1600000: "$1.6M",
          1800000: "$1.8M",
          2000000: "$2M",
          3000000: "$3M",
          4000000: "$4M",
          5000000: "$5M",
          6000000: "$6M",
          7000000: "$7M",
          8000000: "$8M",
        },
      },
    });

    // OUTLINE LAYER
    map.current.addLayer({
      id: "outline",
      type: "line",
      source: "delaware",
      filter: ["==", "year", year],
      paint: {
        "line-color": "#2c3d4f",
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
          0.5,
        ],
      },
    });

    // Hover on
    map.current.on("mousemove", "fill", (e) => onHover(e));

    // Hover off
    map.current.on("mouseleave", "fill", (e) => offHover(e));

    let hoverId = null;

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
            boundary={boundary}
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

    const offHover = (e) => {
      map.current.getCanvas().style.cursor = "";

      if (hoverId !== null) {
        map.current.setFeatureState(
          { source: "delaware", id: hoverId },
          { hover: false }
        );
      }

      hoverId = null;
      tooltipRef.current.remove();
    };

    // Home button functionality
    map.current.on("home", () => {
      map.current.easeTo({
        center: [lng, lat],
        zoom: zoom,
        bearing: 0,
        pitch: 0,
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
          year={year}
          array={array}
          mapData={filteredData}
          clearSelection={clearSelection}
        />
      );
      // add popup to map
      sumRef.current
        .setLngLat(e.lngLat)
        .setDOMContent(sumPopup)
        .addTo(map.current);

      // remove info message
      infoMenuRef.current.remove();

      // if sum list is empty then remove popup
      if (array <= 0) {
        sumRef.current.remove();
      }

      return array;
    });

    // right click to deselect district
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

  // Adds point layer to map
  const showProperties = () => {
    // unclustered points
    map.current.addLayer({
      id: "properties",
      type: "circle",
      source: "points",
      filter: ["==", "Tax Allocation Year", year],
      paint: {
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "clicked"], false],
          "#1878dd",
          ["boolean", ["feature-state", "hovered"], false],
          "#1878dd",
          "#0a2552",
        ],
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "clicked"], false],
          8,
          6,
        ],
      },
    });

    // if year selected is ALL YEARS then remove filter from layer
    if (year === "Sum over All Time") {
      map.current.setFilter("properties", null);
    }

    // Remove fill layer if it exists and darken outline layer when properties on
    if (map.current.getLayer("fill")) {
      const visibility = map.current.getLayoutProperty("fill", "visibility");

      if (visibility === "visible") {
        map.current.setLayoutProperty("fill", "visibility", "none");
        map.current.setPaintProperty("outline", "line-opacity", 1);
      } else {
        map.current.setLayoutProperty("fill", "visibility", "visible");
      }
    }

    // Pop-up functionality for point info
    let clickedPointId = null;

    // Displays pop-up on click of point
    map.current.on("click", "properties", (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ["properties"],
      });

      const uniqueFeatures = features.filter((value, index, self) => {
        return self.findIndex((v) => v.id === value.id) === index;
      });

      const feature = uniqueFeatures[0];

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

      clickedPointId = e.features[0].id;

      map.current.setFeatureState(
        { source: "points", id: clickedPointId },
        { clicked: true }
      );

      // remove info message
      infoMenuRef.current.remove();
    });

    let hoveredPointId = null;
    // When the user moves their mouse over the properties layer, change color of point
    map.current.on("mousemove", "properties", (e) => {
      // Change the cursor to a pointer when the mouse is over the points layer.
      map.current.getCanvas().style.cursor = "pointer";

      if (e.features.length > 0) {
        if (hoveredPointId !== null) {
          map.current.setFeatureState(
            { source: "points", id: hoveredPointId },
            { hovered: false }
          );
        }
        hoveredPointId = e.features[0].id;
        map.current.setFeatureState(
          { source: "points", id: hoveredPointId },
          { hovered: true }
        );
      }

      if (e.features.length > 0) {
        const feature = e.features[0];
        // create tooltip for hovering on districts
        tooltip.render(
          <Tooltip
          fundingSource={fundingSource}
          variable={variable}
          feature={feature}
          boundary={boundary}
          point={true}
          />
        );

        // add popup to map
        tooltipRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(tooltipDiv)
          .addTo(map.current);
      }
    });

    // // revert color on point back to default
    map.current.on("mouseleave", "properties", () => {
      map.current.getCanvas().style.cursor = "";

      if (hoveredPointId !== null) {
        map.current.setFeatureState(
          { source: "points", id: hoveredPointId },
          { hovered: false }
        );
      }

      hoveredPointId = null;
      tooltipRef.current.remove();
    });
  };

  // Display info message on map load
  const displayHoverInfo = () => {
    // create info menu when not hovering on districts
    const infoMenuDiv = document.createElement("div");

    ReactDOM.createRoot(infoMenuDiv).render(<HoverInfo />);
    // add popup to map
    infoMenuRef.current
      .setLngLat([0, 0])
      .setDOMContent(infoMenuDiv)
      .addTo(map.current);
    // .togglePopup();
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
      map.current.addControl(new mapboxgl.FullscreenControl(), "bottom-left");
      map.current.addControl(new mapboxgl.GeolocateControl(), "bottom-left");
      map.current.addControl(new HomeControl(), "bottom-left");

      const legend = new LegendControl({
        toggler: true,
        layers: {
          fill: true,
        },
      });

      map.current.addControl(legend, "bottom-right");

      // data sources
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

      // load info message with instructions
      displayHoverInfo();
      // adds default/initial map layers
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

  useUpdateEffect(update, [variable, fundingSource, building, year, boundary]);

  return <div ref={mapDiv} id="mapDiv"></div>;
};
