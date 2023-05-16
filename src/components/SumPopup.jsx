import { useEffect, useState } from "react";
// import Draggable from "react-draggable";

import mapInfo from "../utils/mapInfo";
import "./PointInfo.css";
import "./SumPopup.css";

export const PopupText = ({ fundingSource, variable, array, mapData }) => {
  const [variableName, setVariableName] = useState(null);
  //   after summing
  const [sumValue, setSumValue] = useState({
    sumValue: null,
    sumPercent: null,
  });
  const [featureProps, setFeatureProps] = useState([
    { districtName: null, value: null },
  ]);

  // takes all variable values and sums them up
  const totalVariable = mapData.features.map(district => !district.properties[variable] ? 0 : Number(district.properties[variable])).reduce((a, b) => a + b);

  useEffect(() => {
    let tempArray = array.map((item) => ({
      districtName: item.properties["district"],
      value: !item.properties[variable] ? 0 : Number(item.properties[variable]),
    }));

    let variableArray = tempArray.map((item) => item.value);

    setFeatureProps(tempArray);
    setVariableName(mapInfo[fundingSource].columns[variable]);

    let sum = variableArray.reduce((a, b) => a + b, 0);

    const moneyFormatter = (maxDeci, minDeci) => {
      setFeatureProps(
        tempArray.map((item) => ({
          districtName: item.districtName,
          value: `$${item.value.toLocaleString(undefined, {
            maximumFractionDigits: maxDeci,
            minimumFractionDigits: minDeci,
          })}`,
        }))
      );
    };

    const wholeNumberFormatter = (maxDeci, minDeci) => {
      setFeatureProps(
        tempArray.map((item) => ({
          districtName: item.districtName,
          value: `${item.value.toLocaleString(undefined, {
            maximumFractionDigits: maxDeci,
            minimumFractionDigits: minDeci,
          })}`,
        }))
      );
    };


    switch (variable) {
      case "# of Tax Credit Units":
        setSumValue({
          sumValue: `${sum} units`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
      // 2210 total units in DE

      case "ALLOCATION AMOUNT":
        moneyFormatter(0, 0);

        setSumValue({
          sumValue: `$${sum.toLocaleString(undefined, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
      // 28016290 total allocation amount in DE

      case "Average Allocation per Tax Credit Unit":
        moneyFormatter(2, 2);

        setSumValue({
          sumValue: `$${sum.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
      // 213679.7769 total avg allocation pet tax credit

      case "Average Allocation per 100 Persons":
        moneyFormatter(2, 2);

        setSumValue({
          sumValue: `$${sum.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
        // total avg allocation per 100 =  60340.24

      case "Average Population per Tax Credit Unit":
        
        wholeNumberFormatter(0, 0)

        setSumValue({
          sumValue: `${sum.toLocaleString(undefined, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
        // avg pop per tax credit unit = 10632

      
        case "adj_popula":
        
        wholeNumberFormatter(0, 0)

        setSumValue({
          sumValue: `${sum.toLocaleString(undefined, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
        // total pop 989598


      default:
        break;
    }
  }, [array]);

  return (
    <div className="content-container">
      <table className="sumPopup-table">
        <thead>
          <tr className="label-text">
            <th className="table-head">District</th>
            <th className="table-head">{variableName}</th>
          </tr>
        </thead>
        <tbody>
          {featureProps.map((item, i) => (
          <tr>
            <td className="district-number">
                <h2 key={i} className="info-text">
                  District {item.districtName}
                </h2>
            </td>
            <td className="table-data">
                <h3 key={item.districtName} className="info-text">
                  {item.value}
                </h3>
            </td>
          </tr>
          ))}
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
  mapData
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
          mapData={mapData}
        />
        <button className="button" onClick={clearSelection}>
          <i className="fa-solid fa-trash"></i>
          <h3 className="button-text">Clear Selection</h3>
        </button>
      </div>
    </div>
  );
};
