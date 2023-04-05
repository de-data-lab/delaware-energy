import { useEffect, useState } from "react";
// import Draggable from "react-draggable";

import mapInfo from "../utils/mapInfo";
import "./PointInfo.css";

export const PopupText = ({ fundingSource, variable, array }) => {
  const [variableName, setVariableName] = useState(null);
  //   after summing
  const [sumValue, setSumValue] = useState({
    sumValue: null,
    sumPercent: null,
  });
  const [featureProps, setFeatureProps] = useState({
    districtName: [],
    sumValues: [],
  });

  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    // Array of variable amounts
    let variableArray = array.map((item) =>
      !item.properties[variable] ? 0 : Number(item.properties[variable])
    );
    let districtArray = array.map((item) => item.properties["district"]);

    setVariableName(mapInfo[fundingSource].columns[variable]);
    // Set sum values to be object with two arrays one for values other for allocation values
    setFeatureProps({ districtName: districtArray, sumValues: variableArray });

    let sum = variableArray.reduce((a, b) => a + b, 0);

    if (variable === "aggregated_tax_credits") {
      setSumValue({
        sumValue: `${sum} units`,
        sumPercent: `${((sum / 2210) * 100).toFixed(2)}%`,
      });
      // 2210 total units in DE
    }
    if (variable === "aggregated_allocation_amount") {
      setSumValue({
        sumValue: `$${sum.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 0})}`,
        sumPercent: `${((sum / 28016290) * 100).toFixed(2)}%`,
      });
      // 28016290 total allocation amount in DE
    }
    // if (variable === "aggregated_allocation_amount_percent") {
    //   setFeatureProps({sumValues: variableArray.map(item => `${(item * 100).toFixed(2)}%`), districtName: districtArray})

    //   setSumValue({
    //     sumValue: `${(sum * 100).toFixed(2)}%`,
    //     sumPercent: `${(sum * 100).toFixed(2)}%`,
    //   });
    //   // 28016290 total allocation amount in DE
    // }
    if (variable === "avg_allocation_per_unit") {
      setFeatureProps({sumValues: variableArray.map(item => `$${item.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 0})}`), districtName: districtArray})
      
      setSumValue({
        sumValue: `$${sum.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 0})}`,
        sumPercent: `${((sum / 213679.7769) * 100).toFixed(2)}%`,
      });
      // 28016290 total allocation amount in DE
    }
  }, [array]);

  return (
    <div className="content-container">
      <table>
        <thead>
          <tr>
            <th>District</th>
            <th>{variableName}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {featureProps.districtName.map((item, i) => (
                <h3 key={i}>District {item}</h3>
              ))}
            </td>
            <td className="table-data">
              {(variable === ("aggregated_allocation_amount" ||
              "avg_allocation_per_unit"))
                ? (featureProps.sumValues.map((item, i) => (
                    <h3 key={i}>${item.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 0})}</h3>
                  )))
                : (featureProps.sumValues.map((item, i) => (
                    <h3 key={i}>{item.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 0})}</h3>
                  )))
              }
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="total">{sumValue.sumValue}</td>
          </tr>
        </tbody>
      </table>
      <br></br>
      <h3>
        {sumValue.sumPercent} of {variableName}
      </h3>
      <button onClick={reload} className="button">
        Clear Selection
      </button>
    </div>
  );
};

export const SumPopup = ({ fundingSource, variable, array }) => {
  return (
    <div tabIndex={0}>
      <PopupText
        fundingSource={fundingSource}
        variable={variable}
        array={array}
      />
    </div>
  );
};
