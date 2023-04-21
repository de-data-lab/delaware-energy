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

  useEffect(() => {
    // Array of variable amounts
    let variableArray = array.map((item) =>
      !item.properties[variable] ? 0 : Number(item.properties[variable])
    );
    let districtArray = array.map((item) => item.properties["district"]);

    setVariableName(mapInfo[fundingSource].columns[variable]);
    setFeatureProps({ districtName: districtArray, sumValues: variableArray });

    let sum = variableArray.reduce((a, b) => a + b, 0);

    switch (variable) {
      case "aggregated_tax_credits":
        setSumValue({
          sumValue: `${sum} units`,
          sumPercent: `${((sum / 2210) * 100).toFixed(2)}%`,
        });
        break;
      // 2210 total units in DE

      case "aggregated_allocation_amount":
        setSumValue({
          sumValue: `$${sum.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}`,
          sumPercent: `${((sum / 28016290) * 100).toFixed(1)}%`,
        });
        break;
      // 28016290 total allocation amount in DE

      case "avg_allocation_per_unit":
        setFeatureProps({
          sumValues: variableArray.map(
            (item) =>
              `$${item.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}`
          ),
          districtName: districtArray,
        });

        setSumValue({
          sumValue: `$${sum.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}`,
          sumPercent: `${((sum / 213679.7769) * 100).toFixed(2)}%`,
        });
        break;
      // 28016290 total avg allocation amount in DE

      case "avg_allocation_per_100_persons":
        setFeatureProps({
          sumValues: variableArray.map(
            (item) =>
              `$${item.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}`
          ),
          districtName: districtArray,
        });

        setSumValue({
          sumValue: `$${sum.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}`,
          sumPercent: `${((sum / 60340.24) * 100).toFixed(1)}%`,
        });
        break;

      case "avg_population_per_tax_credit":
        setFeatureProps({
          sumValues: variableArray.map(
            (item) =>
              `${item.toLocaleString(undefined, {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })}`
          ),
          districtName: districtArray,
        });

        setSumValue({
          sumValue: `${sum.toLocaleString(undefined, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })}`,
          sumPercent: `${((sum / 10632) * 100).toFixed(1)}%`,
        });
        break;

      default:
        break;
    }
  }, [array]);

  return (
    <div className="content-container">
      <table>
        <thead>
          <tr className="label-text">
            <th>District</th>
            <th>{variableName}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="district-number">
              {featureProps.districtName.map((item, i) => (
                <h2 key={i} className="info-text">
                  District {item}
                </h2>
              ))}
            </td>
            <td className="table-data">
              {variable ===
              ("aggregated_allocation_amount" || "avg_allocation_per_unit")
                ? featureProps.sumValues.map((item, i) => (
                    <h3 key={i} className="info-text">
                      $
                      {item.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0,
                      })}
                    </h3>
                  ))
                : featureProps.sumValues.map((item, i) => (
                    <h3 key={i} className="info-text">
                      {item.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0,
                      })}
                    </h3>
                  ))}
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="total">
              <strong>{sumValue.sumValue}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <br></br>
      <h3 className="info-text">
        <strong>{sumValue.sumPercent}</strong> of {variableName}
      </h3>
    </div>
  );
};

export const SumPopup = ({
  fundingSource,
  variable,
  array,
  clearSelection,
}) => {
  return (
    <div tabIndex={0} className="popup-container">
      <div className="sumPopup-button-container">
        {/* <h2 className="dropdown-header">
            Selected Districts
        </h2> */}
        <PopupText
          fundingSource={fundingSource}
          variable={variable}
          array={array}
        />
        <button className="button" onClick={clearSelection}>
          <i className="fa-solid fa-trash"></i>
          <h3 className="button-text">Clear Selection</h3>
        </button>
      </div>
    </div>
  );
};
