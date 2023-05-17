import mapInfo from "../utils/mapInfo";
import "./PointInfo.css"
import photo from "/images/harrington.png"


export const PointInfo = ({feature, fundingSource}) => {

        const projectName = feature?.properties?.["PROJECT NAME & ADDRESS"];
        const districtName = feature?.properties?.["Senate District"];
        const address = feature?.properties?.["address"];
        const allocationYear = feature?.properties?.["Tax Allocation Year"];

        let propertyType = feature?.properties?.["Type of Property"];
        switch (propertyType) {
            case "F":
                propertyType = "Family"
                break;
            case "S":
                propertyType = "Senior"
                break;
            case "F and S":
                propertyType = "Family and Senior"
                break;
            case "SP":
                propertyType = "Special Population"
                break;
            default:
                propertyType = "N/A"
                break;
        }
        const allocationAmountName = mapInfo[fundingSource].columns["ALLOCATION AMOUNT"]
        
        let allocationAmount = feature?.properties?.["ALLOCATION AMOUNT"]
        if (allocationAmount !== "TBD") {
            allocationAmount = `$${parseFloat(allocationAmount).toLocaleString()}`
        }
        
        const taxCreditsName = mapInfo[fundingSource].columns["# of Tax Credit Units"]
        const taxCredits = feature?.properties?.["# of Tax Credit Units"]

    return (
            <div tabIndex={0} className="popup-container">
                <div className="sumPopup-button-container">
                    <h3 className="dropdown-header">{projectName}</h3>
                    <img src={photo} className="photo"></img>
                    <div className="content-container">
                        <div className="date-container">

                        </div>
                        <label className="info-text label-padding"><strong>Address:</strong></label>
                        <h3 className="info-text">{address}</h3>        
                        <label className="info-text label-padding"><strong>District:</strong></label>
                        <h3 className="info-text">{districtName}</h3>        
                        <label className="info-text label-padding"><strong>Tax Allocation Year:</strong></label>
                        <h3 className="info-text">{allocationYear}</h3>        
                        <label className="info-text label-padding"><strong>Type of Property:</strong></label>
                        <h3 className="info-text">{propertyType}</h3>        
                        <label className="info-text label-padding"><strong>{allocationAmountName}:</strong></label>
                        <h3 className="info-text">{allocationAmount}</h3> 
                        <label className="info-text label-padding"><strong>{taxCreditsName}:</strong></label>
                        <h3 className="info-text">{taxCredits}</h3> 
                    </div>
                </div>
            </div>
    )
};