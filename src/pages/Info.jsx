import { Link } from "react-router-dom";
import "./Info.css";

export const Info = () => {
  return (
    <div className="container">
      <div className="info-container container-margin">
        <h2 className="information-header">Welcome!</h2>
        <h3 className="information-text">
          This interactive tool was made to visualize variables relating to the
          Low-Income Housing Tax Credits program within the state of Delaware
          senate districts. Made possible through the collaboration of Tech
          Impact’s Data Innovation Lab with the Delaware State Housing
          Authority.
        </h3>
        {/* <h2 className="information-subheader">How to use our map</h2>
        <div className="information-text-container">
            <li className="information-text">
            Hover over a district to see its variable value
            </li>
            <li className="information-text">
            Click on a district to sum its value to other districts
            </li>
        </div> */}
        <h2 className="information-header">Data Dictionary</h2>
        <div>
          <h2 className="information-subheader">District Boundaries</h2>
          <div className="information-text-container">
            <li className="information-text">
              There are two senate district boundary layers used in this map to account for the senate boundary redistricting that occurs generally every 10 years. For years before 2022, the 2011 district boundaries are used. For 2022 and the sum over all years, the current (2022) district boundaries are used. Current (2022) senator names are used regardless of the year selected. 
            </li>
            <ul className="circle-list">
              <li className="information-text">
                Property data was assigned to a district based on the district boundaries in the year of the funding allocation. Some properties may have changed districts since the 2022 redistricting.
              </li>
            </ul>
          </div>
          <h2 className="information-subheader">Years</h2>
          <div className="information-text-container">
            <li className="information-text">
              <strong>Sum over all years - </strong>sum of a variable over all
              years collected.
            </li>
          </div>
          <h2 className="information-subheader">Variables</h2>
          <div className="information-text-container">
            <li className="information-text">
              <strong>Total tax credit units - </strong>number of tax credit
              units allocated to a district in a certain year. (When looking at individual property info, total tax credits are equal to the total tax credits allocated to that property in a given year.)
            </li>
            <ul className="circle-list">
              <li className="information-text">
                Some properties' tax credit units received multiple allocations over the course of two different years, so there are cases where those units are
                counted twice.
              </li>
            </ul>
            <li className="information-text">
              <strong>Total allocation amount - </strong> amount of funding allocation that
              a district received in a given year. (When looking at individual property info, total allocation amount is equal to the total funding allocated to that property in a given year.)
            </li>
            <li className="information-text">
              <strong>Average allocation amount per 100 persons -</strong>{" "}
              average amount of funding allocation per 100 persons in a given district.
            </li>
            <li className="information-text">
              <strong>Average allocation amount per tax credit unit -</strong>{" "}
              average allocation amount per tax credit unit in a district.
            </li>
          </div>
        </div>
        <h2 className="information-header">Data Sources</h2>
        <div>
          <h2 className="information-subheader">Delaware Senate Data</h2>
          <div className="information-text-container">
            <li className="information-text">
              Delaware senate district boundaries (2011 and 2022) used in this app can be found
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
              Delaware district populations for each year were estimated using the yearly population data from{" "}
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
              Delaware senate district data (2022 senator names) can be found on
              the{" "}
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
              Delaware LIHTC funding source data (2016-2022) was
              provided by the{" "}
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
