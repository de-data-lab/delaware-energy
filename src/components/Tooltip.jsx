import "./Tooltip.css"
function Tooltip({ feature, point, variable, boundary, pointSource }) {
  let legislatorName;
  let granteeName;
  let districtName = feature?.properties?.["District"];

  let variableName;
  let variableValue;

  if (variable && feature) {
    variableName = variable;
    variableValue = feature?.properties?.[variable];
  }

  return (
    <>
      {point === true ? (
        <>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">Name of Grantee:</strong>
            {feature.properties["Name of Grantee"]}
          </h3>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">Amount Awarded:</strong>$
            {feature.properties["Award ($)"]}
          </h3>
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">
              Percentage of Cost Covered by Grant:
            </strong>
            {feature.properties["% of cost"]}%
          </h3>
        </>
      ) : (
        <>
          <h3 className="tooltip-text tooltip-title">
            <strong className="tooltip-spacing">District {districtName} </strong>
          </h3>
          {/* <h3 className="tooltip-text">
            <strong className="tooltip-spacing">
              {boundary === "senate" ? "Senator:" : "Representative:"}
            </strong>
            {legislatorName}
          </h3> */}
          <h3 className="tooltip-text">
            <strong className="tooltip-spacing">{variableName}:</strong>
            {variableValue}
          </h3>
        </>
      )}
    </>
  );
}
export default Tooltip