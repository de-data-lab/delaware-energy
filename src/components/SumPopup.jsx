import { useEffect, useState } from "react";
import "./SumPopup.css";

function PopupText({ variable, year, featureArray, source }) {
  /* Variable One */
  const [variableName, setVariableName] = useState(null);
  const [sumValue, setSumValue] = useState({
    sumValue: null,
    sumPercent: null,
  });
  const [featureProps, setFeatureProps] = useState([
    {
      districtName: null,
      value: null,
      value2: null,
    },
  ]);
  /* variable Two */
  const [variableName2, setVariableName2] = useState(
    "EEIF Electricity Savings (kWh/yr)"
  );
  const [sumValue2, setSumValue2] = useState({
    sumValue: null,
    sumPercent: null,
  });

  // takes all variable values and sums them up
  /* Variable One */
  const variableArray = source.data.features.map((district) =>
    !district.properties[variable] ? 0 : district.properties[variable]
  );
  const totalVariable =
    variableArray.length > 0 ? variableArray.reduce((a, b) => a + b) : "";

  /* variable Two */
  const variable2Array = source.data.features.map((district) =>
    !district.properties["EEIF Electricity Savings (kWh/yr)"]
      ? 0
      : district.properties["EEIF Electricity Savings (kWh/yr)"]
  );
  const totalVariable2 =
    variable2Array.length > 0 ? variable2Array.reduce((a, b) => a + b) : "";

  useEffect(() => {
    let tempArray = featureArray.map((item) => ({
      districtName: item.properties["District"],
      value: !item.properties[variable] ? 0 : item.properties[variable],
      value2: !item.properties["EEIF Electricity Savings (kWh/yr)"]
        ? 0
        : item.properties["EEIF Electricity Savings (kWh/yr)"],
    }));

    let variableArray = tempArray.map((item) => item.value);
    let variable2Array = tempArray.map((item) => item.value2);

    setFeatureProps(tempArray);
    setVariableName(variable);

    let sum = variableArray.reduce((a, b) => a + b, 0);
    let sum2 = variable2Array.reduce((a, b) => a + b, 0);

    setVariableName2("EEIF Electricity Savings (kWh/yr)");

    // Calculate sum and percentages for the new variable

    switch (variable) {
      case "Total Population":
        setSumValue({
          sumValue: `${sum}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
      case "Solar Households per 1000":
        setSumValue({
          sumValue: `${sum}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
      case "Solar Households per 1000":
        setSumValue({
          sumValue: `${sum}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
    }
    setSumValue2({
      sumValue: `${sum2}`,
      sumPercent: `${((sum2 / totalVariable2) * 100).toFixed(1)}%`,
    });
  }, [featureArray]);

  return (
    <>
      <table className="sumPopup-table">
        <thead>
          <tr className="table-headers">
            <th className="table-head">District</th>
            <th className="table-head">{variableName}</th>
            <th className="table-head">{variableName2}</th>
          </tr>
        </thead>
        <tbody>
          {featureProps.map((item, i) => (
            <tr key={i} className="sumPopup-row">
              <td className="district-number">
                <h2 className="info-text">District {item.districtName}</h2>
              </td>
              <td className="table-data">
                <h3 key={item.districtName} className="info-text">
                  {item.value}
                </h3>
              </td>
              <td className="table-data">
                <h3 key={item.districtName} className="info-text">
                  {item.value2}
                </h3>
              </td>
            </tr>
          ))}
          <tr className="sumPopup-row">
            <td className="total-label">Total</td>
            <td className="total">{sumValue.sumValue}</td>
            <td className="total">{sumValue2.sumValue}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="sumPopup-message">
        <strong>{sumValue.sumPercent}</strong> of{" "}
        <strong>{variableName}</strong> in <strong>{year}</strong>
      </h3>
      <h3 className="sumPopup-message">
        <strong>{sumValue2.sumPercent}</strong> of{" "}
        <strong>{variableName2}</strong> in <strong>{year}</strong>
      </h3>
    </>
  );
}

function SumPopup({ variable, year, featureArray, clearSelection, source }) {
  return (
    <div tabIndex={0} className="popup-container">
      <div className="sumPopup-button-container">
        <PopupText
          variable={variable}
          year={year}
          featureArray={featureArray}
          source={source}
        />
        <button className="button" onClick={clearSelection}>
          <i className="fa-solid fa-trash"></i>
          <h3 className="button-text">Clear Selection</h3>
        </button>
      </div>
    </div>
  );
}

export default SumPopup;
