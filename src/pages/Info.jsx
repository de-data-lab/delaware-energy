import mapInfo from "../utils/mapInfo";
import { Link } from "react-router-dom";
import "./Info.css";

export const Info = () => {
  return (
    <div className="container">
      <div className="info-container container-margin">
        <h2 className="information-header">Welcome!</h2>
        <h3 className="information-text">
          This interactive tool was made to visualize variables relating to
          different subsidized housing funding sources within the state of
          Delaware senate districts. Made possible through the collaboration of
          Tech Impact’s Data Innovation Lab with the Delaware State Housing
          Authority.
        </h3>
        <h2 className="information-header">Data Sources</h2>
        <div>
          <h2 className="information-subheader">Delaware Senate Data</h2>
          <div className="information-text-container">
            <li className="information-text">
              Delaware senate district boundaries used in this app can be found
              on the{" "}
              <Link
                className="information-link"
                to="https://www2.census.gov/geo/tiger/GENZ2022/"
                target="_blank"
                rel="noreferrer noopener"
              >
                U.S. Census Bureau website
              </Link>
              .
            </li>
            <li className="information-text">
              Delaware senate district data (including senator names and 2020
              district populations) can be found on the{" "}
              <Link
                className="information-link"
                to="https://legis.delaware.gov/Redistricting/2022FinalSenateDistricts"
                target="_blank"
                rel="noreferrer noopener"
              >
                Delaware General Assembly website
              </Link>
              .
            </li>
          </div>
          <h2 className="information-subheader">
            Delaware Subsidized Housing Data
          </h2>
          <div className="information-text-container">
            <li className="information-text">
              Delaware subsidized housing funding source data (2016-2022) was provided by
              the{" "}
              <Link
                className="information-link"
                to="http://www.destatehousing.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Delaware State Housing Authority
              </Link>
              .
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};
