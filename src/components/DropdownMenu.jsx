import { useContext, useState } from "react";
import Select from "react-select";
import { MapContext } from "../App";
import { allEEIFData } from "../data/DSHA_EEIF_all_years/EEIF_data_objects";
import { allHouseData } from "../data/DSHA_SLDL_all_years/SLDL_data_objects";
import { allSenateData } from "../data/DSHA_SLDU_all_years/SLDU_data_objects";
import DropdownCollapse from "./DropdownCollapse";
import "./DropdownMenu.css";

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

  const [button, setButton] = useState(false);
  const [dropdownButton, setDropdownButton] = useState(false);

  const toggleButton = () => {
    setButton(!button);
  };
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
        if (key !== "District" &&
         key!== "Name"  &&
         key!== "Solar Households" &&
         key!== "Owner Occupied Households" &&
         key!== "EEIF Electricity Savings (kWh/yr)" &&
         key !== "EEIF Natural Gas Savings (kBtus/yr)" &&
         key !== "EEIF Greenhouse Gas Emission Reduction (MtCO2e)") {
          uniqueKeys.add(key);
        }
      });
    });

    

    return Array.from(uniqueKeys);
  }
  const variableOptions = extractKeys(source).map((option) => ({
    value: option,
    label: option === "Solar Households per 1000" ? "Solar Households per 1000 Households" : option
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
      setPointSource({ name: null, data: null });
    }
    if (selectedPoints === "EEIF") {
      const selectedPointData = allEEIFData.find(
        (dataObj) => dataObj.year === selectedYear
      );
      if (selectedPointData === undefined) {
        setPointSource({ name: null, data: null });
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

  // React-select styles for boundary dropdown
  const customStyles = {
    menu: (styles, state) => {
      return { 
        ...styles,
        marginTop: 0,
        borderRadius: "0 0 var(--border-sm) var(--border-sm)",
      }
    },
    menuPortal: (styles, state) => {
      return { 
        ...styles,
        zIndex: 4,
      }
    },
    menuList: (styles, state) => {
      return { 
        ...styles,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: "0 0 var(--border-sm) var(--border-sm)",
      }
    },
    control: (styles) => ({
      ...styles,
      background: "var(--navy)",
      // match with the menu border
      borderRadius: "var(--border-sm) var(--border-sm) 0 0",
      borderStyle: "none",
      textAlign: "center",
      padding: "var(--padding-xs)",
      fontSize: "var(--font-size-md)",
      cursor: "pointer"
    }),
    option: (styles, state) => ({
      ...styles,
      // color: state.isDisabled
      // ? undefined
      // : state.isSelected
      // ? "var(--white)"
      // : state.isFocused
      // ? "var(--white)"
      // : undefined,
      // backgroundColor: state.isDisabled
      //   ? undefined
      //   : state.isSelected
      //   ? "var(--navy)"
      //   : state.isFocused
      //   ? "var(--light-navy)"
      //   : undefined,
      padding: "var(--padding-sm)",
    }),
    singleValue: (styles, state) => ({
      ...styles,
      color: state.isSelected ? "var(--navy)" : "var(--white)",
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      backgroundColor: "var(--white)",
    }),
  };

  return (
    <>
      <DropdownCollapse
        className={"toggle-button"}
        button={button}
        toggleButton={toggleButton}
        openClass={"button-open"}
        closeClass={"toggle-button-close"}
      />

      <div
        id="dropdown-menu"
        className={"dropdown-menu " + (button ? "menu-close" : "")}
      >
        <Select
          className="boundary-select"
          tabIndex={0}
          defaultValue={boundaryOptions[0]}
          onChange={(e) => handleBoundaryChange(e)}
          menuPortalTarget={document.body}
          label="Single select"
          isRtl={false}
          isSearchable={false}
          options={boundaryOptions}
          styles={customStyles}
          onMenuOpen={() => setDropdownButton(true)}
          onMenuClose={() => setDropdownButton(false)}
          components={{
            DropdownIndicator: () => (
              <DropdownCollapse
              tab={-1}
              className={"dropdown-button"} 
              button={dropdownButton}
              closeClass={"dropdown-button-close"}
              openClass={"dropdown-button-open"}
              /> 
            ),
          }}
        />

        <div className="select-container">
          {/* Year */}
          <div className="select">
            <label className="label-text" htmlFor="year">
              Select a year:
            </label>
            <Select
              id="year"
              className="basic-single"
              classNamePrefix="select"
              defaultValue={yearOptions[0]}
              isSearchable={true}
              isRtl={false}
              onChange={(e) => handleYearChange(e)}
              options={yearOptions}
            />
          </div>

          {/* Variable */}
          <div className="select">
            <label className="label-text" htmlFor="variable">
              Select an outcome:
            </label>
            <Select
              id="variable"
              className="variable-select"
              defaultValue={variableOptions[0]}
              onChange={(e) => handleVariableChange(e)}
              options={variableOptions}
              isSearchable={true}
              isRtl={false}
            />
          </div>
          {/* Point-select */}
          <div className="select">
            <label className="label-text" htmlFor="point-select">
              Select points:
            </label>
            <Select
              id="point-select"
              className="point-select"
              defaultValue={pointOptions[0]}
              onChange={(e) => handlePointsChange(e)}
              options={pointOptions}
              isSearchable={true}
              isRtl={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DropdownMenu;
