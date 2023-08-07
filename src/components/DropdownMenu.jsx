import { useState, useContext } from "react";
import Select from "react-select";
import { allSenateData } from "../data/DSHA_Population_SLDU_all_years/SLDU_data_objects";
import {
  allHouseData
} from "../data/DSHA_Population_SLDL_all_years/SLDL_data_objects";
import { MapContext } from "../App";

const allData = allSenateData.concat(allHouseData);
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
  } = useContext(MapContext);

  const boundaryOptions = [
    { value: "senate", label: "Senate Districts" },
    { value: "house", label: "House of Representative Districts" },
  ];
  const yearOptions = allHouseData.map((houseObj) => ({
    value: houseObj.year,
    label: houseObj.year,
  }));

  function updateSource(selectedBoundary, selectedYear) {
    console.log("I ran")
    if (selectedBoundary === "senate") {
      const selectedData = allSenateData.find(
        (dataObj) => dataObj.year === selectedYear
      );
      console.log(selectedData)
      setSource(selectedData);
    } else if (selectedBoundary === "house") {
      const selectedData = allHouseData.find(
        (dataObj) => dataObj.year === selectedYear
      );
      console.log(selectedData)
      setSource(selectedData);
    }
  }

  function handleBoundaryChange(e) {
    setBoundary(e.value);
    updateSource(e.value, year);
  }
  function handleYearChange(e) {
    setYear(e.value);
    updateSource(boundary, e.value);
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
    </div>
  );
}

export default DropdownMenu;
