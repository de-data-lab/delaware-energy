import { useState } from "react";
import Select from "react-select";
import mapInfo from "../utils/mapInfo";
import BarChart from "./BarChart";
import "./DistrictExplorer.css";
import senateData from "../data/aggregated_with_geo.json";
import { DropdownCollapse } from "../components/DropdownCollapse";
import ExploreDistrict from "./ExploreDistrict";
import StackedBar from "./StackedBar";

export const DistrictExplorer = ({fundingSource, variable, setVariable, year, setYear}) => {
  // chart data
  const chartData = "/long_tax_data_new.csv";
  
  // Dropdown for district
  const [district, setDistrict] = useState([
    { value: 1, label: "District 1 - Sarah Mcbride" },
    { value: 2, label: "District 2 - Darius J. Brown" },
    { value: 3, label: "District 3 - Elizabeth Lockman" },
  ]);

  const [exploreDistrict, setExploreDistrict] = useState({
    value: 1,
    label: "District 1 - Sarah Mcbride",
  });

  // Button for switching views
  const [explorerButton, setExplorerButton] = useState("compare");

  const switchViews = (e) => {
    setExplorerButton(e.target.value);
  };

  // button to close menu
  const [collapseButton, setCollapseButton] = useState(false);

  const collapseMenu = () => {
    setCollapseButton(!collapseButton);
  };

  // Handle change of select dropdowns
  const handleChange = (selectedOption) => {
    setVariable(selectedOption.value);
  };
  const handleDistrictChange = (e) => {
    setDistrict(e);
  };
  const handleExploreDistrictChange = (e) => {
    setExploreDistrict(e);
  };
  const handleYearChange = (e) => {
    setYear(e.value);
  };

  // List of districts and senators
  let districts = senateData.features.map((feature) => ({
    name: `District ${feature.properties.district}`,
    number: feature.properties.district,
    senator: feature.properties.name,
  }));
  districts = [...new Map(districts.map(item => [item.number, item])).values()];
  districts.sort((a, b) => a.number - b.number);

  // tooltip formatter
  const tooltipFormatter = (d) => {
    switch (variable) {
      case "ALLOCATION AMOUNT":
      case "Average Allocation per Tax Credit Unit":
      case "Average Allocation per 100 Persons":
        return `$${parseFloat(d).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}`;

      case "adj_popula":
      case "Average Population per Tax Credit Unit":
        return `${parseFloat(d).toLocaleString(undefined, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}`;

      default:
        return `${parseFloat(d).toLocaleString(undefined, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 0,
        })}`;
    }
  };

  // React multi select options
  const districtOptions = districts.map((item) => ({
    value: item.number,
    label: `${item.name} - ${item.senator}`,
  }));

  const variableOptions = Object.keys(mapInfo[fundingSource].columns).map((item) => ({
    value: item,
    label: mapInfo[fundingSource].columns[item],
  }));

  const fundingOptions = Object.keys(mapInfo).map((item) => ({
    value: item,
    label: mapInfo[item].meta.displayName,
  }));

  const yearOptions = Object.keys(mapInfo[fundingSource].years).map((item) => ({
    value: (item !== "All Time") ? (mapInfo[fundingSource].years[item]) : ("All Time"),
    label: mapInfo[fundingSource].years[item],
  }));

  return (
    <div className="main-container">
      <div
        className={
          "interaction-container " + (collapseButton ? "container-close" : "")
        }
      >
        <ButtonContainer
          explorerButton={explorerButton}
          switchViews={switchViews}
        />
        {explorerButton === "explore" ? (
          <ExploreDistrictButtons
            districtOptions={districtOptions}
            fundingOptions={fundingOptions}
            handleExploreDistrictChange={handleExploreDistrictChange}
            yearOptions={yearOptions}
            handleYearChange={handleYearChange}
          />
        ) : (
          <CompareDistrictButtons
            variableOptions={variableOptions}
            fundingOptions={fundingOptions}
            handleChange={handleChange}
          />
        )}
      </div>
      <DropdownCollapse
        button={collapseButton}
        toggleButton={collapseMenu}
        openClass={"collapse-button-open"}
        closeClass={"collapse-button-close"}
      />
      <div className="chart-container">
        {explorerButton === "explore" ? (
          // Explore District
          <ExploreDistrict
            chartData={chartData}
            districtFilterValue={district}
            collapseButton={collapseButton}
            filterColumn={"district"}
            fundingSource={fundingSource}
            year={year}
            exploreDistrict={exploreDistrict}
          />
        ) : (
          // Compare Districts chart
          // <BarChart
          //   tooltipConfig={{
          //     placement: "top-end",
          //     autoPlace: false,
          //     customTitle: (d) => {
          //       if (d.district === "District Average") {
          //         return "State Average";
          //       }
          //       return `District ${d.district}`;
          //     },
          //     customContent: (d) =>
          //       `${
          //         mapInfo[fundingSource].columns[d.variable]
          //       }: <strong>${tooltipFormatter(d.value)}</strong>`,
          //   }}
          //   chartData={chartData}
          //   title={mapInfo[fundingSource].columns[variable]}
          //   subtitle={mapInfo[fundingSource].meta.title}
          //   xAxis={"district"}
          //   yAxis={"value"}
          //   filterColumn={"variable"}
          //   filterValue={variable}
          //   districtFilterValue={district}
          //   referenceColumn={"district"}
          //   reference={"District Average"}
          //   handleDistrictChange={handleDistrictChange}
          //   district={district}
          //   districtOptions={districtOptions}
          //   collapseButton={collapseButton}
          // />
          <StackedBar
            tooltipConfig={{
              placement: "top-end",
              autoPlace: false,
              customTitle: (d) => {
                if (d.district === "District Average") {
                  return "State Average";
                }
                return `District ${d.district}`;
              },
              customContent: (d) =>
                `${
                  mapInfo[fundingSource].columns[d.variable]
                }: <strong>${tooltipFormatter(d.value)}</strong>`,
            }}
            chartData={chartData}
            title={mapInfo[fundingSource].columns[variable]}
            subtitle={mapInfo[fundingSource].meta.title}
            xAxis={"district"}
            yAxis={"value"}
            series={"Tax Allocation Year"}
            filterColumn={"variable"}
            filterValue={variable}
            fundingSource={fundingSource}
            districtFilterValue={district}
            referenceColumn={"district"}
            reference={"District Average"}
            handleDistrictChange={handleDistrictChange}
            district={district}
            districtOptions={districtOptions}
            collapseButton={collapseButton}
          />
        )}
      </div>
    </div>
  );
};

