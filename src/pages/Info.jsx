import { Link } from "react-router-dom";
import "./Info.css";

export const Info = () => {
  return (
    <div className="container">
      <div className="info-container">
        <h2 className="information-header">Welcome!</h2>
        <h3 className="information-text">
          This interactive tool was made to visualize variables relating to the
          Low-Income Housing Tax Credits program within the state of Delaware
          legislative districts. Made possible through the collaboration of Tech
          Impact’s Data Innovation Lab with the Delaware State Housing
          Authority.
        </h3>
        <h2 className="information-header">Data Dictionary</h2>
        <div>
          <h2 className="information-subheader">District Boundaries</h2>
          <div className="information-text-container">
            <li className="information-text">
              Legislative boundary redistricting occurs generally every 10 years. To account for this, there are two district boundary layers for each legislative house. For years before 2022, the 2011 district boundaries are used. For 2022 and the sum over all years, the current (2022) district boundaries are used. Current (2022) senator and representative names are used regardless of the year selected. 
            </li>
            <ul className="circle-list">
              <li className="information-text">
                Property data was assigned to a district based on the district boundaries in the year of the funding allocation. Some properties may have changed districts after redistricting.
              </li>
            </ul>
          </div>
          <h2 className="information-subheader">Years</h2>
          <div className="information-text-container">
            <li className="information-text">
              <strong>Sum over all years - </strong>sum of a variable over all
              years collected.
            </li>
            <ul className="circle-list information-subtext-container">
              <li className="information-text">
              <strong>Average allocation amount per 100 persons - </strong>this variable now represents the total amount allocated to a district over all years relative to its population while accounting for how the population changes each year.
              </li>
              <li className="information-text">
              <strong>Average allocation amount per tax credit unit - </strong>this variable now represents the total amount allocated to a district over all years relative to the number of tax credit units that were present in the year of allocation.
              </li>
            </ul>
          </div>
          <h2 className="information-subheader">Variables</h2>
          <div className="information-text-container">
            <li className="information-text">
              <strong>Total tax credit units - </strong>number of tax credit
              units allocated to a district in a certain year. (When looking at individual property information, total tax credits are equal to the total tax credits allocated to that property in a given year.)
            </li>
            <ul className="circle-list">
              <li className="information-text">
                Some properties' tax credit units received multiple allocations over the course of two different years, so there are cases where those units are
                counted twice.
              </li>
            </ul>
            <li className="information-text">
              <strong>Total allocation amount - </strong> amount of funding allocation that
              a district received in a given year. (When looking at individual property information, total allocation amount is equal to the total funding allocated to that property in a given year.)
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
          <h2 className="information-subheader">Delaware Legislative Data</h2>
          <div className="information-text-container">
            <li className="information-text">
              Delaware Senate district boundaries (2011 and 2022) and House of Representatives district boundaries (2010 and 2022) used in this app can be found
              on the{" "}
              <Link
                className="information-link"
                to="https://www2.census.gov/geo/tiger/"
                target="_blank"
                rel="noreferrer noopener"
              >
                U.S. Census Bureau website
              </Link>
              .
            </li>
            <li className="information-text">
              Delaware legislative district populations for each year were estimated using the 5-year "period" estimates from the {" "}
              <Link
                className="information-link"
                to="https://www.census.gov/data/developers/data-sets/acs-5year.html"
                target="_blank"
                rel="noreferrer noopener"
              >
                American Community Survey
              </Link>
              .
            </li>
            <li className="information-text">
              Delaware Senate and House of Representatives district data (2022 senator and representative names) can be found on
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
