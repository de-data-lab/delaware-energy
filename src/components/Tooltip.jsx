import mapInfo from "../utils/mapInfo";
import "./Tooltip.css";

export const Tooltip = ({ feature, variable, fundingSource }) => {
  if (fundingSource && variable && feature) {
    const variableName = mapInfo[fundingSource].columns[variable];
    let variableValue = feature?.properties?.[variable];
    variableValue == null ? (variableValue = 0) : variableValue;

    switch (variable) {
      case "aggregated_allocation_amount":
        variableValue = `$${variableValue.toLocaleString(undefined, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}`;
        break;
      case "avg_allocation_per_unit":
      case "avg_allocation_per_100_persons":
        variableValue = `$${variableValue.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
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
