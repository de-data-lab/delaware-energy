import { useEffect, useState } from "react";
import "./SumPopup.css"

function PopupText({variable, year, featureArray, source}){
    const [variableName, setVariableName] = useState(null)
    const [sumValue, setSumValue] = useState({
        sumValue:null,
        sumPercent: null
    })
    const [featureProps, setFeatureProps] =useState([{
        districtName:null, value: null
    }])
}
function SumPopup({ variable, year, featureArray, clearSelection, source }) {
  return (
    <div tabIndex={0} className="popup-container">
      <div className="sumPopup-button-container">
        <p>This is the data of {variable} in {year}</p>
        <button className="button" onClick={clearSelection}>
            <i className="fa-solid fa-trash"></i>
            <h3 className="button-text">Clear Selection</h3>
        </button>
      </div>
    </div>
  );
}

export default SumPopup
