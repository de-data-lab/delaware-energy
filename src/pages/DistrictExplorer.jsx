import { useState, Children, Component, useEffect } from "react";
import Select, { components } from "react-select";
import mapInfo from "../utils/mapInfo";
import "./DistrictExplorer.css";
import { DropdownCollapse } from "../components/DropdownCollapse";
import ExploreDistrict from "./ExploreDistrict";
import { csv } from "d3";
import CompareDistrict from "./CompareDistrict";
import senateData from "../data/aggregated_with_geo_new.json";

export const DistrictExplorer = ({}) => {
  // Dropdowns
  const [fundingSource, setFundingSource] = useState("LIHTC");
  // Dropdown for variable
  const [variable, setVariable] = useState("# of Tax Credit Units");
  // year
  const [year, setYear] = useState("2022");
  // Button for switching page views (compare vs explore)
  const [checked, setChecked] = useState(false);
  // State for switching between senate and house data
  const [boundary, setBoundary] = useState(false);

  const senateChartData = "/long_tax_data.csv";
  const houseChartData = "/long_tax_data_reps.csv";
  // list of reps
  const representativeList = "/representative-list.csv";

  let chartData = boundary ? houseChartData : senateChartData;

  // Dropdown for district
  const [district, setDistrict] = useState([]);
  const [exploreDistrict, setExploreDistrict] = useState({});
  useEffect(() => {
    boundary
      ? (setDistrict([
          { value: 1, label: "District 1 - Nnamdi O. Chukwuocha" },
          { value: 2, label: "District 2 - Stephanie T. Bolden" },
          { value: 3, label: "District 3 - Sherry Dorsey Walker" },
        ]),
        setExploreDistrict({
          value: 1,
          label: "District 1 - Nnamdi O. Chukwuocha",
        })
        )
      : (setDistrict([
          { value: 1, label: "District 1 - Sarah Mcbride" },
          { value: 2, label: "District 2 - Darius J. Brown" },
          { value: 3, label: "District 3 - Elizabeth Lockman" },
        ]),
        setExploreDistrict({
          value: 1,
          label: "District 1 - Sarah Mcbride",
        }));
  }, [boundary]);

  

  // button to close menu
  const [collapseButton, setCollapseButton] = useState(false);

  const collapseMenu = () => {
    setCollapseButton(!collapseButton);
  };

  // Handle change of select dropdowns
  const handleChange = (selectedOption) => {
    setVariable(selectedOption.value);
  };
  // handle district dropdown of compare districts (multi)
  const handleDistrictChange = (e) => {
    setDistrict(e);
  };
  // handle district dropdown of explore districts (single)
  const handleExploreDistrictChange = (e) => {
    setExploreDistrict(e);
  };
  const handleYearChange = (e) => {
    setYear(e.value);
  };

  const [districtList, setDistrictList] = useState([]);
  // List of districts and senators
  useEffect(() => {
    if (boundary === false) {
      let senateList = senateData.features.map((feature) => ({
        name: `District ${feature.properties.district}`,
        number: feature.properties.district,
        legislator: feature.properties.name,
      }));
      senateList = [
        ...new Map(senateList.map((item) => [item.number, item])).values(),
      ];
      senateList.sort((a, b) => a.number - b.number);
      setDistrictList(senateList);
    } else {
      // List of districts and reps
      csv(representativeList).then((result) => {
        const houseList = result.map((item) => ({
          name: `District ${item.District}`,
          number: Number(item.District),
          legislator: item.Name,
        }));
        setDistrictList(houseList);
      });
    }
  }, [boundary]);

  // React multi select options
  let districtOptions = [];
  districtOptions = districtList.map((item) => ({
    value: item.number,
    label: `${item.name} - ${item.legislator}`,
  }));

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

  const fundingOptions = Object.keys(mapInfo).map((item) => ({
    value: item,
    label: mapInfo[item].meta.displayName,
  }));

  const allYearOptions = Object.keys(mapInfo[fundingSource].years).map(
    (item) => ({
      value: mapInfo[fundingSource].years[item],
      label: mapInfo[fundingSource].years[item],
    })
  );
  const yearOptions = allYearOptions.filter(
    (item) => item.value !== "Sum over all years"
  );

  // Default values for Explore your District dropdowns
  const defaultDistrict = districtOptions.find(
    (option) => option.value === exploreDistrict.value
  );
  const defaultYear = yearOptions.find((option) => option.value === year);
  // Default values for compare districts dropdowns
  const defaultVariable = variableOptions.find(
    (option) => option.value === variable
  );

  return (
    <div className="main-container">
      <div
        className={
          "interaction-container " + (collapseButton ? "container-close" : "")
        }
      >
        <ButtonContainer
          boundary={boundary}
          setBoundary={setBoundary}
          checked={checked}
          setChecked={setChecked}
        />
        {checked === true ? (
          <ExploreDistrictButtons
            districtOptions={districtOptions}
            yearOptions={yearOptions}
            handleExploreDistrictChange={handleExploreDistrictChange}
            handleYearChange={handleYearChange}
            defaultYear={defaultYear}
            exploreDistrict={exploreDistrict}
          />
        ) : (
          <CompareDistrictButtons
            variableOptions={variableOptions}
            fundingOptions={fundingOptions}
            districtOptions={districtOptions}
            handleDistrictChange={handleDistrictChange}
            handleChange={handleChange}
            district={district}
            defaultVariable={defaultVariable}
            boundary={boundary}
          />
        )}
      </div>
      <DropdownCollapse
        className={"toggle-button"}
        button={collapseButton}
        toggleButton={collapseMenu}
        openClass={"collapse-button-open"}
        closeClass={"collapse-button-close"}
      />
      <div
        className={
          "chart-container " + (collapseButton ? "container-margin" : "")
        }
      >
        {checked === true ? (
          // Explore District
          <ExploreDistrict
            chartData={chartData}
            collapseButton={collapseButton}
            filterColumn={"district"}
            fundingSource={fundingSource}
            year={year}
            exploreDistrict={exploreDistrict}
            boundary={boundary}
            checked={checked}
          />
        ) : (
          <CompareDistrict
            chartData={chartData}
            title={mapInfo[fundingSource].columns[variable]}
            subtitle={mapInfo[fundingSource].meta.title}
            xAxis={"district"}
            yAxis={"value"}
            series={"Tax Allocation Year"}
            filterColumn={"variable"}
            filterValue={variable}
            districtFilterValue={district}
            reference={"District Average"}
            boundary={boundary}
            checked={checked}
          />
        )}
      </div>
    </div>
  );
};

