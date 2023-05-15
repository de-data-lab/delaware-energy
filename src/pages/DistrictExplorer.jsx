import { useState } from "react";
import Select from "react-select";
import mapInfo from "../utils/mapInfo";
import BarChart from "./BarChart";
import "./DistrictExplorer.css";
import senateData from "../data/aggregated_with_geo.json";
import { DropdownCollapse } from "../components/DropdownCollapse";
import ExploreDistrict from "./ExploreDistrict";
import { reference } from "@popperjs/core";

export const DistrictExplorer = () => {
  // chart data
  const chartData = "/long_tax_data.csv";
  // Dropdown for fundingSource
  const [funding, setFunding] = useState("LIHTC");
  // Dropdown for variable
  const [explorerVariable, setExplorerVariable] = useState([
    "# of Tax Credit Units",
  ]);
  // Dropdown for district
  const [district, setDistrict] = useState([
    { value: 1, label: "District 1 - Sarah Mcbride" },
    { value: 2, label: "District 2 - Darius J. Brown" },
    { value: 3, label: "District 3 - S. Elizabeth Lockman" },
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
    setExplorerVariable(selectedOption.value);
  };
  const handleDistrictChange = (e) => {
    setDistrict(e);
  };
  const handleExploreDistrictChange = (e) => {
    setExploreDistrict(e);
  };

  // List of districts and senators
  const districts = senateData.features.map((feature) => ({
    name: `District ${feature.properties.district}`,
    number: feature.properties.district,
    senator: feature.properties.name,
  }));
  districts.sort((a, b) => a.number - b.number);

  const tooltipFormatter = (d) => {
    switch (explorerVariable) {
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

  const variableOptions = Object.keys(mapInfo[funding].columns).map((item) => ({
    value: item,
    label: mapInfo[funding].columns[item],
  }));

  const fundingOptions = Object.keys(mapInfo).map((item) => ({
    value: item,
    label: mapInfo[item].meta.displayName,
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
            funding={funding}
            exploreDistrict={exploreDistrict}
          />
        ) : (
          // Compare Districts chart
          <BarChart
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
                  mapInfo[funding].columns[d.variable]
                }: <strong>${tooltipFormatter(d.value)}</strong>`,
            }}
            chartData={chartData}
            title={mapInfo[funding].columns[explorerVariable]}
            subtitle={mapInfo[funding].meta.title}
            xAxis={"district"}
            yAxis={"value"}
            filterColumn={"variable"}
            filterValue={explorerVariable}
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
  fundingOptions,
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
            className="basic-single"
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
            // className="select-text select"
            id="react-select"
            onChange={(e) => handleExploreDistrictChange(e)}
            className="basic-single"
            classNamePrefix="select"
            isSearchable={isSearchable}
            isRtl={isRtl}
            name="districts"
            options={districtOptions}
            defaultValue={districtOptions[0]}
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
            className="basic-single"
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
            className="basic-single"
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
