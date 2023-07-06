import { useState, useContext } from "react";
import Select from "react-select";
import { MapContext } from "../App";
import mapInfo from "../utils/mapInfo";

import "./DropdownMenu.css";
import { DropdownCollapse } from "./DropdownCollapse";

export const DropdownMenu = ({}) => {
  const { setVariable, fundingSource, building, setBuilding, setYear, boundary, setBoundary } =
    useContext(MapContext);

  const [button, setButton] = useState(false);
  const [dropdownButton, setDropdownButton] = useState(false);
  const { source } = mapInfo[fundingSource].meta;

  const toggleButton = () => {
    setButton(!button);
  };

  const toggleBuildings = () => {
    setBuilding(!building);
  };

  // React multi select options
  const variableOptions = Object.keys(mapInfo[fundingSource].columns)
    // filters out avg pop per tax credit and population
    .filter((feature) => {
      return (
        feature !== "Average Population per Tax Credit Unit" &&
        feature !== "Population"
      );
    })
    .map((item) => ({
      value: item,
      label: mapInfo[fundingSource].columns[item],
    }));

  const yearOptions = Object.keys(mapInfo[fundingSource].years).map((item) => ({
    value:
      item !== "Sum over All Time"
        ? mapInfo[fundingSource].years[item]
        : "Sum over All Time",
    label: mapInfo[fundingSource].years[item],
  }));

  const boundaryOptions = [
    { value: "senate", label: "Senate Districts" },
    {
      value: "house",
      label: "House of Representatives Districts",
    }
  ];

  // Handle change of select dropdowns
  const handleChange = (selectedOption) => {
    setVariable(selectedOption.value);
  };
  const handleYearChange = (e) => {
    setYear(e.value);
  };
  
  const handleBoundaryChange = (e) => {
    setBoundary(e.value);
  };

  // React select features
  const [isSearchable, setIsSearchable] = useState(true);
  const [isRtl, setIsRtl] = useState(false);

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
        className={"dropdown-menu " + (button ? "menu-close" : "")}
        id="dropdown-menu"
      >
        {/* <h2 className="dropdown-header">Senate Districts</h2> */}
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
            // IndicatorSeparator: () => null,
          }}
        />

        <div className="select-container">
          {/* YEAR */}
          <div className="select">
            <label className="label-text" htmlFor="year">
              Select a year:
            </label>
            <Select
              id="year"
              onChange={(e) => handleYearChange(e)}
              className="basic-single"
              classNamePrefix="select"
              isSearchable={true}
              isRtl={false}
              name="year"
              options={yearOptions}
              defaultValue={yearOptions[7]}
            />
          </div>

          {/* FUNDING SOURCE */}
          {/* <div className="select">
            <label className="label-text" htmlFor="funding">Select a funding source:</label>
            <select
              id="funding"
              className="select-text"
              onChange={(e) => {
                setFundingSource(e.target.value);
              }}
            >
              {Object.keys(mapInfo).map((item) => (
                <option key={item} value={item}>
                  {mapInfo[item].meta.displayName}
                </option>
              ))}
            </select>
          </div> */}

          {/* VARIABLE */}
          <div className="select">
            <label className="label-text" htmlFor="variable">
              Select a variable:
            </label>
            <Select
              id="variable"
              onChange={(e) => handleChange(e)}
              className="basic-single"
              classNamePrefix="select"
              isSearchable={true}
              isRtl={false}
              name="variable"
              options={variableOptions}
              defaultValue={variableOptions[0]}
            />
          </div>

          {/* Building toggle */}
          <div className="toggle-container">
            <label className="label-text" htmlFor="flexSwitchCheckDefault">
              Show property locations:
            </label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                onClick={toggleBuildings}
              ></input>
            </div>
          </div>

          {/* Data source */}
          <div className="data-source-flex">
            <p className="data-source-text">Data Source:</p>
            <ul className="link-list">
              {source.map((source) => (
                <li key={source}>
                  <a
                    href={source.link}
                    target="_blank"
                    rel="noreferrer"
                    className="data-source-link"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