// handles boundary change and page change buttons
const ButtonContainer = ({ checked, setChecked, boundary, setBoundary }) => {
  // Dropdown for senate or state of reps boundary
  const handleBoundaryChange = (e) => {
    setBoundary(!boundary);
  };

  // Handle change of select dropdowns
  const handlePageChange = () => {
    setChecked(!checked);
  };

  return (
    <>
      {/* <div className="button-container">
        <div className="select-spacing">
          <h2 className="heading">District Explorer</h2>
        </div>
      </div> */}

      <div className="button-container">
        <div className="select-spacing">
          <label
            className="toggleSwitch"
            id="page-toggle"
            aria-checked={checked}
          >
            <input
              type="checkbox"
              role="checkbox"
              checked={checked}
              onChange={handlePageChange}
              aria-checked={checked}
              aria-labelledby="page-toggle"
            />
            <a></a>
            <span>
              <span className="left-span">Compare Districts</span>
              <span className="right-span">Explore a District</span>
            </span>
          </label>
        </div>
        <div className="select-spacing">
          <label
            className="toggleSwitch"
            id="boundary-toggle"
            aria-checked={boundary}
          >
            <input
              type="checkbox"
              role="checkbox"
              checked={boundary}
              onChange={handleBoundaryChange}
              aria-checked={boundary}
              aria-labelledby="boundary-toggle"
            />
            <a></a>
            <span>
              <span className="left-span">State Senate</span>
              <span className="right-span">House of Representatives</span>
            </span>
          </label>
        </div>
      </div>
    </>
  );
};

const ExploreDistrictButtons = ({
  districtOptions,
  handleExploreDistrictChange,
  handleYearChange,
  yearOptions,
  exploreDistrict,
  defaultYear,
}) => {
  
  return (
    <>
      <div className="options-container">
        <div className="select-explorer select-spacing">
          <label className="label-text" htmlFor="district">
            Select district to explore:
          </label>
          <Select
            id="district"
            onChange={(e) => handleExploreDistrictChange(e)}
            className="basic-single react-select"
            classNamePrefix="select"
            isSearchable={true}
            isRtl={false}
            name="districts"
            options={districtOptions}
            value={exploreDistrict}
            /* makes sure react-select dropdowns are in front (z-index) */
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
        <div className="select-explorer select-spacing">
          <label className="label-text" htmlFor="year">
            Select a year:
          </label>
          <Select
            id="year"
            onChange={(e) => handleYearChange(e)}
            className="basic-single react-select"
            classNamePrefix="select"
            isSearchable={true}
            isRtl={false}
            name="year"
            options={yearOptions}
            defaultValue={defaultYear}
            /* makes sure react-select dropdowns are in front (z-index) */
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
      </div>
    </>
  );
};

const ValueContainer = ({ children, getValue, ...props }) => {
  var values = getValue();
  var valueLabel = "";

  // if more than one value selected, add "& x more" to end of value
  if (values.length > 0)
    valueLabel += props.selectProps.getOptionLabel(values[0]);
  if (values.length > 1) valueLabel += ` & ${values.length - 1} more...`;

  // Keep standard placeholder and input from react-select
  var childsToRender = Children.toArray(children).filter(
    (child) =>
      ["Input", "DummyInput", "Placeholder"].indexOf(child.type.name) >= 0
  );

  return (
    <components.ValueContainer {...props}>
      {!props.selectProps.inputValue && valueLabel}
      {childsToRender}
    </components.ValueContainer>
  );
};

const CompareDistrictButtons = ({
  variableOptions,
  handleChange,
  handleDistrictChange,
  districtOptions,
  district,
  defaultVariable,
}) => {

  return (
    <>
      <div className="options-container">
        <div className="select-explorer select-spacing">
          <label className="label-text">Select districts to compare:</label>
          <Select
            tabIndex={0}
            onChange={(e) => handleDistrictChange(e)}
            options={districtOptions}
            id="districts"
            name="districts"
            className="basic-multi-select react-select"
            classNamePrefix="select"
            isSearchable={true}
            value={district}
            isMulti
            // controlShouldRenderValue={false}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{
              ValueContainer,
            }}
            /* makes sure react-select dropdowns are in front (z-index) */
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
        <div className="select-explorer select-spacing">
          <label className="label-text" htmlFor="variable">
            Select a variable:
          </label>
          <Select
            id="variable"
            onChange={handleChange}
            className="basic-single"
            classNamePrefix="select"
            isSearchable={true}
            isRtl={false}
            name="variable"
            options={variableOptions}
            defaultValue={defaultVariable}
            /* makes sure react-select dropdowns are in front (z-index) */
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
      </div>
    </>
  );
};
