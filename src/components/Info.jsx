import mapInfo from "../utils/mapInfo";
import "./Info.css";


export const Info = () => {
  

  return (
    <div className="container">
        <div className="info-container">
            <h2 className="information-header">Welcome!</h2>
            <h3 className="information-text">This interactive tool provides a map and charts for visualizing variables relating to different subsidized housing funding sources within the state of Delaware senate districts. Made possible through the collaboration of Tech Impact’s Data Innovation Lab with the Delaware State Housing Authority.</h3>
            <h2 className="information-header">Data Sources</h2>
            <h3 className="information-text">Senate district boundary file was taken from first state website -</h3>
            <h3 className="information-text">Housing data from Delaware State Housing Authority -</h3>
            <h3 className="information-text"></h3>
        </div>
    </div>
  );
};
