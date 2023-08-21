import { useEffect, useState } from "react";
import "./SumPopup.css";

function PopupText({ variable, year, featureArray, source }) {
  const [variableName, setVariableName] = useState(null);
  const [sumValue, setSumValue] = useState({
    sumValue: null,
    sumPercent: null,
  });
  const [featureProps, setFeatureProps] = useState([
    {
      districtName: null,
      value: null,
    },
  ]);
  // takes all variable values and sums them up
  const variableArray = source.data.features.map((district) =>
    !district.properties[variable] ? 0 : district.properties[variable]
  );
  const totalVariable =
    variableArray.length > 0 ? variableArray.reduce((a, b) => a + b) : "";

  useEffect(() => {
    let tempArray = featureArray.map((item) => ({
      districtName: item.properties["District"],
      value: !item.properties[variable] ? 0 : item.properties[variable],
    }));

    let variableArray = tempArray.map((item) => item.value);

    setFeatureProps(tempArray);
    setVariableName(variable);

    let sum = variableArray.reduce((a, b) => a + b, 0);

    switch (variable) {
      case "Estimated Population":
        setSumValue({
          sumValue: `${sum}`,
          sumPercent: `${((sum / totalVariable) * 100).toFixed(1)}%`,
        });
        break;
    }
  }, [featureArray]);

  return (
    <>
      <table className="sumPopup-table">
        <thead>
          <tr className="table-headers">
            <th className="table-head">District</th>
            <th className="table-head">{variableName}</th>
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
            </tr>
          ))}
          <tr className="sumPopup-row">
            <td className="total-label">Total</td>
            <td className="total">{sumValue.sumValue}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="sumPopup-message">
        <strong>{sumValue.sumPercent}</strong> of{" "}
        <strong>{variableName}</strong> in{" "}
        <strong>{year}</strong>
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
