import { useEffect, useState, Children } from "react";
import Select, { components } from "react-select";
import { allHouseData } from "../data/DSHA_SLDL_all_years/SLDL_data_objects";
import { allSenateData } from "../data/DSHA_SLDU_all_years/SLDU_data_objects";
import {
  generateDistrictData,
  generateStateAverage,
} from "../utils/graphUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import DropdownCollapse from "../components/DropdownCollapse";
import "./GraphContainer.css";

function GraphContainer() {
  const [variable, setVariable] = useState("Total Population");
  const [boundary, setBoundary] = useState("senate");
  const [districtList, setDistrictList] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const boundaryOptions = [
    { value: "senate", label: "Senate Districts" },
    { value: "house", label: "House of Representative Districts" },
  ];

  function handleBoundaryChange(e) {
    setBoundary(e.value);
  }

  useEffect(() => {
    if (boundary === "senate") {
      let senateList = allSenateData[0].data.features.map((feature) => ({
        name: `District ${feature.properties["District"]}`,
        number: feature.properties["District"],
        legislator: feature.properties["Name"],
      }));
      setDistrictList(senateList);
      setSelectedDistricts([]);
    }
    if (boundary === "house") {
      let houseList = allHouseData[0].data.features.map((feature) => ({
        name: `District ${feature.properties["District"]}`,
        number: feature.properties["District"],
        legislator: feature.properties["Name"],
      }));
      setDistrictList(houseList);
      setSelectedDistricts([]);
    }
  }, [boundary]);

  let districtOptions = [];
  districtOptions = districtList.map((item) => ({
    value: item.number,
    label: `${item.name} - ${item.legislator}`,
  }));

  const handleDistrictChange = (e) => {
    setSelectedDistricts(e);
  };

  function extractKeys(dataObject) {
    const uniqueKeys = new Set();

    dataObject.data.features.forEach((feature) => {
      const properties = feature.properties;

      Object.keys(properties).forEach((key) => {
        if (
          key !== "District" &&
          key !== "Name" &&
          key !== "Solar Households" &&
          key !== "Owner Occupied Households" &&
          key !== "EEIF Electricity Savings (kWh/yr)" &&
          key !== "EEIF Natural Gas Savings (kBtus/yr)" &&
          key !== "EEIF Greenhouse Gas Emission Reduction (MtCO2e)"
        ) {
          uniqueKeys.add(key);
        }
      });
    });

    return Array.from(uniqueKeys);
  }
  const variableOptions = extractKeys(allHouseData[0]).map((option) => ({
    value: option,
    label:
      option === "Solar Households per 1000"
        ? "Solar Households per 1000 Households"
        : option,
  }));

  function handleVariableChange(e) {
    setVariable(e.value);
  }

  useEffect(() => {
    const allDataObj = boundary === "senate" ? allSenateData : allHouseData;
    const averageData = generateStateAverage(allDataObj, variable);
    console.log(selectedDistricts);
    let selectedDistrictData = [];
    if (selectedDistricts.length > 0) {
      for (let district of selectedDistricts) {
        console.log(district);
        selectedDistrictData.push(
          generateDistrictData(allDataObj, variable, district.value)
        );
      }
    }
    selectedDistrictData.push(averageData);
    console.log(selectedDistrictData);

    setGraphData(selectedDistrictData);
  }, [boundary, selectedDistricts, variable]);

  const [collapseButton, setCollapseButton] = useState(false);

  // const collapseMenu = () => {
  //   setCollapseButton(!collapseButton);
  // };

  const ValueContainer = ({ children, getValue, ...props }) => {
    var values = getValue();
    var valueLabel = "";

    // if more than one value selected, add "& x more" to end of value
    if (values.length > 0) {
      valueLabel += props.selectProps.getOptionLabel(values[0]);
      if (values.length > 1) {
        valueLabel += ` & ${values.length - 1} more...`;
      }
    } else {
      valueLabel += "Select Districts";
    }
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
  return (
    <div className="main-container">
      <div className={"interaction-container "}>
        <div className="label-container">
          <label className="label-text" htmlFor="boundary">
            Select a Boundary:
          </label>
          <Select
            id="boundary"
            className="graph-option boundary-select"
            tabIndex={0}
            defaultValue={boundaryOptions[0]}
            onChange={(e) => handleBoundaryChange(e)}
            label="Single select"
            isRtl={false}
            isSearchable={false}
            options={boundaryOptions}
          />
        </div>
        <div className="label-container">
          <label className="label-text" htmlFor="districts">
            Select Districts:
          </label>
          <Select
            id="districts"
            className="graph-option basic-multi-select react-select"
            tabIndex={0}
            onChange={(e) => handleDistrictChange(e)}
            label="Multiple select"
            isRtl={false}
            isSearchable={true}
            options={districtOptions}
            isMulti
            components={{ ValueContainer }}
            value={selectedDistricts}
            classNamePrefix="select"
          />
        </div>
        <div className="label-container">
          <label className="label-text" htmlFor="variable">
            Select an Outcome:
          </label>
          <Select
            id="variable"
            className="variable-select graph-option"
            defaultValue={variableOptions[0]}
            onChange={(e) => handleVariableChange(e)}
            options={variableOptions}
            isSearchable={true}
            isRtl={false}
          />
        </div>
      </div>
      <div className="button-container">
        <div className="select-spacing">
          <h2 className="heading">Compare Districts</h2>
          <h3 className="sub-heading">
            {boundary === "house" ? "House of Representatives" : "State Senate"}
          </h3>
        </div>
      </div>
      <div className="graph-div">
        <div className="chart-title-block">
          <h2 className="chart-title">{variable}</h2>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            maxBarSize={250}
            data={graphData}
            margin={{ top: 20, left: 40, bottom: 30, right: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis>
              <Label
                value={variable}
                angle="-90"
                position="insideLeft"
                offset="-20"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey="2016" stackId="a" fill="#d7191c" />
            <Bar dataKey="2018" stackId="a" fill="#fdae61" />
            <Bar dataKey="2019" stackId="a" fill="green" />
            <Bar dataKey="2020" stackId="a" fill="#abd9e9" />
            <Bar dataKey="2021" stackId="a" fill="#2c7bb6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default GraphContainer;