const ButtonContainer = ({ explorerButton, switchViews }) => {
  return (
    <>
      <div className="button-container">
        <button
          className={
            "explorer-button " +
            (explorerButton === "compare" ? "selected" : "unselected")
          }
          value="compare"
          onClick={(e) => switchViews(e)}
        >
          Compare Districts
        </button>
        <button
          className={
            "explorer-button " +
            (explorerButton === "explore" ? "selected" : "unselected")
          }
          value="explore"
          onClick={(e) => switchViews(e)}
        >
          Explore your District
        </button>
      </div>
    </>
  );
};

const ExploreDistrictButtons = ({
  districtOptions,
  handleExploreDistrictChange,
  handleYearChange,
  fundingOptions,
  yearOptions
}) => {
  const [isSearchable, setIsSearchable] = useState(true);
  const [isRtl, setIsRtl] = useState(false);
  return (
    <>
      <div className="options-container">
        <div className="select-explorer">
          <label className="label-text">Select a funding source:</label>
          <Select
            id="funding"
            className="basic-single react-select"
            classNamePrefix="select"
            isSearchable={isSearchable}
            isRtl={isRtl}
            name="funding"
            options={fundingOptions}
            defaultValue={fundingOptions[0]}
          />
        </div>
        <div className="select-explorer">
          <label className="label-text">Select district to explore:</label>
          <Select
            id="district"
            onChange={(e) => handleExploreDistrictChange(e)}
            className="basic-single react-select"
            classNamePrefix="select"
            isSearchable={isSearchable}
            isRtl={isRtl}
            name="districts"
            options={districtOptions}
            defaultValue={districtOptions[0]}
          />
        </div>
        <div className="select-explorer">
          <label className="label-text">Select a year:</label>
          <Select
            id="years"
            onChange={(e) => handleYearChange(e)}
            className="basic-single react-select"
            classNamePrefix="select"
            isSearchable={isSearchable}
            isRtl={isRtl}
            name="years"
            options={yearOptions}
            defaultValue={yearOptions[0]}
          />
        </div>
      </div>
    </>
  );
};

const CompareDistrictButtons = ({
  variableOptions,
  fundingOptions,
  handleChange,
}) => {
  const [isSearchable, setIsSearchable] = useState(true);
  const [isRtl, setIsRtl] = useState(false);
  return (
    <>
      <div className="options-container">
        <div className="select-explorer">
          <label className="label-text">Select a funding source:</label>
          <Select
            id="react-select"
            className="basic-single react-select"
            classNamePrefix="select"
            isSearchable={isSearchable}
            isRtl={isRtl}
            name="funding"
            options={fundingOptions}
            defaultValue={fundingOptions[0]}
          />
        </div>
        <div className="select-explorer">
          <label className="label-text">Select a variable:</label>
          <Select
            id="react-select"
            onChange={handleChange}
            className="basic-single react-select"
            classNamePrefix="select"
            isSearchable={isSearchable}
            isRtl={isRtl}
            name="variable"
            options={variableOptions}
            defaultValue={variableOptions[0]}
          />
        </div>
      </div>
    </>
  );
};
