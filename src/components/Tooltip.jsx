import mapInfo from "../utils/mapInfo";
import "./Tooltip.css";

export const Tooltip = ({ feature, variable, fundingSource }) => {
  if (fundingSource && variable && feature) {
    const variableName = mapInfo[fundingSource].columns[variable];
    let variableValue = feature?.properties?.[variable];
    // Check if variable value is null and set to 0, otherwise make sure its a number
    (variableValue == null) ? (variableValue = 0) : (variableValue = parseFloat(variableValue));

    switch (variable) {
      case "ALLOCATION AMOUNT":
      case "Average Allocation per Tax Credit Unit":
      case "Average Allocation per 100 Persons":
        variableValue = `$${variableValue.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}`;
        break;
      default:
        variableValue = `${variableValue.toLocaleString(undefined, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}`;
        break;
    }

    const senatorName = feature?.properties?.["name"];
    const districtName = feature?.properties?.["district"];
    const population = feature?.properties?.["adj_popula"];

    return (
      <>
        <h3 className="tooltip-text">
          <strong className="tooltip-spacing">Senator:</strong>
          {senatorName}
        </h3>
        <h3 className="tooltip-text">
          <strong className="tooltip-spacing">District:</strong>
          {districtName}
        </h3>
        <h3 className="tooltip-text">
          <strong className="tooltip-spacing">{variableName}:</strong>
          {variableValue}
        </h3>
      </>
    );
  }
};
