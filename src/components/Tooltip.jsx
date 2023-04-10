import mapInfo from "../utils/mapInfo";
import "./PointInfo.css"


export const Tooltip = ({feature, variable, fundingSource}) => {

    if (fundingSource && variable && feature) {
        const variableName = mapInfo[fundingSource].columns[variable]; 
        let variableValue = feature?.properties?.[variable];
        (variableValue == null ) ? (variableValue = 0) : (variableValue)
        
        switch (variable) {
            case "aggregated_allocation_amount":
            case "avg_allocation_per_unit":
            case "avg_allocation_per_100_persons":
                variableValue = `$${variableValue.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 0})}`
                break;
            default:
                variableValue = `${variableValue.toLocaleString(undefined, {maximumFractionDigits: 0, minimumFractionDigits: 0})}`
                break;
        }
        

        const senatorName = feature?.properties?.["name"];
        const districtName = feature?.properties?.["district"];
        const population = feature?.properties?.["adj_popula"];
    
    return (
            <>
                {/* <div className="content-container"> */}
                    <label>Senator:</label>
                    <h3 className="info-text">{senatorName}</h3>        
                    <label>District:</label>
                    <h3 className="info-text">{districtName}</h3>        
                    <label>{variableName}:</label>
                    <h3 className="info-text">{variableValue}</h3> 
                {/* </div> */}
            </>
    )
    }
 
};