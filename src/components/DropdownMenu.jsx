import { useState, useContext } from "react";
import Select from "react-select";
import { allSenateData } from "../data/DSHA_Population_SLDU_all_years/SLDU_data_objects";
import { allHouseData } from "../data/DSHA_Population_SLDL_all_years/SLDL_data_objects";
import { allEEIFData } from "../data/DSHA_EEIF_all_years/EEIF_data_objects";
import { MapContext } from "../App";

function DropdownMenu() {
  const {
    variable,
    setVariable,
    year,
    setYear,
    boundary,
    setBoundary,
    source,
    setSource,
    points,
    setPoints,
    pointSource,
    setPointSource,
  } = useContext(MapContext);

  const boundaryOptions = [
    { value: "senate", label: "Senate Districts" },
    { value: "house", label: "House of Representative Districts" },
  ];
  const yearOptions = allHouseData.map((houseObj) => ({
    value: houseObj.year,
    label: houseObj.year,
  }));

  function extractKeys(dataObject) {
    const uniqueKeys = new Set();

    dataObject.data.features.forEach((feature) => {
      const properties = feature.properties;
      Object.keys(properties).forEach((key) => {
        if (key !== "District") {
          uniqueKeys.add(key);
        }
      });
    });

    return Array.from(uniqueKeys);
  }
  const variableOptions = extractKeys(source).map((option) => ({
    value: option,
    label: option,
  }));

  const pointOptions = [
    { value: null, label: "Display no points" },
    { value: "EEIF", label: "Energy Efficiency Investment Fund Grants" },
  ];

  function updateSource(selectedBoundary, selectedYear) {
    if (selectedBoundary === "senate") {
      const selectedData = allSenateData.find(
        (dataObj) => dataObj.year === selectedYear
      );
      setSource(selectedData);
    } else if (selectedBoundary === "house") {
      const selectedData = allHouseData.find(
        (dataObj) => dataObj.year === selectedYear
      );
      setSource(selectedData);
    }
  }

  function updatePointSource(selectedPoints, selectedYear) {
    if (selectedPoints === null) {
      setPointSource({name:null, data: null});
    }
    if (selectedPoints === "EEIF") {
      const selectedPointData = allEEIFData.find(
        (dataObj) => dataObj.year === selectedYear
      );
      if (selectedPointData === undefined) {
        setPointSource({name:null, data: null});
      } else {
        setPointSource(selectedPointData);
      }
    }
  }

  function handleBoundaryChange(e) {
    setBoundary(e.value);
    updateSource(e.value, year);
  }

  function handleYearChange(e) {
    setYear(e.value);
    updateSource(boundary, e.value);
    updatePointSource(points, e.value);
  }

  function handleVariableChange(e) {
    setVariable(e.value);
  }

  function handlePointsChange(e) {
    setPoints(e.value);
    updatePointSource(e.value, year);
  }

  return (
    <div id="dropdown-menu" className="dropdown-menu">
      <Select
        className="boundary-select"
        defaultValue={boundaryOptions[0]}
        onChange={(e) => handleBoundaryChange(e)}
        options={boundaryOptions}
      />

      <Select
        className="year-select"
        defaultValue={yearOptions[0]}
        onChange={(e) => handleYearChange(e)}
        options={yearOptions}
      />

      <Select
        className="variable-select"
        defaultValue={variableOptions[0]}
        onChange={(e) => handleVariableChange(e)}
        options={variableOptions}
      />

      <Select
        className="point-select"
        defaultValue={pointOptions[0]}
        onChange={(e) => handlePointsChange(e)}
        options={pointOptions}
      />
    </div>
  );
}

export default DropdownMenu;
