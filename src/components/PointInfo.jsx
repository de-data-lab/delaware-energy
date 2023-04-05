import mapInfo from "../utils/mapInfo";
import "./PointInfo.css"
import photo from "/images/harrington.png"


export const PointInfo = ({feature, variable, fundingSource}) => {


    if (fundingSource && variable && feature) {
        const variableName = mapInfo[fundingSource].columns[variable]; 
        let variableValue = feature?.properties?.[variable];
        if (variable === "aggregated_allocation_amount") {
            variableValue = (feature?.properties?.["ALLOCATION AMOUNT"]).toLocaleString("en-US");
        }
        if (variable === "aggregated_tax_credits") {
            variableValue = feature?.properties?.["# of Tax Credit Units"];
        }
        
    
        const projectName = feature?.properties?.["PROJECT NAME & ADDRESS"];
        const districtName = feature?.properties?.["Senate District"];
        const address = feature?.properties?.["address"];
        const developerFees = feature?.properties?.["Applicable Credit Rate"];
        const propertyType = feature?.properties?.["Type of Property"];
    
    return (
            <div tabIndex={0}>
                <h3 className="dropdown-header">{projectName}</h3>
                <img src={photo} className="photo"></img>
                <div className="content-container">
                    <label>Address:</label>
                    <h3>{address}</h3>        
                    <label>Developer's Fees:</label>
                    <h3>{developerFees}%</h3>        
                    <label>Type of Property:</label>
                    <h3>{propertyType}</h3>        
                    <label>{variableName}:</label>
                    <h3>{variableValue}</h3> 
                </div>
            </div>
    )
    }
 
};