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
// import MapboxglSpiderifier from "mapboxgl-spiderifier";
// import {onHover, offHover} from "../utils/onHover";

// change into new data before 2021
import mapDataPre2021 from "../data/aggregated_with_geo_new.json";

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;

export const Map = ({ lng, lat, zoom }) => {
  const mapDiv = useRef(null);
  const map = useRef(null);
  const { pointData, mapData, variable, fundingSource, building, year } =
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

  // Adds map layers
  const addMapLayers = () => {
    // ids for feature-states
    let hoverId = null;
    let clickId = null;
    let array = [];

    // console.log(year);
    // // Change year into INT
    // // setYear(parseInt(year));

    // map through data and return year
    let filteredData = mapData.features.filter(
      (feature) => feature.properties["Tax Allocation Year"] === year
    );

    // map through data and return variable values for colorArray stops
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
      case "adj_popula":
        legendName = `${mapInfo[fundingSource].columns[variable]} (in thousands)`;
        break;

      default:
        break;
    }

    // Conditional for rendering different FILL layer data source
    if (year === "2022" || "All Time") {
      if (map.current.getLayer("fill")) {
        map.current.removeLayer("fill");
      }
      // Fill with data for 2020+
      map.current.addLayer({
        id: "fill",
        type: "fill",
        source: "delaware",
        filter: ["==", "Tax Allocation Year", year],
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
            1000000: "$1M",
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
    } else {
      if (map.current.getLayer("fill")) {
        map.current.removeLayer("fill");
      }
      // Fill with data for 2016-2019
      map.current.addLayer({
        id: "fill",
        type: "fill",
        source: "delawareBefore2020",
        filter: ["==", "Tax Allocation Year", year],
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
    }

    // OUTLINE LAYER
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

      // if sum list is empty then remove popup
      if (array <= 0) {
        sumRef.current.remove();
      }

      return array;
    });

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

    map.current.on("mouseenter", "clusters", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", "clusters", () => {
      map.current.getCanvas().style.cursor = "";
    });

    // cluster points
    // map.current.addLayer({
    //   id: "clusters",
    //   type: "circle",
    //   source: "points",
    //   filter: ["==", "Tax Allocation Year", year],
    //   // filter: ["all", ["==", "Tax Allocation Year", year], ["has", "point_count"]],
    //   paint: {
    //     "circle-color": "#0a2552",
    //     "circle-radius": ["step", ["get", "point_count"], 8, 2, 10, 5, 15],
    //   },
    // });

    // // cluster count
    // map.current.addLayer({
    //   id: "cluster-count",
    //   type: "symbol",
    //   source: "points",
    //   filter: ["==", "Tax Allocation Year", year],
    //   // filter: ["all", ["==", "Tax Allocation Year", year], ["has", "point_count"]],
    //   layout: {
    //     "text-field": ["get", "point_count_abbreviated"],
    //     "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    //     "text-size": 14,
    //   },
    //   paint: {
    //     "text-color": "#ffffff",
    //   },
    // });

    // unclustered points
    map.current.addLayer({
      id: "properties",
      type: "circle",
      source: "points",
      filter: ["==", "Tax Allocation Year", year],
      // filter: ["all", ["==", "Tax Allocation Year", year], ["==", "point_count"]],
      paint: {
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "clicked"], false],
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
    if (year === 'All Time') {
      map.current.setFilter('properties', null);
    }

    // Remove fill if exists and darken outline layer when properties on
    if (map.current.getLayer("fill")) {
      const visibility = map.current.getLayoutProperty("fill", "visibility");

      if (visibility === "visible") {
        map.current.setLayoutProperty("fill", "visibility", "none");
        map.current.setPaintProperty("outline", "line-opacity", 1);
      } else {
        map.current.setLayoutProperty("fill", "visibility", "visible");
        // map.current.setPaintProperty("outline", "line-opacity", .2);
      }
    }

    // const onClickSpider = (e, spiderLeg) => {
    //   console.log("Clicked on ", spiderLeg);

    //   if (clickedPointId !== null) {
    //     map.current.removeFeatureState({
    //       source: "points",
    //       id: clickedPointId,
    //     });
    //   }

    //   const feature = spiderLeg.feature
    //   console.log(feature);
    //   // create popup node
    //   const popupNode = document.createElement("div");
    //   ReactDOM.createRoot(popupNode).render(
    //     <PointInfo
    //       feature={feature}
    //       fundingSource={fundingSource}
    //     />
    //   );
    //   // add popup to map
    //   popUpRef.current
    //     .setLngLat(feature.geometry.coordinates)
    //     .setDOMContent(popupNode)
    //     .addTo(map.current);

    //   // spiderifier.unspiderfy();
    // }

    // const spiderifier = new MapboxglSpiderifier(map.current, {
    //   animate: true,
    //   animationSpeed: 200,
    //   customPin: true,
    //   onClick: (e, spiderLeg) => onClickSpider(e, spiderLeg),
    // });

    // inspect a cluster on click
    // map.current.on("click", "clusters", (e) => {
    //   const SPIDERFY_FROM_ZOOM = 15;
    //   const features = map.current.queryRenderedFeatures(e.point, {
    //     layers: ["clusters"],
    //   });
    //   const clusterId = features[0].properties.cluster_id;
    //   if (!features.length) {
    //     return;
    //   } else if (map.current.getZoom() < SPIDERFY_FROM_ZOOM) {
    //     map.current
    //       .getSource("points")
    //       .getClusterExpansionZoom(clusterId, (err, zoom) => {
    //         if (err) return;

    //         map.current.easeTo({
    //           center: features[0].geometry.coordinates,
    //           zoom: zoom,
    //         });
    //       });
    //     }
    //   else {
    //     map.current
    //       .getSource("points")
    //       .getClusterLeaves(
    //         features[0].properties.cluster_id,
    //         100,
    //         0,
    //         function (err, leafFeatures) {
    //           if (err) {
    //             return console.error(
    //               "error while getting leaves of a cluster",
    //               err
    //             );
    //           }
    //           var markers = leafFeatures.map((leafFeature) => leafFeature.properties);
    //           spiderifier.spiderfy(features[0].geometry.coordinates, markers);
    //         }
    //       );
    //   }
    // });

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

      // if (uniqueFeatures.length < 2) {
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
      // }
      // More than one feature per point
      // else {

      //   if (clickedPointId !== null) {
      //     map.current.removeFeatureState({
      //       source: "points",
      //       id: clickedPointId,
      //     });
      //   }

      //   // const clickedFeatures = features.map()
      //   const clickedOnFeature = uniqueFeatures[0];
      //   // const clickedFeatures2 = _.map(_.range(clickedOnFeature.properties.count), randomMarker);
      //   spiderifier.spiderfy(clickedOnFeature.geometry.coordinates, uniqueFeatures);
      //   // create spiderMarker

      //   // const spiderMarkerNode = document.createElement("div");
      //   // ReactDOM.createRoot(spiderMarkerNode).render(
      //   //   <PointInfo
      //   //     feature={feature}
      //   //     variable={variable}
      //   //     fundingSource={fundingSource}
      //   //   />
      //   // );
      //   // add popup to map
      //   // popUpRef.current
      //   //   .setLngLat(e.lngLat)
      //   //   .setDOMContent(spiderMarkerNode)
      //   //   .addTo(map.current);
      // }

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

      map.current.addSource("delaware", {
        type: "geojson",
        data: mapData,
        generateId: true,
      });

      map.current.addSource("delawareBefore2021", {
        type: "geojson",
        data: mapDataPre2021,
        generateId: true,
      });

      map.current.addSource("points", {
        type: "geojson",
        data: pointData,
        generateId: true,
        // cluster: true,
        // clusterMaxZoom: 14,
        // clusterRadius: 50,
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
    // if (map.current.getLayer("cluster-count")) {
    //   map.current.removeLayer("cluster-count");
    // }
    // if (map.current.getLayer("clusters")) {
    //   map.current.removeLayer("clusters");
    // }

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

  useUpdateEffect(update, [variable, fundingSource, building, year]);

  return <div ref={mapDiv} id="mapDiv"></div>;
};
