import mapInfo from "../utils/mapInfo";
import "./Tooltip.css";

export const Tooltip = ({
  feature,
  variable,
  fundingSource,
  boundary,
  point,
}) => {
  let propertyName;
  let legislatorName = feature?.properties?.["name"];
  let districtName = feature?.properties?.["district"];
  let taxCreditUnitsName;
  let taxCreditUnits;
  
  let variableName;
  let variableValue;

  if ((point === true) && fundingSource && boundary && feature) {
    const district = (boundary === "senate") ? ["Senate District"] : ["Representative District"];

    propertyName = feature?.properties?.["PROJECT NAME & ADDRESS"];
    districtName = feature?.properties?.[district];
    taxCreditUnitsName = mapInfo[fundingSource].columns["# of Tax Credit Units"];
    taxCreditUnits = feature?.properties?.["# of Tax Credit Units"];

  } else if (fundingSource && variable && feature) {
    variableName = mapInfo[fundingSource].columns[variable];
    variableValue = feature?.properties?.[variable];
    // Check if variable value is null and set to 0, otherwise make sure its a number
    variableValue == null
      ? (variableValue = 0)
      : (variableValue = parseFloat(variableValue));

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
  }



  return (
    <>
      {point === true ? (
        <>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">Property name:</strong>
            {propertyName}
          </h3>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">District:</strong>
            {districtName}
          </h3>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">{taxCreditUnitsName}:</strong>
            {taxCreditUnits}
          </h3>
        </>
      ) : (
        <>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">
              {boundary === "senate" ? "Senator:" : "Representative:"}
            </strong>
            {legislatorName}
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
      )}
    </>
  );
};
