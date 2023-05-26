import { useState, useContext } from "react";
import Select from "react-select";
import { MapContext } from "../App";
import mapInfo from "../utils/mapInfo";

import "./DropdownMenu.css";
import { DropdownCollapse } from "./DropdownCollapse";

export const DropdownMenu = ({}) => {
  const { setVariable, fundingSource, building, setBuilding, setYear } =
    useContext(MapContext);

  const [button, setButton] = useState(false);
  const { source } = mapInfo[fundingSource].meta;

  const toggleButton = () => {
    setButton(!button);
  };

  const toggleBuildings = () => {
    setBuilding(!building);
  };

  // React multi select options
  const variableOptions = Object.keys(mapInfo[fundingSource].columns).map(
    (item) => ({
      value: item,
      label: mapInfo[fundingSource].columns[item],
    })
  );

  const yearOptions = Object.keys(mapInfo[fundingSource].years).map((item) => ({
    value:
      item !== "Sum over All Time"
        ? mapInfo[fundingSource].years[item]
        : "Sum over All Time",
    label: mapInfo[fundingSource].years[item],
  }));

  // Handle change of select dropdowns
  const handleChange = (selectedOption) => {
    setVariable(selectedOption.value);
  };
  const handleYearChange = (e) => {
    setYear(e.value);
  };

  // React select features
  const [isSearchable, setIsSearchable] = useState(true);
  const [isRtl, setIsRtl] = useState(false);

  return (
    <>
      <DropdownCollapse
        button={button}
        toggleButton={toggleButton}
        openClass={"button-open"}
        closeClass={"toggle-button-close"}
      />

      <div
        className={"dropdown-menu " + (button ? "menu-close" : "")}
        id="dropdown-menu"
      >
        <h2 className="dropdown-header">Senate Districts</h2>

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
              isSearchable={isSearchable}
              isRtl={isRtl}
              name="year"
              options={yearOptions}
              defaultValue={yearOptions[7]}
            />
          </div>
          {/* yearOptions.find(item => item.value === year) */}

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
              isSearchable={isSearchable}
              isRtl={isRtl}
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
