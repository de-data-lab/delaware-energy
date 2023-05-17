import { useState, useContext } from "react";
import { MapContext } from "../App";
import mapInfo from "../utils/mapInfo";

import "./DropdownMenu.css";
import { DropdownCollapse } from "./DropdownCollapse";


export const DropdownMenu = ({}) => {
    const { setVariable, fundingSource, setFundingSource, building, setBuilding, year, setYear } = useContext(MapContext);

    const [button, setButton] = useState(false);
    const { source } = mapInfo[fundingSource].meta; 

    const toggleButton = () => {
      setButton(!button);
    };

    const toggleBuildings = () => {
      setBuilding(!building);
    };

    

    return (
    <>
    <DropdownCollapse button={button} toggleButton={toggleButton} openClass={"button-open"} closeClass={"toggle-button-close"}/>
    
    <div className={"dropdown-menu " + (button ? "menu-close" : "")} id="dropdown-menu">
        <h2 className="dropdown-header">
          Legislative Districts
        </h2>
      <div className="select-container">
          {/* YEAR */}
          <div className="select">
            <label className="label-text">Select a year:</label>
            <select
              className="select-text"
              onChange={(e) => {
                setYear(e.target.value);
              }}
            >
              {Object.keys(mapInfo[fundingSource].years).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          
          {/* FUNDING SOURCE */}
          <div className="select">
            <label className="label-text">Select a funding source:</label>
            <select
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
          </div>

          {/* VARIABLE */}
          <div className="select">
            <label className="label-text">Select a variable:</label>
            <select
              className="select-text"
              onChange={(e) => {
                setVariable(e.target.value);
              }}
            >
              {Object.keys(mapInfo[fundingSource].columns).map((item) => (
                <option key={item} value={item}>
                  {mapInfo[fundingSource].columns[item]}
                </option>
              ))}
            </select>
          </div>

          {/* Building toggle */}
          <div className="toggle-container">
            <label className="label-text">Show property locations:</label>
            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={toggleBuildings}></input>
            </div>
          </div>

          {/* Data source */}
          <div className="data-source-flex">
            <p className="data-source-text">
              Data Source:
            </p>
            <ul className="link-list">
              {source.map((source) => (
                    <li key={source}><a href={source.link} target="_blank" rel="noreferrer" className="data-source-link">{source.name}</a></li>
              ))}
            </ul>
          </div>

        </div>

      </div>
      </>
    )
  };
  
