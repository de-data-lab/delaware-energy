import { useState } from "react";
import Select from "react-select";
import mapInfo from "../utils/mapInfo";
import BarChart from "./BarChart";
import "./DistrictExplorer.css";
import senateData from "../data/aggregated_with_geo.json";

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
  ]);

  // Button for switching views
  const [explorerButton, setExplorerButton] = useState("compare");

  const switchViews = (e) => {
    setExplorerButton(e.target.value);
  };

  // Handle change of select dropdowns
  const handleChange = (selectedOption) => {
    setExplorerVariable(selectedOption.value);
  };
  const handleDistrictChange = (e) => {
    setDistrict(e);
  };

  // List of districts and senators
  const districts = senateData.features.map((feature) => ({
    name: `District ${feature.properties.district}`,
    number: feature.properties.district,
    senator: feature.properties.name,
  }));
  districts.sort((a, b) => a.number - b.number);

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
      <div className="interaction-container">
        <ButtonContainer
          explorerButton={explorerButton}
          switchViews={switchViews}
        />
        {explorerButton === "explore" ? (
          <ExploreDistrict
            districts={districts}
            funding={funding}
            setExplorerVariable={setExplorerVariable}
            districtOptions={districtOptions}
            variableOptions={variableOptions}
          />
        ) : (
          <CompareDistrict
            district={district}
            districtOptions={districtOptions}
            variableOptions={variableOptions}
            fundingOptions={fundingOptions}
            handleChange={handleChange}
            handleDistrictChange={handleDistrictChange}
          />
        )}
      </div>
      <div className="container-fluid chart-container">
        {explorerButton === "explore" ? (
          " "
        ) : (
          <BarChart
            tooltipConfig={{
              placement: "top-end",
              autoPlace: false,
              customTitle: (d) => `District ${d.district}`,
              customContent: (d) =>
                `${mapInfo[funding].columns[d.variable]}: <strong>${
                  d.value
                }</strong>`,
            }}
            chartData={chartData}
            title={mapInfo[funding].columns[explorerVariable]}
            subtitle={mapInfo[funding].meta.title}
            xAxis={"district"}
            yAxis={"value"}
            filterColumn={"variable"}
            filterValue={explorerVariable}
            districtFilterValue={district}
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

const ExploreDistrict = ({
  districts,
  setExplorerVariable,
  funding,
  districtOptions,
  variableOptions,
}) => {
  const [isSearchable, setIsSearchable] = useState(true);
  const [isRtl, setIsRtl] = useState(false);

  return (
    <>
      <div className="options-container">
        <div className="select-explorer">
          <label className="label-text">Select a variable:</label>
          <Select
            // onChange={(e) => {
            //   setExplorerVariable(e.target.options.value);
            // }}
            className="basic-single"
            classNamePrefix="select"
            // defaultValue={variableOptions[0]}
            isSearchable={isSearchable}
            isRtl={isRtl}
            name="variable"
            options={variableOptions}
            defaultValue={variableOptions[0]}
          />
        </div>
        <div className="select-explorer">
          <label className="label-text">Select a district to explore:</label>
          <Select
            // className="select-text select"
            // onChange={(e) => {
            //   setDistrict(e.target.value);
            // }}
            className="basic-single"
            classNamePrefix="select"
            isSearchable={isSearchable}
            isRtl={isRtl}
            name="districts"
            options={districtOptions}
            defaultValue={[districtOptions[3], districtOptions[10]]}
          />
        </div>
      </div>
    </>
  );
};

const CompareDistrict = ({
  district,
  districtOptions,
  variableOptions,
  fundingOptions,
  handleChange,
  handleDistrictChange,
}) => {
  const [isSearchable, setIsSearchable] = useState(true);
  const [isRtl, setIsRtl] = useState(false);
  return (
    <>
      <div className="options-container">
        <div className="select-explorer">
          <label className="label-text">Select a funding source:</label>
          <Select
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
        <div className="select-explorer">
          <label className="label-text">Select districts to compare:</label>
          <Select
            onChange={(e) => handleDistrictChange(e)}
            options={districtOptions.filter((item) => {
              return !district.some((f) => {
                return f.value === item.value;
              });
            })}
            // defaultValue={[districtOptions[3], districtOptions[10]]}
            name="districts"
            className="basic-multi-select"
            classNamePrefix="select"
            isSearchable={isSearchable}
            defaultValue={[districtOptions[0], districtOptions[1]]}
            isMulti
          ></Select>
        </div>
      </div>
    </>
  );
};
