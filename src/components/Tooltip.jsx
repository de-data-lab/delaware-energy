import "./Tooltip.css";
import { withCommas } from '../utils/formatters';

function Tooltip({ feature, point, variable, boundary, pointSource }) {
  let legislatorName = feature?.properties?.["Name"];
  let granteeName;
  let districtName = feature?.properties?.["District"];

  let variableName;
  let variableValue;

  if (variable && feature) {
    variableName = variable;
    variableValue = feature?.properties?.[variable];
  }

  function generateFillTooltipContent(variable) {
    if (variable === "Total Population") {
      return (
        <>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">{variableName}:</strong>
            {withCommas(variableValue)}
          </h3>
        </>
      );
    }
    if (variable === "Solar Households per 1000") {
      return (
        <>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">{variableName + " Households"}:</strong>
            {withCommas(variableValue)}
          </h3>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">
              Owner Occupied Households:
            </strong>
            {withCommas(feature.properties["Owner Occupied Households"])}
          </h3>
        </>
      );
    }
    if (variable === "Value of EEIF Grants Awarded") {
      return (
        <>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">{variableName}:</strong>$
            {withCommas(variableValue)}
          </h3>
          {feature.properties["EEIF Electricity Savings (kWh/yr)"] > 0 && (
            <h3 className="tooltip-text">
              <strong className="tooltip-spacing">Electricity Savings:</strong>
              {withCommas(feature.properties["EEIF Electricity Savings (kWh/yr)"])} kWh/yr
            </h3>
          )}
          {feature.properties["Natural Gas Savings (kBtus/yr)"] > 0 && (
            <h3 className="tooltip-text">
              <strong className="tooltip-spacing">Natural gas savings:</strong>
              {withCommas(feature.properties["EEIF Natural Gas Savings (kBtus/yr)"])}{" "}
              Btus/yr
            </h3>
          )}
          {feature.properties[
            "EEIF Greenhouse Gas Emission Reduction (MtCO2e)"
          ] > 0 && (
            <h3 className="tooltip-text">
              <strong className="tooltip-spacing">
                Greenhouse Gas Emission Reduction:
              </strong>
              {
                withCommas(feature.properties[
                  "EEIF Greenhouse Gas Emission Reduction (MtCO2e)"
                ])
              }{" "}
              MtCO2e/yr
            </h3>
          )}
        </>
      );
    }
  }

  return (
    <>
      {point === true ? (
        <>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">Name of Grantee:</strong>
            {feature.properties["Name"]}
          </h3>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">Amount Awarded:</strong>$
            {withCommas(feature.properties["Award ($)"])}
          </h3>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">
              Percentage of Cost Covered by Grant:
            </strong>
            {feature.properties["% of cost"]}%
          </h3>
          {feature.properties["Electricity Savings (kWh/yr)"] && (
            <h3 className="tooltip-text">
              <strong className="tooltip-spacing">Electricity Savings:</strong>
              {withCommas(feature.properties["Electricity Savings (kWh/yr)"])} kWh/yr
            </h3>
          )}
          {feature.properties["Natural Gas Savings (kBtus/yr)"] && (
            <h3 className="tooltip-text">
              <strong className="tooltip-spacing">Natural gas savings:</strong>
              {withCommas(feature.properties["Natural Gas Savings (kBtus/yr)"])} Btus/yr
            </h3>
          )}
          {feature.properties["Greenhouse Gas Emission Reduction (MtCO2e)"] && (
            <h3 className="tooltip-text">
              <strong className="tooltip-spacing">
                Greenhouse Gas Emission Reduction:
              </strong>
              {withCommas(feature.properties["Greenhouse Gas Emission Reduction (MtCO2e)"])}{" "}
              MtCO2e/yr
            </h3>
          )}
        </>
      ) : (
        <>
          <h3 className="tooltip-text tooltip-title">
            <strong className="tooltip-spacing">
              District {districtName}{" "}
            </strong>
          </h3>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">
              {boundary === "senate" ? "Senator:" : "Representative:"}
            </strong>
            {legislatorName}
          </h3>
          {generateFillTooltipContent(variable)}
        </>
      )}
    </>
  );
}
export default Tooltip;
