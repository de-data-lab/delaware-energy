import mapInfo from "../utils/mapInfo";
import "./PointInfo.css"
import photo from "/images/harrington.png"


export const PointInfo = ({feature, variable, fundingSource}) => {

        const projectName = feature?.properties?.["PROJECT NAME & ADDRESS"];
        const districtName = feature?.properties?.["Senate District"];
        const senatorName = feature?.properties?.["name"];
        const address = feature?.properties?.["address"];
        const developerFees = feature?.properties?.["Applicable Credit Rate"];
        const propertyType = feature?.properties?.["Type of Property"];
        
        const allocationAmountName = mapInfo[fundingSource].columns["aggregated_allocation_amount"]
        let allocationAmount = feature?.properties?.["ALLOCATION AMOUNT"]
        if (allocationAmount !== "TBD") {
            allocationAmount = `$${parseInt(allocationAmount).toLocaleString()}`
        }
        
        const taxCreditsName = mapInfo[fundingSource].columns["aggregated_tax_credits"]
        const taxCredits = feature?.properties?.["# of Tax Credit Units"]

    return (
            <div tabIndex={0} className="popup-container">
                <div tabIndex={0} className="sumPopup-button-container">
                    <h3 className="dropdown-header">{projectName}</h3>
                    <img src={photo} className="photo"></img>
                    <div className="content-container">
                        <label><strong>Address:</strong></label>
                        <h3 className="info-text">{address}</h3>        
                        <label><strong>District:</strong></label>
                        <h3 className="info-text">{districtName}</h3>        
                        <label><strong>Developer's Fees:</strong></label>
                        <h3 className="info-text">{developerFees}%</h3>        
                        <label><strong>Type of Property:</strong></label>
                        <h3 className="info-text">{propertyType}</h3>        
                        <label><strong>{allocationAmountName}:</strong></label>
                        <h3 className="info-text">{allocationAmount}</h3> 
                        <label><strong>{taxCreditsName}:</strong></label>
                        <h3 className="info-text">{taxCredits}</h3> 
                    </div>
                </div>
            </div>
    )
};