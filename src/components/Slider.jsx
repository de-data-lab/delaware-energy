import { useContext } from "react";
import { MapContext } from "../App";
import mapInfo from "../utils/mapInfo";
import "./Slider.css"

export const Slider = ({}) => {

    const { fundingSource, year } = useContext(MapContext);
  return (
    <div className="slider-container">
      {/* <label className="label-text" for="yearRange">
        Select a year:
      </label> */}
      <input
        type="range"
        min="2016"
        max="2023"
        step="1"
        className="year-slider"
        id="yearRange"
        list="years"
      />
      <datalist id="years">
        {Object.keys(mapInfo[fundingSource].years).map((item) => (
          <div className="slider-label-container">
          <div className="slider-ticks">
          </div>
          <option key={item} value={item} className="year-option">
            {item}
          </option>
          </div>
          
        ))}
      </datalist>
      {/* <div className="select">
            <label className="label-text" for="yearRange">Select a year:</label>
            <input type="range" min="2016" max="2023" step="1" class="slider" id="yearRange" list="years" />
            <datalist id="years">
            {Object.keys(mapInfo[fundingSource].years).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
            ))}
            </datalist>
          </div> */}
    </div>
  );
};
